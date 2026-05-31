import { WorkTypeModel } from "../models/work-type.model";
import { toWorkTypeDto } from "../utils/mappers";

export class WorkTypesRepository {
  async findActive() {
    const docs = await WorkTypeModel.find({ isActive: true }).sort({ name: 1 }).lean();
    return docs.map((d) => toWorkTypeDto(d as Parameters<typeof toWorkTypeDto>[0]));
  }
}
