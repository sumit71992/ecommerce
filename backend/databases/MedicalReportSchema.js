const mongoose = require("mongoose");
const medicalReportSchema = new mongoose.Schema({
  reports: [String],
  title: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  dateOfReport: {
    type: Date,
    required: true,
  },
  typeOfReport: {
    type: String,
    trim: true,
    lowercase: true,
    default: "report",
    enum: ["report", "prescription", "invoice"]
  },
  isDisabled: {
    type: Boolean,
    default: false
  }
},
  { timestamps: true });
const medicalReport = mongoose.model("medicalReport", medicalReportSchema);
module.exports = {
  reportData: medicalReport,
  medicalReportSchema: medicalReportSchema
}