import prisma from "../config/prisma.js";
import type { Prisma } from "@prisma/client";
import type { CreatedEvent, CreateEventInput } from "../models/events.models.js";

export async function createEvent(input: CreateEventInput) {
   const { destinationId, eventType, payload } = input;

   return prisma.$transaction(async (tx:Prisma.TransactionClient)=>{

      const destination = await tx.destinations.findUnique({
         where:{
            id:destinationId
         },
         select:{
            id:true
         },
      });

      if(!destination){
         throw new Error("Destintation not found for the given Id");
      }

      //Create the event
      const event = await tx.events.create({
         data:{
            destination_id:destination.id,
            event_type:eventType,
            payload:payload,
            status:"pending"
         }
      });

      //Create the corresponding delivery job
      await tx.delivery_jobs.create({
         data:{
            event_id:event.id,
         }
      })

      return event;
   })

}