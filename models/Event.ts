import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IEvent extends Document {
  eventName: string;
  eventDate: string;
  eventRegistrations: Types.ObjectId[]; // Array of Student ObjectIds
  attendance: {
    name: string;
    email: string;
    rollNo: string;
    present: boolean;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    eventName: {
      type: String,
      required: [true, 'Please provide an event name'],
      trim: true,
    },
    eventDate: {
      type: String,
      required: [true, 'Please provide an event date'],
    },
    eventRegistrations: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Student'
      },
    ],
    attendance: [
      {
        name: { type: String, required: true },
        email: { type: String, required: true, lowercase: true, trim: true },
        rollNo: { type: String, required: true },
        present: { type: Boolean, default: false },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);
