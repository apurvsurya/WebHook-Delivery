import { randomBytes } from "node:crypto";
import { pool } from "../config/db.js";
import type { Destination, RegisterDestinationInput } from "../models/destinations.models.js";

export async function registerDestination(input: RegisterDestinationInput): Promise<Destination> {
    const { url } = input;
    let parsedUrl: URL;
    try {
        parsedUrl = new URL(url);
    }
    catch {
        throw new Error("Invalid destination URL");
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        throw new Error("Only HTTP or HTTPS URLs are allowed!");
    }

    // 2. Generate a unique secret for signing webhook requests
    const secret = randomBytes(32).toString("hex");

    const query = `INSERT INTO webhooktools.destinations (url,secret) VALUES ($1,$2) RETURNING id, url,secret, created_at;`;

    const result = await pool.query<Destination>(query, [url, secret]);

    const destination = result.rows[0];

    if (!destination) {
        throw new Error("Failed to register destination");
    }
    return destination;
}