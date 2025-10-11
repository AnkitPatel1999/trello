import { Document, Model, FilterQuery, UpdateQuery } from 'mongoose';
import { logger } from '../utils/logger';

export abstract class BaseRepository<T extends Document> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(data: Partial<T>): Promise<T> {
    try {
      const document = new this.model(data);
      return await document.save();
    } catch (error) {
      logger.error('Failed to create document', {
        error: error instanceof Error ? error.message : 'Unknown error',
        model: this.model.modelName,
        data,
      });
      throw error;
    }
  }

  async findById(id: string): Promise<T | null> {
    try {
      return await this.model.findById(id);
    } catch (error) {
      logger.error('Failed to find document by ID', {
        error: error instanceof Error ? error.message : 'Unknown error',
        model: this.model.modelName,
        id,
      });
      throw error;
    }
  }

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    try {
      return await this.model.findOne(filter);
    } catch (error) {
      logger.error('Failed to find document', {
        error: error instanceof Error ? error.message : 'Unknown error',
        model: this.model.modelName,
        filter,
      });
      throw error;
    }
  }

  async find(filter: FilterQuery<T> = {}, options: any = {}): Promise<T[]> {
    try {
      let query = this.model.find(filter);

      if (options.sort) {
        query = query.sort(options.sort);
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      if (options.skip) {
        query = query.skip(options.skip);
      }

      if (options.populate) {
        query = query.populate(options.populate) as any;
      }

      return await query.exec();
    } catch (error) {
      logger.error('Failed to find documents', {
        error: error instanceof Error ? error.message : 'Unknown error',
        model: this.model.modelName,
        filter,
      });
      throw error;
    }
  }

  async update(id: string, data: UpdateQuery<T>): Promise<T | null> {
    try {
      return await this.model.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
      logger.error('Failed to update document', {
        error: error instanceof Error ? error.message : 'Unknown error',
        model: this.model.modelName,
        id,
        data,
      });
      throw error;
    }
  }

  async updateOne(filter: FilterQuery<T>, data: UpdateQuery<T>): Promise<T | null> {
    try {
      return await this.model.findOneAndUpdate(filter, data, { new: true });
    } catch (error) {
      logger.error('Failed to update document', {
        error: error instanceof Error ? error.message : 'Unknown error',
        model: this.model.modelName,
        filter,
        data,
      });
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.model.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      logger.error('Failed to delete document', {
        error: error instanceof Error ? error.message : 'Unknown error',
        model: this.model.modelName,
        id,
      });
      throw error;
    }
  }

  async deleteOne(filter: FilterQuery<T>): Promise<boolean> {
    try {
      const result = await this.model.findOneAndDelete(filter);
      return !!result;
    } catch (error) {
      logger.error('Failed to delete document', {
        error: error instanceof Error ? error.message : 'Unknown error',
        model: this.model.modelName,
        filter,
      });
      throw error;
    }
  }

  async count(filter: FilterQuery<T> = {}): Promise<number> {
    try {
      return await this.model.countDocuments(filter);
    } catch (error) {
      logger.error('Failed to count documents', {
        error: error instanceof Error ? error.message : 'Unknown error',
        model: this.model.modelName,
        filter,
      });
      throw error;
    }
  }

  async exists(filter: FilterQuery<T>): Promise<boolean> {
    try {
      const result = await this.model.exists(filter);
      return !!result;
    } catch (error) {
      logger.error('Failed to check document existence', {
        error: error instanceof Error ? error.message : 'Unknown error',
        model: this.model.modelName,
        filter,
      });
      throw error;
    }
  }
}
