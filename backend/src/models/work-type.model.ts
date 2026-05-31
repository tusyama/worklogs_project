import { Schema, model, type InferSchemaType } from "mongoose";

const workTypeSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    defaultUnit: { type: String, default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export type WorkTypeDocument = InferSchemaType<typeof workTypeSchema> & {
  _id: import("mongoose").Types.ObjectId;
};

export const WorkTypeModel = model("WorkType", workTypeSchema);
