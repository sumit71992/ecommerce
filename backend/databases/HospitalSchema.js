const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const hospitalSchema = new Schema({
  name: {
    type: String, required: [true, 'Name field cannot be blank'], unique: [true, 'Name must be unique']
  },
  description: {
    type: String
  },
  address: {
    type: String
  },
  beds: {
    type: String
  },
  speciality: {
    type: String,
    trim: true
  },
  treatments: {
    type: [String]
  },
  hospitalPic: {
    type: String
  }
}, { timestamps: true });
module.exports = mongoose.model("hospitalinfos", hospitalSchema);