import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from "@clerk/express";
import clerkWebhooks from "./controllers/clerkWebhooks.js";

const app = express();

// 1) Route webhook: PHẢI đứng TRƯỚC express.json() và dùng raw body
app.post(
    "/api/clerk/webhook",
    express.raw({ type: "application/json" }),
    clerkWebhooks
);

app.use(cors());
app.use(express.json());

app.use("/api/clerk", clerkMiddleware());

app.get("/", (req, res) => res.send("API is working"));

const PORT = process.env.PORT || 3000;
(async () => {
    try {
        await connectDB();
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (err) {
        console.error("Failed to start server:", err);
        process.exit(1);
    }
})();
