import "dotenv/config";
import { jobQueue } from "../queues/queue.js";
import { findJobById, findPendingJobs } from "../services/jobs.services.js";
import { Client } from "pg";
import type { DeliveryJob } from "../models/jobs.js";

const listener = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function publishJob(job: DeliveryJob) {

  if (job.status !== "pending") {
    return null;
  }
  const queuedJob = await jobQueue.add(`delivery-${job.id}`,
    {
      eventDetails: job.events,
    },
    {
      jobId: `delivery-${job.id}`,
      attempts: 7,
      backoff: {
        type: "exponential",
        delay: 1000,
      },
    }
  )
  console.log(`Job ${job.id} published to BullMQ.`);
  console.log("BullMQ ID:", queuedJob.id);

}


export async function ListenToJobCreated() {
  try {
    await listener.connect();
    await listener.query("LISTEN delivery_job_created;");

    console.log("Listening for new jobs...");

    listener.on("notification", (msg) => {
      if (msg.channel !== "delivery_job_created" || !msg.payload) {
        return;
      }
      console.log("New delivery job notification:", msg.payload);

      void handleNotification(msg.payload);
    })

    ReconcilePendingJobs();
  }
  catch (error) {
    console.error("Error while listening to Jobs :", error);
    throw error;
  }
}

ListenToJobCreated().catch((error) => {
  console.error("Failed to add job:", error);
  process.exitCode = 1;
});


async function handleNotification(payload: string) {
  try {
    if (!/^\d+$/.test(payload)) {
      console.error("Invalid job ID received:", payload);
      return;
    }

    const job = await findJobById(payload);

    if (!job) {
      console.log(`Job ${payload} not found.`);
      return;
    }

    await publishJob(job);

  } catch (error) {
    console.error(`Error processing job ${payload}:`, error);
  }
}

async function ReconcilePendingJobs() {
  try {
    const pendingJobs = await findPendingJobs();
    for (const job of pendingJobs) {
      try {
        await publishJob(job);
      }
      catch (error) {
        console.error(`Error publishing pending job ${job.id}:`, error);
      }
    }
    console.log(
      `Reconciliation completed. Found ${pendingJobs.length} pending jobs.`
    );
  }
  catch (error) {
    console.error("Error while reconciling pending jobs:", error);
  }
}