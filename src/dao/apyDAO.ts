import { MongoClient, Collection, Db } from "mongodb";
// import _ from "lodash";

let historicalDB: Db;
let apyCollection: Collection;

export default class CoursesDAO {
  static async injectDB(client: MongoClient) {
    try {
      historicalDB = await client.db("Historical");
      apyCollection = await historicalDB.collection("apy");
    } catch (error) {
      console.error(`Error Fetching Historical DB. error ${error}`);
      throw error;
    }
  }

  // dummy method just boilerplate
  static async getApys() {
    try {
      const apys = await apyCollection.find({}).toArray();
      return apys;
    } catch (error) {
      console.error(`Error Fetching Historical DB. error ${error}`);
      throw error;
    }
  }
}
