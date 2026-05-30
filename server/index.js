import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDb from "./config/database.js";
import errorHandler from "./middleware/errorHandler.js";
import authRoute from "./routes/auth.Route.js";
import sessionRoute from "./routes/sessionRoute.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT;
const corsOptions = {
    origin: process.env.CLIENT_URL.split(','), // Replace with your frontend URL
    credentials: true, // Allow cookies and authentication headers
};

connectDb();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
    res.json({
        status:"OK",
        message:"Live server is running",
        timestamp: new Date().toISOString()
    })
});

//api routes
app.use("/api/auth",authRoute);
app.use("/api/session",sessionRoute);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});