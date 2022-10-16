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
    const now = new Date();
    const utcMinutes = now.getUTCMinutes();
    const utcSeconds = now.getUTCSeconds();

    // wait for x seconds to have round hours in recorded timestamps
    // e.g 16:00, 3:00 or 00:00
    // this prevents timestamps such as 2:42 or 3:01
    const waitForSeconds =
      ((60 - utcMinutes) % 60) * 60 + ((60 - utcSeconds) % 60);

    setTimeout(() => {
      updateApys();
      setInterval(async () => {
        await updateApys();
      }, INTERVAL * 1000);
    }, waitForSeconds * 1000);

    app.listen({ port: PORT }, () => {
      console.log(`listening on port: ${PORT}`);
    });
  });
