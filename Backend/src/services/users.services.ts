import prisma from "../config/prisma.js";
import type { Prisma } from "@prisma/client";
import type { User } from "../models/users.js";
import argon2 from 'argon2';

export async function createUser(input: User) {
    const { email, password, name, organization } = input;

    const passwordHash = await argon2.hash(password);
    const formattedEmail = email.trim().toLowerCase();

    try {

        const user = await prisma.users.create({
            data: {
                email: formattedEmail,
                password_hash: passwordHash,
                name: name,
                organization: organization
            },
            select: {
                id: true,
                email: true,
                name: true,
                updated_at:true,
                organization: true
            }
        });

        if (!user) {
            throw new Error("Unable to create new user!");
        }
        return user
    }
    catch (err: any) {
        throw err;
    }
}

export async function findUser(email: string, password: string){

    try {
        const userFound = await prisma.users.findUnique({
            where: {
                email: email
            },
        })
        if (!userFound) {
            throw new Error("Incorrect username or Password");
        }

        const hashed_password = userFound.password_hash;

        const verify = await argon2.verify(hashed_password, password);
        if (!verify) {
            throw new Error("Incorrect username or Password");
        }

        return {
            id: userFound.id,
            email: userFound.email,
            name: userFound.name,
            lastUpdated: userFound.updated_at,
            organization: userFound.organization
        };
    }
    catch (err) {
        console.log("Error occured + ", err);
    }
}