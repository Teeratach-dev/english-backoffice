import dbConnect from "@/lib/db";
import Unit, { UnitInput } from "@/models/Unit";
import Topic from "@/models/Topic";

export class UnitService {
  async getAllUnits(
    params: {
      page?: number;
      limit?: number;
      search?: string;
      isActive?: boolean;
    } = {},
  ) {
    await dbConnect();
    const page = params.page || 1;
    const limit = params.limit || 10;
    const search = params.search || "";

    const query: any = {};
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    if (params.isActive !== undefined) {
      query.isActive = params.isActive;
    }

    const units = await Unit.find(query)
      .populate("courseId", "name")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const total = await Unit.countDocuments(query);

    const unitIds = units.map((u: any) => u._id);
    const counts = await Topic.aggregate([
      { $match: { unitId: { $in: unitIds } } },
      { $group: { _id: "$unitId", count: { $sum: 1 } } },
    ]);
    const countMap = new Map(
      counts.map((c: any) => [c._id.toString(), c.count]),
    );

    const result = units.map((u: any) => ({
      ...u,
      courseId: u.courseId?._id?.toString() || u.courseId,
      courseName: u.courseId?.name,
      topicCount: countMap.get(u._id.toString()) || 0,
    }));

    return {
      data: result,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getUnitsByCourseId(courseId: string) {
    await dbConnect();
    const units = await Unit.find({ courseId })
      .populate("courseId", "name")
      .sort({ sequence: 1 })
      .lean();

    const unitIds = units.map((u: any) => u._id);
    const counts = await Topic.aggregate([
      { $match: { unitId: { $in: unitIds } } },
      { $group: { _id: "$unitId", count: { $sum: 1 } } },
    ]);
    const countMap = new Map(
      counts.map((c: any) => [c._id.toString(), c.count]),
    );

    return units.map((u: any) => ({
      ...u,
      courseId: u.courseId?._id?.toString() || u.courseId,
      courseName: u.courseId?.name,
      topicCount: countMap.get(u._id.toString()) || 0,
    }));
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
