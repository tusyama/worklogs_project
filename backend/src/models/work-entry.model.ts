import { Schema, model, type InferSchemaType, Types } from "mongoose";

const workEntrySchema = new Schema(
  {
    completedAt: { type: Date, required: true },
    workTypeId: { type: Schema.Types.ObjectId, ref: "WorkType", required: true, index: true },
    volume: { type: Number, required: true, min: 0.0001, max: 1_000_000_000 },
    unit: { type: String, required: true, trim: true, maxlength: 32 },
    performerName: { type: String, required: true, trim: true, maxlength: 200 },
  },
  { timestamps: true },
);

workEntrySchema.index({ completedAt: -1 });

export type WorkEntryDocument = InferSchemaType<typeof workEntrySchema> & {
  _id: Types.ObjectId;
  workTypeId: Types.ObjectId | { _id: Types.ObjectId; name: string };
};

export const WorkEntryModel = model("WorkEntry", workEntrySchema);
