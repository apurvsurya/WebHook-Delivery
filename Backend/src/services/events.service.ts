import prisma from "../config/prisma.js";
import type { Prisma } from "@prisma/client";
import type { CreatedEvent, CreateEventInput } from "../models/events.models.js";

export async function createEvent(input: CreateEventInput) {
   const { destinationId, eventType, payload, userId } = input;

   return prisma.$transaction(async (tx: Prisma.TransactionClient) => {

      // Find the given destination
      const destination = await tx.destinations.findFirst({
         where: {
            id: destinationId,
            user_id: userId
         },
         select: {
            id: true
         },
      });

      if (!destination) {
         throw new Error("Destintation not found for the given Id");
      }

      const event = await tx.events.create({
         data: {
            destination_id: destination.id,
            event_type: eventType,
            payload: payload,
            status: "pending"
         }
      });

      //Create the corresponding delivery job
      await tx.delivery_jobs.create({
         data: {
            event_id: event.id,
         }
      })

      return event;
   })

}

export async function getAllEvents(userId: string) {
   return prisma.events.findMany({
      where: {
         destinations: {
            user_id: userId
         }
      },
      include: {
         destinations: {
            select: {
               url: true
            }
         },
         payload:false
      },
      orderBy: {
         created_at: "desc"
      }
   });
}