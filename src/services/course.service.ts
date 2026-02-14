import dbConnect from "@/lib/db";
import Course, { CourseInput } from "@/models/Course";
import Unit from "@/models/Unit";

export class CourseService {
  async getAllCourses() {
    await dbConnect();
    const courses = await Course.find({}).sort({ createdAt: -1 }).lean();

    // Aggregate unitCount for each course
    const courseIds = courses.map((c: any) => c._id);
    const counts = await Unit.aggregate([
      { $match: { courseId: { $in: courseIds } } },
      { $group: { _id: "$courseId", count: { $sum: 1 } } },
    ]);
    const countMap = new Map(
      counts.map((c: any) => [c._id.toString(), c.count]),
    );

    return courses.map((c: any) => ({
      ...c,
      unitCount: countMap.get(c._id.toString()) || 0,
    }));
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
