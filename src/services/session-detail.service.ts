import dbConnect from "@/lib/db";
import SessionDetail, { SessionDetailInput } from "@/models/SessionDetail";

export class SessionDetailService {
  async getAllSessions(
    params: { page?: number; limit?: number; search?: string } = {},
  ) {
    await dbConnect();
    const page = params.page || 1;
    const limit = params.limit || 100;
    const search = params.search || "";

    const query = search ? { name: { $regex: search, $options: "i" } } : {};

    const sessions = await SessionDetail.find(query)
      .populate("sessionGroupId", "name")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const total = await SessionDetail.countDocuments(query);

    const result = sessions.map((s: any) => ({
      ...s,
      sessionGroupId: s.sessionGroupId?._id?.toString() || s.sessionGroupId,
      sessionGroupName: s.sessionGroupId?.name,
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

  async getSessionsByGroupId(sessionGroupId: string) {
    await dbConnect();
    const sessions = await SessionDetail.find({ sessionGroupId })
      .populate("sessionGroupId", "name")
      .sort({ sequence: 1 })
      .lean();

    return sessions.map((s: any) => ({
      ...s,
      sessionGroupId: s.sessionGroupId?._id?.toString() || s.sessionGroupId,
      sessionGroupName: s.sessionGroupId?.name,
    }));
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
