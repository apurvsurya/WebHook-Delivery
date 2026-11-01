import type { NextFunction, Request, Response } from "express";
import type { User } from "../models/users.js";
import { createUser, findUser } from "../services/users.services.js";
import { error } from "node:console";
import { jwt, ZodJWT } from "zod";
import { generateAccessToken } from "../services/token.service.js";


export async function CreateUser(req: Request, res: Response, next: NextFunction) {

    const input: User = req.body;

    try {
        const userCreated = await createUser(input);

        if (!userCreated) {
            return res.status(400).json({
                message: "Unable to create the user! Error occurred"
            })
        }
        return res.status(201).json({
            message: "User Created",
            data: userCreated
        });
    }
    catch (err: any) {
        if (err.code === "P2002") {
            return res.status(409).json({
                message: "An account already exists with this email."
            });
        }

        console.error("Registration error:", err);

        return res.status(500).json({
            message: "Unable to create your account."
        });
    }
}

export async function Login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    try {
        const user = await findUser(email, password);
        if (!user) {
            return res.status(404).json({
                message: "User not found! Please enter correct credentials."
            })
        }

        const accessToken = generateAccessToken(user.id, user.email);
        if (!accessToken) {
            return res.status(400).json({
                message: "Error occurred while loggging you in!"
            })
        }
        return res.status(200).json({
            message: "Login successful",
            token: accessToken,
            data: user
        })
    }
    catch (err) {
        console.log("Error occurred while logging in the User!");
        return res.status(400).json({
            message: "Error occurred while loggin you in!",
        })
    }

    
}