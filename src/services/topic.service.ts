import dbConnect from "@/lib/db";
import Topic, { TopicInput } from "@/models/Topic";
import SessionGroup from "@/models/SessionGroup";
import SessionDetail from "@/models/SessionDetail";

export class TopicService {
  async getAllTopics(
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

    const topics = await Topic.find(query)
      .populate("unitId", "name courseId")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const total = await Topic.countDocuments(query);

    const topicIds = topics.map((t: any) => t._id);
    const counts = await SessionGroup.aggregate([
      { $match: { topicId: { $in: topicIds } } },
      { $group: { _id: "$topicId", count: { $sum: 1 } } },
    ]);
    const countMap = new Map(
      counts.map((c: any) => [c._id.toString(), c.count]),
    );

    const result = topics.map((t: any) => ({
      ...t,
      unitId: t.unitId?._id?.toString() || t.unitId,
      unitName: t.unitId?.name,
      courseId: t.unitId?.courseId?.toString(),
      sessionGroupCount: countMap.get(t._id.toString()) || 0,
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

  async getTopicsByUnitId(unitId: string) {
    await dbConnect();
    const topics = await Topic.find({ unitId })
      .populate("unitId", "name courseId")
      .sort({ sequence: 1 })
      .lean();

    const topicIds = topics.map((t: any) => t._id);
    const counts = await SessionGroup.aggregate([
      { $match: { topicId: { $in: topicIds } } },
      { $group: { _id: "$topicId", count: { $sum: 1 } } },
    ]);
    const countMap = new Map(
      counts.map((c: any) => [c._id.toString(), c.count]),
    );

    return topics.map((t: any) => ({
      ...t,
      unitId: t.unitId?._id?.toString() || t.unitId,
      unitName: t.unitId?.name,
      courseId: t.unitId?.courseId?.toString(),
      sessionGroupCount: countMap.get(t._id.toString()) || 0,
    }));
  }

  async getTopicById(id: string) {
    await dbConnect();
    return Topic.findById(id);
  }

  async createTopic(data: TopicInput, userId: string) {
    await dbConnect();

    const lastTopic = await Topic.findOne({ unitId: data.unitId })
      .sort({ sequence: -1 })
      .select("sequence");

    const sequence = lastTopic ? lastTopic.sequence + 1 : 0;

    return Topic.create({
      ...data,
      sequence,
      createdBy: userId,
      updatedBy: userId,
    });
  }

  async updateTopic(id: string, data: Partial<TopicInput>, userId: string) {
    await dbConnect();
    return Topic.findByIdAndUpdate(
      id,
      {
        ...data,
        updatedBy: userId,
      },
      { new: true, runValidators: true },
    );
  }

  async reorderTopics(unitId: string, topicIds: string[], userId: string) {
    await dbConnect();

    const operations = topicIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id, unitId },
        update: { $set: { sequence: index, updatedBy: userId } },
      },
    }));

    return Topic.bulkWrite(operations);
  }

  async getTopicWithChildren(id: string) {
    await dbConnect();

    const [topic, groups] = await Promise.all([
      Topic.findById(id)
        .populate({
          path: "unitId",
          select: "name courseId",
          populate: { path: "courseId", select: "name" },
        })
        .lean(),
      SessionGroup.find({ topicId: id }).sort({ sequence: 1 }).lean(),
    ]);

    if (!topic) return null;

    const groupIds = groups.map((g: any) => g._id);
    const counts = await SessionDetail.aggregate([
      { $match: { sessionGroupId: { $in: groupIds } } },
      { $group: { _id: "$sessionGroupId", count: { $sum: 1 } } },
    ]);
    const countMap = new Map(
      counts.map((c: any) => [c._id.toString(), c.count]),
    );

    const children = groups.map((g: any) => ({
      ...g,
      sessionCount: countMap.get(g._id.toString()) || 0,
    }));

    const unitRef = (topic as any).unitId as any;
    const courseRef = unitRef?.courseId as any;

    return {
      ...topic,
      unitId: unitRef?._id?.toString() || (topic as any).unitId,
      unitName: unitRef?.name,
      courseId: courseRef?._id?.toString(),
      children,
      breadcrumbs: [
        { _id: courseRef?._id?.toString(), name: courseRef?.name, type: "course" },
        { _id: unitRef?._id?.toString(), name: unitRef?.name, type: "unit" },
        { _id: (topic as any)._id, name: (topic as any).name, type: "topic" },
      ],
    };
  }

  async deleteTopic(id: string) {
    await dbConnect();
    return Topic.findByIdAndDelete(id);
  }
}

export const topicService = new TopicService();
