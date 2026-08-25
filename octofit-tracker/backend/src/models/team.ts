import mongoose, { Schema } from 'mongoose';

const teamSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true, trim: true },
    color: { type: String, required: true, trim: true },
    captain: { type: Schema.Types.ObjectId, ref: 'User' },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true },
);

export const Team = mongoose.models.Team || mongoose.model('Team', teamSchema);