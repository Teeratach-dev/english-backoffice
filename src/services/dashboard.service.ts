import dbConnect from "@/lib/db";
import User from "@/models/User";
import Course from "@/models/Course";
import Topic from "@/models/Topic";
import SessionDetail from "@/models/SessionDetail";
import SessionGroup from "@/models/SessionGroup";
import SessionTemplate from "@/models/SessionTemplate";

export async function getDashboardStats() {
  await dbConnect();

  const [
    totalUsers,
    activeCourses,
    activeTopics,
    activeSessionGroups,
    activeSessions,
    activeSessionTemplates,
  ] = await Promise.all([
    User.countDocuments(),
    Course.countDocuments({ isActive: true }),
    Topic.countDocuments({ isActive: true }),
    SessionGroup.countDocuments({ isActive: true }),
    SessionDetail.countDocuments({ isActive: true }),
    SessionTemplate.countDocuments({ isActive: true }),
  ]);

  return {
    totalUsers,
    activeCourses,
    activeTopics,
    activeSessionGroups,
    activeSessions,
    activeSessionTemplates,
  };
}
