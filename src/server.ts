import express from "express";
import cors from "cors";

import apyRoutes from "./api/routes/apy";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
app.options("*", cors());

app.use("/apy", apyRoutes);

export default app;
