import express from "express";
// import cors from "cors";

// import questionRoutes from "./api/routes/question";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// app.use("/question", questionRoutes);

export default app;
