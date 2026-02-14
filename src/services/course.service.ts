import dbConnect from "@/lib/db";
import Course, { CourseInput } from "@/models/Course";

export class CourseService {
  async getAllCourses() {
    await dbConnect();
    return Course.find({}).sort({ createdAt: -1 });
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
