import mongoose, { Schema } from 'mongoose';

const BaseModelSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now }, // Automatically add createdAt field
  updatedAt: { type: Date, default: Date.now }, // Automatically add updatedAt field
  deletedAt: { type: Date },
  isdeleted: { type: Boolean, default: false },
  deletedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  isActive: { type: Boolean, default: true },
});

export default BaseModelSchema; 
