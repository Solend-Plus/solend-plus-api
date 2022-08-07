import { MongoClient, ServerApiVersion } from "mongodb";
// import { SolendMarket } from "@solendprotocol/solend-sdk";
// import { Connection, clusterApiUrl } from "@solana/web3.js";
import "dotenv/config";
import app from "./server";
import ApyDAO from "./dao/apyDAO";

const uri = process.env.MONGODB_URI as string;
const PORT = +process.env.PORT! || 8000;

MongoClient.connect(uri, { serverApi: ServerApiVersion.v1 })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .then(async (client) => {
    // *: inject client to DAOs here
    await ApyDAO.injectDB(client);
    // *: inject client to DAOs here

    app.listen(PORT, () => {
      console.log(`listening on port: ${PORT}`);
    });

    // const cluster = await clusterApiUrl("mainnet-beta");
    // const connection = new Connection(cluster, "confirmed");

    // const market = await SolendMarket.initialize(connection, "production");
    // await market.loadReserves();

    // // const usdcReserve = market.reserves.find(
    // //   (res) => res.config.symbol === "USDC",
    // // );
    // // console.log(usdcReserve!.stats!.totalDepositsWads.toString());

    // await market.loadRewards();

    // market.reserves.forEach((res) => {
    //   console.log(res.config.name);
    //   console.log(res.totalSupplyAPY());
    //   // console.log(res.stats!.borrowInterestAPY); // {apy: 0.07, rewardMint: "SLND...
    // });
  });

(async () => {})();
