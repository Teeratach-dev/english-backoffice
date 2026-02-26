import dbConnect from "@/lib/db";
import SessionGroup, { SessionGroupInput } from "@/models/SessionGroup";
import SessionDetail from "@/models/SessionDetail";

export class SessionGroupService {
  async getAllGroups(
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

    const groups = await SessionGroup.find(query)
      .populate({
        path: "topicId",
        select: "name unitId",
        populate: {
          path: "unitId",
          select: "courseId",
        },
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const total = await SessionGroup.countDocuments(query);

    const groupIds = groups.map((g: any) => g._id);
    const counts = await SessionDetail.aggregate([
      { $match: { sessionGroupId: { $in: groupIds } } },
      { $group: { _id: "$sessionGroupId", count: { $sum: 1 } } },
    ]);
    const countMap = new Map(
      counts.map((c: any) => [c._id.toString(), c.count]),
    );

    const result = groups.map((g: any) => ({
      ...g,
      topicId: g.topicId?._id?.toString() || g.topicId,
      topicName: g.topicId?.name,
      unitId: g.topicId?.unitId?._id?.toString() || g.topicId?.unitId,
      courseId: g.topicId?.unitId?.courseId?.toString(),
      sessionCount: countMap.get(g._id.toString()) || 0,
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

  async getGroupsByTopicId(topicId: string) {
    await dbConnect();
    const groups = await SessionGroup.find({ topicId })
      .populate({
        path: "topicId",
        select: "name unitId",
        populate: {
          path: "unitId",
          select: "courseId",
        },
      })
      .sort({ sequence: 1 })
      .lean();

    const groupIds = groups.map((g: any) => g._id);
    const counts = await SessionDetail.aggregate([
      { $match: { sessionGroupId: { $in: groupIds } } },
      { $group: { _id: "$sessionGroupId", count: { $sum: 1 } } },
    ]);
    const countMap = new Map(
      counts.map((c: any) => [c._id.toString(), c.count]),
    );

    return groups.map((g: any) => ({
      ...g,
      topicId: g.topicId?._id?.toString() || g.topicId,
      topicName: g.topicId?.name,
      unitId: g.topicId?.unitId?._id?.toString() || g.topicId?.unitId,
      courseId: g.topicId?.unitId?.courseId?.toString(),
      sessionCount: countMap.get(g._id.toString()) || 0,
    }));
  }

  async getGroupById(id: string) {
    await dbConnect();
    return SessionGroup.findById(id);
  }

  async createGroup(data: SessionGroupInput, userId: string) {
    await dbConnect();

    const lastGroup = await SessionGroup.findOne({ topicId: data.topicId })
      .sort({ sequence: -1 })
      .select("sequence");

    const sequence = lastGroup ? lastGroup.sequence + 1 : 0;

    return SessionGroup.create({
      ...data,
      sequence,
      createdBy: userId,
      updatedBy: userId,
    });
  }

  async updateGroup(
    id: string,
    data: Partial<SessionGroupInput>,
    userId: string,
  ) {
    await dbConnect();
    return SessionGroup.findByIdAndUpdate(
      id,
      {
        ...data,
        updatedBy: userId,
      },
      { new: true, runValidators: true },
    );
  }

  async reorderGroups(topicId: string, groupIds: string[], userId: string) {
    await dbConnect();

    const operations = groupIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id, topicId },
        update: { $set: { sequence: index, updatedBy: userId } },
      },
    }));

    return SessionGroup.bulkWrite(operations);
  }

  async getGroupWithChildren(id: string) {
    await dbConnect();

    const [group, sessions] = await Promise.all([
      SessionGroup.findById(id)
        .populate({
          path: "topicId",
          select: "name unitId",
          populate: {
            path: "unitId",
            select: "name courseId",
            populate: { path: "courseId", select: "name" },
          },
        })
        .lean(),
      SessionDetail.find({ sessionGroupId: id })
        .select("-screens")
        .sort({ sequence: 1 })
        .lean(),
    ]);

    if (!group) return null;

    const topicRef = (group as any).topicId as any;
    const unitRef = topicRef?.unitId as any;
    const courseRef = unitRef?.courseId as any;

    return {
      ...group,
      topicId: topicRef?._id?.toString() || (group as any).topicId,
      topicName: topicRef?.name,
      unitId: unitRef?._id?.toString(),
      courseId: courseRef?._id?.toString(),
      children: sessions,
      breadcrumbs: [
        { _id: courseRef?._id?.toString(), name: courseRef?.name, type: "course" },
        { _id: unitRef?._id?.toString(), name: unitRef?.name, type: "unit" },
        { _id: topicRef?._id?.toString(), name: topicRef?.name, type: "topic" },
        {
          _id: (group as any)._id,
          name: (group as any).name,
          type: "sessionGroup",
        },
      ],
    };
  }

  async deleteGroup(id: string) {
    await dbConnect();
    return SessionGroup.findByIdAndDelete(id);
  }
}

export const sessionGroupService = new SessionGroupService();
