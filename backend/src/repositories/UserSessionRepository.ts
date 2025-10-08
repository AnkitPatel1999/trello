import { BaseRepository } from './BaseRepository';
import { UserSession, IUserSessionDocument } from '../models/UserSession.model';

export class UserSessionRepository extends BaseRepository<IUserSessionDocument> {
  constructor() {
    super(UserSession);
  }

  async findByUserId(userId: string): Promise<IUserSessionDocument[]> {
    return this.find({ userId }, { sort: { connectedAt: -1 } });
  }

  async findBySocketId(socketId: string): Promise<IUserSessionDocument | null> {
    return this.findOne({ socketId });
  }

  async createOrUpdate(sessionData: any): Promise<IUserSessionDocument> {
    const existingSession = await this.findOne({ socketId: sessionData.socketId });
    
    if (existingSession) {
      return this.update(existingSession._id!, {
        ...sessionData,
        lastActivity: new Date(),
        isActive: true,
      });
    } else {
      return this.create(sessionData);
    }
  }

  async updateActivity(userId: string): Promise<void> {
    await this.model.updateMany(
      { userId, isActive: true },
      { lastActivity: new Date() }
    );
  }

  async deactivateBySocketId(socketId: string): Promise<boolean> {
    const result = await this.updateOne(
      { socketId },
      { isActive: false }
    );
    return !!result;
  }

  async cleanupInactive(threshold: Date): Promise<number> {
    try {
      const result = await this.model.deleteMany({
        lastActivity: { $lt: threshold },
        isActive: false
      });
      return result.deletedCount;
    } catch (error) {
      throw error;
    }
  }
}