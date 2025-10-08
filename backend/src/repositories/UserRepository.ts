import { User } from '../models/User.model';

export class UserRepository {
  constructor() {}

  async create(data: any): Promise<any> {
    return await User.create(data);
  }

  async findById(id: string): Promise<any> {
    return await User.findById(id);
  }

  async findByEmail(email: string): Promise<any> {
    return await User.findOne({ email: email.toLowerCase() });
  }

  async update(id: string, data: any): Promise<any> {
    return await User.findByIdAndUpdate(id, data, { new: true });
  }
}