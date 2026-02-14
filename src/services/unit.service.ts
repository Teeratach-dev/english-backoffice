import dbConnect from "@/lib/db";
import Unit, { UnitInput } from "@/models/Unit";

export class UnitService {
  async getUnitsByCourseId(courseId: string) {
    await dbConnect();
    return Unit.find({ courseId }).sort({ sequence: 1 });
  }

  async getUnitById(id: string) {
    await dbConnect();
    return Unit.findById(id);
  }

  async createUnit(data: UnitInput, userId: string) {
    await dbConnect();

    // Find highest sequence for this course
    const lastUnit = await Unit.findOne({ courseId: data.courseId })
      .sort({ sequence: -1 })
      .select("sequence");

    const sequence = lastUnit ? lastUnit.sequence + 1 : 0;

    return Unit.create({
      ...data,
      sequence,
      createdBy: userId,
      updatedBy: userId,
    });
  }

  async updateUnit(id: string, data: Partial<UnitInput>, userId: string) {
    await dbConnect();
    return Unit.findByIdAndUpdate(
      id,
      {
        ...data,
        updatedBy: userId,
      },
      { new: true, runValidators: true },
    );
  }

  async reorderUnits(courseId: string, unitIds: string[], userId: string) {
    await dbConnect();

    // Bulk update sequences
    const operations = unitIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id, courseId },
        update: { $set: { sequence: index, updatedBy: userId } },
      },
    }));

    return Unit.bulkWrite(operations);
  }

  async deleteUnit(id: string) {
    await dbConnect();
    return Unit.findByIdAndDelete(id);
  }
}

export const unitService = new UnitService();
