import { Request, Response } from "express";
import ApyModel from "../../models/apy";

export default class CourseController {
  static async getApyHistory(req: Request, res: Response) {
    try {
      const { symbol } = req.params;
      const { interval, from, to } = req.query;

      const fetchedApies = await ApyModel.getApiesBySymbol(
        symbol,
        from as string,
        to as string,
        Number(interval),
      );

      return res.status(200).send(fetchedApies);
    } catch (error) {
      console.error(`Failed at apyController/getApyHistory. error: ${error}`);
      return res.status(500).json(error);
    }
  }
}
