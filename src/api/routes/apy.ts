import express from "express";
import apyController from "../controllers/apyController";

const router = express.Router();

router.route("/:symbol").get(apyController.getApyHistory);

export default router;
