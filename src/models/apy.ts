import { Model, Schema, model } from "mongoose";
import { IApyRecord } from "../interfaces/index";

interface IApy {
  timestamp: Schema.Types.Date;
  data: IApyRecord[];
}

interface ApyModel extends Model<IApy> {
  insertNewApys: (timestamp: string, data: IApyRecord[]) => void;
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

const Apy = model<IApy, ApyModel>("Apy", ApySchema);
export default Apy;
