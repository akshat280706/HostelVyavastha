const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: true,
    unique: true
  },
  floor: {
    type: Number,
    required: true
  },
  wing: {
    type: String,
    enum: ['A', 'B', 'C', 'D'],
    default: 'A'
  },
  capacity: {
    type: Number,
    required: true,
    min: 1,
    max: 6
  },
  currentOccupancy: {
    type: Number,
    default: 0
  },
  type: {
    type: String,
    enum: ['AC', 'Non-AC'],
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  amenities: [{
    type: String,
    enum: ['Bed', 'Table', 'Chair', 'Fan', 'AC', 'Attached Bathroom', 'Balcony']
  }],
  currentStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Virtual for available seats
roomSchema.virtual('availableSeats').get(function() {
  return this.capacity - this.currentOccupancy;
});

module.exports = mongoose.model('Room', roomSchema);