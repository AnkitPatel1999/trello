import mongoose, { Schema, Document } from 'mongoose';

export interface IProjectDocument extends Document {
  name: string;
  description?: string;
  userId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500,
  },
  userId: {
    type: String,
    required: true,
    index: true,
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true,
  },
}, {
  timestamps: true,
  collection: 'projects',
});

// Indexes
ProjectSchema.index({ userId: 1, isActive: 1 });
ProjectSchema.index({ userId: 1, createdAt: -1 });

export const Project = mongoose.model<IProjectDocument>('Project', ProjectSchema);
