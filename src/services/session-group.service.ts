import dbConnect from "@/lib/db";
import SessionGroup, { SessionGroupInput } from "@/models/SessionGroup";

export class SessionGroupService {
  async getGroupsByTopicId(topicId: string) {
    await dbConnect();
    return SessionGroup.find({ topicId }).sort({ sequence: 1 });
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
