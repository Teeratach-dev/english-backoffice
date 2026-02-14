import dbConnect from "@/lib/db";
import Topic, { TopicInput } from "@/models/Topic";

export class TopicService {
  async getTopicsByUnitId(unitId: string) {
    await dbConnect();
    return Topic.find({ unitId }).sort({ sequence: 1 });
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

  async deleteTopic(id: string) {
    await dbConnect();
    return Topic.findByIdAndDelete(id);
  }
}

export const topicService = new TopicService();
