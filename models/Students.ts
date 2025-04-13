import mongoose, { Schema, Document } from 'mongoose';

export interface IStudent extends Document {
  name: string;
  email: string;
  rollNumber: string;
  universityRollNo: string;
  eventName: string;
  branch: string;
  year: string;
  phoneNumber: string;
  qrCode: string;
  attendance: { 
    date: Date;
    present: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema = new Schema<IStudent>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    rollNumber: { 
      type: String,
      required: [true, 'Please provide a roll number'],
      unique: true,
      trim: true,
    },
    universityRollNo: {  // New field
      type: String,
      required: [true, 'Please provide university roll number'],
      trim: true,
    },
    eventName: {  // New field
      type: String,
      required: [true, 'Please provide event name'],
      trim: true,
    },
    branch: {  // New field
      type: String,
      required: [true, 'Please provide branch'],
      trim: true,
    },
    year: {  // New field
      type: String,
      required: [true, 'Please provide year'],
      trim: true,
    },
    phoneNumber: {  // New field
      type: String,
      required: [true, 'Please provide phone number'],
      trim: true,
    },
    qrCode: {
      type: String,
      unique: true,
      required: [true, 'QR Code is required'],  // Made required
    },
    attendance: [
      {
        date: {
          type: Date,
          required: true,
        },
        present: {
          type: Boolean,
          default: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Students || mongoose.model<IStudent>('Students', StudentSchema);