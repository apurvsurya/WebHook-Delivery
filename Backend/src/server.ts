import express from "express";
import helmet from "helmet";
import { pool } from "./config/db.js";
import cors from "cors";

import destinationRoutes from "./routes/destination.routes.js";
import eventRoutes from "./routes/events.router.js";
import userRoutes from "./routes/users.routes.js"
import jobRoutes from "./routes/jobs.routes.js"

const app = express();
const PORT:number = 3000;

app.use(helmet());

app.use(cors({
    origin:"http://localhost:4200"
}))

app.use(express.json());

//Routes

app.use("/destinations",destinationRoutes);
app.use("/events",eventRoutes);
app.use("/user",userRoutes);
app.use("/jobs",jobRoutes);




app.get("/health", (_req,res)=>{
    const date = new Date().toISOString();
    res.status(200).json({
        status:"ok",
        service:"webhook-delivery",
        timeStamp:date
    });
});

app.get("/dbhealth",async (req,res)=>{
    try{
        const result = await pool.query("SELECT NOW() AS database_time");

        res.status(200).json({
            status:"ok",
            databaseTime:result.rows[0]
        });
    }
    catch (err:any){
        res.status(503).json({
            status:503,
            message:"Database unavailable!",
            error:err.message
        });
    }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


