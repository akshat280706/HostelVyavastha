const mongoose = require('mongoose');

const leaveRequestSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  roomNumber: {
    type: String,
    required: true
  },
  fromDate: {
    type: Date,
    required: true
  },
  toDate: {
    type: Date,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  leaveType: {
    type: String,
    enum: ['casual', 'medical', 'emergency', 'vacation'],
    default: 'casual'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled'],
    default: 'pending'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date,
  rejectionReason: String,
  parentContact: String,
  emergencyContact: String,
  documents: [String], // For medical certificates etc.
  remarks: String
}, {
  timestamps: true
});

// Calculate number of days
leaveRequestSchema.virtual('numberOfDays').get(function() {
  const diffTime = Math.abs(this.toDate - this.fromDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1;
});

module.exports = mongoose.model('LeaveRequest', leaveRequestSchema);