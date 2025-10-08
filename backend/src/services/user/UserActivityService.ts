import { IUserActivity } from '../../interfaces/IUser';
import { UserRepository } from '../../repositories/UserRepository';

export class UserActivityService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async updateUserActivity(activity: IUserActivity): Promise<void> {
    await this.userRepository.update(activity.userId, {
      lastSeen: activity.lastSeen,
      isOnline: activity.isOnline,
    });
  }

  async getUserActivity(userId: string): Promise<any> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error(`User not found: ${userId}`);
    }

    return {
      id: user._id,
      email: user.email,
      name: user.name,
      isOnline: user.isOnline,
      lastSeen: user.lastSeen,
      timezone: user.timezone,
      language: user.language,
    };
  }

}
