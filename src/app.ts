import mongoose from "mongoose";
import "dotenv/config";
import app from "./server";
import updateApys from "./tasks/updateApys";

const uri = process.env.MONGODB_URI as string;
const PORT = +process.env.PORT! || 8000;
const INTERVAL = +process.env.INTERVAL! || 3600;

mongoose
  .connect(uri, {
    dbName: "Historical",
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .then(async () => {
    await updateApys();

    setInterval(async () => {
      await updateApys();
    }, INTERVAL * 1000);

    app.listen(PORT, () => {
      console.log(`listening on port: ${PORT}`);
    });
  });
