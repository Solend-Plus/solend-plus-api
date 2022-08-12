import { Model, Schema, model } from "mongoose";
import { IApyRecord } from "../interfaces/index";
import dateRangeToParts from "../utils/dateRangeToParts";

interface IApy {
  timestamp: Schema.Types.Date;
  data: IApyRecord[];
}

interface ApyModel extends Model<IApy> {
  insertNewApys: (timestamp: string, data: IApyRecord[]) => void;
  getApiesBySymbol: (
    symbol: string,
    from: string,
    to: string,
    interval?: number,
  ) => IApyRecord[];
}

const ApyRecordsSchema = new Schema<IApyRecord>(
  {
    symbol: {
      type: String,
      required: true,
    },
    supplyAPY: {
      type: Number,
      required: true,
    },
    borrowApy: {
      type: Number,
      required: true,
    },
  },
  {
    _id: false,
  },
);

const ApySchema = new Schema<IApy, ApyModel>({
  timestamp: {
    type: Schema.Types.Date,
    required: true,
  },

  data: [ApyRecordsSchema],
});

ApySchema.statics.insertNewApys = function (
  timestamp: string,
  data: IApyRecord[],
) {
  try {
    const newApyDoc = new this({
      timestamp,
      data,
    });

    newApyDoc.save();
  } catch (error) {
    console.error(`Error Fetching Historical DB. error ${error}`);
    throw error;
  }
};

ApySchema.statics.getApiesBySymbol = async function (
  symbol: string,
  from: string,
  to: string,
  interval = 24,
) {
  try {
    const getApiesBySymbolPipeline: any = [
      {
        $match: {
          timestamp: {
            $gte: new Date(from),
            $lte: new Date(to),
          },
        },
      },
      {
        $project: {
          timestamp: {
            year: {
              $year: {
                date: "$timestamp",
              },
            },
            month: {
              $month: {
                date: "$timestamp",
              },
            },
            day: {
              $dayOfMonth: {
                date: "$timestamp",
              },
            },
            hour: {
              $hour: {
                date: "$timestamp",
              },
            },
          },
          data: 1,
        },
      },
      {
        $project: {
          timestamp: 1,
          _id: 0,
          data: {
            $arrayElemAt: [
              "$data",
              {
                $indexOfArray: ["$data.symbol", symbol],
              },
            ],
          },
        },
      },
    ];

    if (interval !== 1) {
      const { year, month, day, hour } = dateRangeToParts(from, to, interval);

      getApiesBySymbolPipeline.splice(2, 0, {
        $match: {
          "timestamp.year": {
            $in: year,
          },
          "timestamp.month": {
            $in: month,
          },
          "timestamp.day": {
            $in: day,
          },
          "timestamp.hour": {
            $in: hour,
          },
        },
      });
    }

    const fetchedRecords = await this.aggregate(getApiesBySymbolPipeline);

    return fetchedRecords;
  } catch (error) {
    console.error(`Error Fetching Historical DB. error ${error}`);
    throw error;
  }
};

const Apy = model<IApy, ApyModel>("Apy", ApySchema);
export default Apy;
