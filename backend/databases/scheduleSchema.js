const mongoose = require("mongoose");
const userData = require("./userSchema");
const subSchedule = require("../databases/SubScheduleSchema")
const scheduleSchema = new mongoose.Schema(
    {
        days: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
        },
        hospital: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },
        startTime: {
            type: String,
            required: true,
            uppercase: true,
            trim: true
        },
        endTime: {
            type: String,
            required: true,
            uppercase: true,
            trim: true
        },
        interval: {
            type: Number,
            required: true,
            enum: [15, 30, 45, 60]
        },
        doctor: {
            type: mongoose.ObjectId,
            ref: userData,
            required: true
        },
        subSchedule: [subSchedule.subScheduleSchema],
        isDisabled: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    });

    const strToMin = (str) => {
      return 60 * parseInt(str.split(":")[0]) + parseInt(str.split(":")[1]);
  }
  
  const minToStr = (num) => {
      var hr = parseInt(num / 60);
      var min = parseInt(num % 60);
      if (min < 10)
          min = "0" + min;
      if (hr === 0)
          return "12" + ":" + min + " AM";
      else if (hr < 10)
          return "0" + hr + ":" + min + " AM";
      else if (hr < 12)
          return hr + ":" + min + " AM";
      else if (hr === 12)
          return "12" + ":" + min + " PM";
      else if ((hr > 12) && (hr - 12 <10))
          return "0" + (hr - 12) + ":" + min + " PM";
      else return (hr - 12) + ":" + min + " PM";
  }

scheduleSchema.pre("save", function (next) {
    var start = this.startTime;
    var end = this.endTime;
    const schedulePart = [];
    var interval = this.interval;
    var minStart = strToMin(start);
    var minEnd = strToMin(end);
    while (minStart + interval <= minEnd) {
        var result = {};
        result.startTime = minToStr(minStart);
        result.endTime = minToStr(minStart + interval);
        minStart += interval;
        schedulePart.push(result);
    }
    if (parseInt(minEnd % interval) !== 0) {
        var result = {};
        result.startTime = minToStr(minEnd - minEnd % interval);
        result.endTime = minToStr(minEnd);
        schedulePart.push(result);
    }
    this.subSchedule = schedulePart;
    this.startTime = minToStr(strToMin((this.startTime)));
    this.endTime = minToStr(strToMin((this.endTime)));
    next();
})
const schedule = mongoose.model("schedule", scheduleSchema);
module.exports = schedule;