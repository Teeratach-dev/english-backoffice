import dbConnect from "@/lib/db";
import SessionDetail, { SessionDetailInput } from "@/models/SessionDetail";

export class SessionDetailService {
  async getSessionsByGroupId(sessionGroupId: string) {
    await dbConnect();
    return SessionDetail.find({ sessionGroupId }).sort({ sequence: 1 });
  }

  async getSessionById(id: string) {
    await dbConnect();
    return SessionDetail.findById(id);
  }

  async createSession(data: SessionDetailInput, userId: string) {
    await dbConnect();

    const lastSession = await SessionDetail.findOne({
      sessionGroupId: data.sessionGroupId,
    })
      .sort({ sequence: -1 })
      .select("sequence");

    const sequence = lastSession ? lastSession.sequence + 1 : 0;

    return SessionDetail.create({
      ...data,
      sequence,
      createdBy: userId,
      updatedBy: userId,
    });
  }

  async updateSession(
    id: string,
    data: Partial<SessionDetailInput>,
    userId: string,
  ) {
    await dbConnect();
    return SessionDetail.findByIdAndUpdate(
      id,
      {
        ...data,
        updatedBy: userId,
      },
      { new: true, runValidators: true },
    );
  }

  async reorderSessions(
    sessionGroupId: string,
    sessionIds: string[],
    userId: string,
  ) {
    await dbConnect();

    const operations = sessionIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id, sessionGroupId },
        update: { $set: { sequence: index, updatedBy: userId } },
      },
    }));

    return SessionDetail.bulkWrite(operations);
  }

  async deleteSession(id: string) {
    await dbConnect();
    return SessionDetail.findByIdAndDelete(id);
  }
}

export const sessionDetailService = new SessionDetailService();
