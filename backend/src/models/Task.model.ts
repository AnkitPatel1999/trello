import mongoose, { Schema, Document } from 'mongoose';

export interface ITaskDocument extends Document {
  title: string;
  description?: string;
  subtitles?: string[];
  status: string;
  projectId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000,
  },
  subtitles: [{
    type: String,
    trim: true,
    maxlength: 100,
  }],
  status: {
    type: String,
    required: true,
    enum: ['proposed', 'todo', 'inprogress', 'done', 'deployed'],
    default: 'proposed',
    index: true,
  },
  projectId: {
    type: String,
    required: true,
    index: true,
  },
  userId: {
    type: String,
    required: true,
    index: true,
  },
}, {
  timestamps: true,
  collection: 'tasks',
});

// Indexes
TaskSchema.index({ userId: 1, projectId: 1 });
TaskSchema.index({ projectId: 1, status: 1 });
TaskSchema.index({ userId: 1, createdAt: -1 });

export const Task = mongoose.model<ITaskDocument>('Task', TaskSchema);
