import type { JobList } from "../models/jobs.js";
import "dotenv/config";
import { jobQueue } from "../queues/queue.js";
import { findPendingJobs } from "../services/jobs.services.js";

async function main() {

  const jobList = await findPendingJobs();

  if (jobList.length === 0) {
    console.log("No pending jobs found.");
    await jobQueue.close();
    return;
  }


  const queuedJobs = await Promise.all(jobList.map((job) => {
    jobQueue.add(`delivery-${job.id}`,
      {
        eventDetails: job.events,
      },
      {
        jobId: `delivery-${job.id}-${Date.now()}`,
        attempts: 7,
        backoff: {
          type: "exponential",
          delay: 1000,
        },
      }
    )
    console.log("Job ID:", job.id);
    console.log("Job added successfully!");
  }))


  await jobQueue.close();
}

main().catch((error) => {
  console.error("Failed to add job:", error);
  process.exitCode = 1;
});