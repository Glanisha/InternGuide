
import mongoose from 'mongoose';

const viewerMentorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  viewerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Viewer',
    required: true
  },
  name: String,
  email: String,
  interests: [String], 
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('ViewerMentor', viewerMentorSchema);
