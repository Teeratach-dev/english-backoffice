import dbConnect from "@/lib/db";
import Course, { CourseInput } from "@/models/Course";
import Unit from "@/models/Unit";

export class CourseService {
  async getAllCourses(
    params: {
      page?: number;
      limit?: number;
      search?: string;
      isActive?: boolean;
      purchaseable?: boolean;
    } = {},
  ) {
    await dbConnect();
    const page = params.page || 1;
    const limit = params.limit || 100;
    const search = params.search || "";

    const query: any = {};
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    if (params.isActive !== undefined) {
      query.isActive = params.isActive;
    }
    if (params.purchaseable !== undefined) {
      query.purchaseable = params.purchaseable;
    }

    const courses = await Course.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const total = await Course.countDocuments(query);

    // Aggregate unitCount for each course
    const courseIds = courses.map((c: any) => c._id);
    const counts = await Unit.aggregate([
      { $match: { courseId: { $in: courseIds } } },
      { $group: { _id: "$courseId", count: { $sum: 1 } } },
    ]);
    const countMap = new Map(
      counts.map((c: any) => [c._id.toString(), c.count]),
    );

    const result = courses.map((c: any) => ({
      ...c,
      unitCount: countMap.get(c._id.toString()) || 0,
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

  async getCourseById(id: string) {
    await dbConnect();
    return Course.findById(id);
  }

  async createCourse(data: CourseInput, userId: string) {
    await dbConnect();
    return Course.create({
      ...data,
      createdBy: userId,
      updatedBy: userId,
    });
  }

  async updateCourse(id: string, data: Partial<CourseInput>, userId: string) {
    await dbConnect();
    return Course.findByIdAndUpdate(
      id,
      {
        ...data,
        updatedBy: userId,
      },
      { new: true, runValidators: true },
    );
  }

  async deleteCourse(id: string) {
    await dbConnect();
    return Course.findByIdAndDelete(id);
  }
}

// Export a singleton instance
export const courseService = new CourseService();
