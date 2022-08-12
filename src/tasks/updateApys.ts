import { SolendMarket } from "@solendprotocol/solend-sdk";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import ApyModel from "../models/apy";

export default async function updateApys() {
  const cluster = await clusterApiUrl("mainnet-beta");
  const connection = new Connection(cluster, "confirmed");
  const currentTimeStamp = new Date().toUTCString();

  const market = await SolendMarket.initialize(connection, "production");
  await market.loadReserves();
  await market.loadRewards();

  const newApyData = market.reserves.map((res) => ({
    symbol: res.config.symbol,
    supplyAPY: res.totalSupplyAPY().totalAPY,
    borrowApy: res.totalBorrowAPY().totalAPY,
  }));

  await ApyModel.insertNewApys(currentTimeStamp, newApyData);

  console.log(`Updated APYs in ${currentTimeStamp} successfully`);
}
