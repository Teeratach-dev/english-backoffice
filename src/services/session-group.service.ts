import dbConnect from "@/lib/db";
import SessionGroup, { SessionGroupInput } from "@/models/SessionGroup";
import SessionDetail from "@/models/SessionDetail";

export class SessionGroupService {
  async getAllGroups() {
    await dbConnect();
    const groups = await SessionGroup.find({})
      .populate("topicId", "name")
      .sort({ createdAt: -1 })
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
      sessionCount: countMap.get(g._id.toString()) || 0,
    }));
  }

  async getGroupsByTopicId(topicId: string) {
    await dbConnect();
    const groups = await SessionGroup.find({ topicId })
      .populate("topicId", "name")
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

  async deleteGroup(id: string) {
    await dbConnect();
    return SessionGroup.findByIdAndDelete(id);
  }
}

export const sessionGroupService = new SessionGroupService();
