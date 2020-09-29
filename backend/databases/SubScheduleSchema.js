const mongoose = require("mongoose");
const subScheduleSchema = new mongoose.Schema({
    startTime: {
        type: String,
        uppercase: true,
        trim: true
    },
    endTime: {
        type: String,
        uppercase: true,
        trim: true
    },
    isBooked: {
        type: Boolean,
        default: false
    },
    isDisabled: {
        type: Boolean,
        default: false
    },
    bookedDate: {
        type: Date,
        default: null
    }
})
const subSchedule = mongoose.model("subSchedule", subScheduleSchema);
module.exports = {
    subSchedule: subSchedule,
    subScheduleSchema: subScheduleSchema
};