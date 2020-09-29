const mongoose = require("mongoose");
const userData = require("./userSchema");
const subSchedule = require("./SubScheduleSchema");
const appointmentSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.ObjectId,
    ref: userData
  },
  slot: {
    type: mongoose.ObjectId,
    ref: subSchedule.subSchedule
  },
  userId: {
    type: mongoose.ObjectId,
    ref: userData
  },
  patientName: {
    type: String,
    required: true
  },
  pMobileNumber: {
    type: Number,
    required: true
  },
  pEmail: {
    type: String,
    required: true
  },
  hospital: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ["Canceled", "Approved", "Completed"],
    default: "Approved"
  }
},
{timestamps: true},
{
  toJSON: {virtuals: true},
  toObject: {virtuals: true}
});
const appointment = mongoose.model("appointment", appointmentSchema);
module.exports = appointment;