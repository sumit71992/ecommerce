const userData = require("../databases/usersSchema");
const schedule = require("../databases/scheduleSchema");
const mongoose = require("mongoose");
const appointment = require("../databases/AppointmentSchema");



module.exports = {
    createSchedule: createSchedule,
    all: allScheduleOfDoctor,
    alls: allSchedulesOfDoctor,
    subSchedule: subSchedule,
    removeSchedule: removeSchedule,
    disableSchedule: disableSchedule,
    disableSubSchedule: disableSubSchedule,
    appoint: appoint,
    book: bookappointment,
    editslot: editslot,
    cancel: cancelAppointment,
    reSchedule: reschedule,
    allappointments: allappointments,
    update: updateAppointment,
    reschedule: rescheduleAppointment,
    getreschedule: getRescheduleAppointment
}

async function createSchedule(req, res) {
    try {
        var validityStatus = true;
        validityStatus = await validateSlot(req);
        if (validityStatus === false) {
            req.session.message = "Time already scheduled";
            req.session.messageType = "Failure";
        }
        else {
            for (var i = 0; i < req.body.days.length; i++) {
                var newSchedule = new schedule({
                    days: req.body.days[i],
                    hospital: req.body.hospital,
                    startTime: req.body.start_time,
                    endTime: req.body.end_time,
                    interval: req.body.duration,
                    doctor: mongoose.Types.ObjectId(req.session.user._id)
                });
                await newSchedule.save();
            }
            console.log("New Schedule created successfully");
            req.session.message = "Schedule Successfully Created";
            req.session.messageType = "Success";
        }
    }
    catch (err) {
        console.log("Error Creating Schedule", err);
        req.session.message = "Error Creating Schedule";
        req.session.messageType = "Failure";
    }
    finally {
        return res.redirect("/createSchedule");
    }
}

const validateSlot = async (req) => {
    const allSchedules = await schedule.find({
        doctor: mongoose.Types.ObjectId(req.session.user._id),
        days: { $in: req.body.days },
        isDisabled: false
    });
    var start = await valueInMin(minToStr(strToMin(req.body.start_time)));
    var end = await valueInMin(minToStr(strToMin(req.body.end_time)));
    for (var i = 0; i < allSchedules.length; i++) {
        var slotStart = await valueInMin(allSchedules[i].startTime);
        var slotEnd = await valueInMin(allSchedules[i].endTime);
        if (start >= slotStart && end <= slotEnd)
            return false;
        if (start < slotStart && end > slotStart)
            return false;
        if (start < slotEnd && end > slotEnd)
            return false;
        if (start >= slotStart && end <= slotEnd)
            return false;
        if (start < slotStart && end > slotEnd)
            return false;
    }
    return true;
}

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
    else if ((hr > 12) && (hr - 12 < 10))
        return "0" + (hr - 12) + ":" + min + " PM";
    else return (hr - 12) + ":" + min + " PM";
}
const valueInMin = async (date) => {
    if (date.split(" ")[1] === "AM") {
        if (date.split(":")[0] == 12)
            return parseInt(date.split(":")[1]);
        else
            return parseInt(date.split(":")[0]) * 60 + parseInt(date.split(":")[1]);
    }
    else
        if (date.split(" ")[1] === "PM") {
            if (date.split(":")[0] == 12)
                return 12 * 60 + parseInt(date.split(":")[1]);
            else
                return (12 + parseInt(date.split(":")[0])) * 60 + parseInt(date.split(":")[1]);
        }
}


async function allScheduleOfDoctor(req, res, next) {
    const docId = req.session.user._id;
    await schedule.find({ doctor: docId })
        .then(allSchedule => {
            if (allSchedule) {
                console.log("All schedules fetched Successfully");
                req.session.user.allSchedule = allSchedule;
                next();
            }
            else {
                console.log(`The doctor ${req.session.user.name} have no schedule yet`);
                req.session.user.allSchedule = allSchedule;
                next();
            }
        })
        .catch(err => {
            console.log("Error occured finding schedules", err)
            next();
        });
}


function removeSchedule(req, res) {
    var index = req.body.index;
    console.log("index received:", index);
    mongoose.set('useFindAndModify', false);
    schedule.findOneAndRemove({ doctor: mongoose.Types.ObjectId(req.session.user._id) }, function (err, result) {
        if (err) {
            console.log("err", err);
        } else {
            console.warn("success");
            req.session.message = "Slot Removed";
            req.session.messageType = "Success";
            res.redirect("/createSchedule");
        }
    })
}
function editslot(req, res) {
    var id = req.params.id;
    console.warn(id);
    mongoose.set('useFindAndModify', false);
    schedule.findByIdAndUpdate(mongoose.Types.ObjectId(id), {
        startTime: minToStr(strToMin(req.body.start_time)),
        endTime: minToStr(strToMin(req.body.end_time)),
        interval: req.body.duration,
        hospital: req.body.hospital
    }, function (err, result) {
        if (err) {
            console.log("Error Updating Schedule", err);
            req.session.message = "Error Updating Schedule";
            req.session.messageType = "Failure";
            res.redirect("/createSchedule");
        } else {
            console.log("Schedule Successfully Updated");
            req.session.message = "Schedule Updated successfully";
            req.session.messageType = "Success";
            res.redirect("/createSchedule");
        }
    })


}
function disableSchedule(req, res) {
    const changeStatus = req.params.status == "true" ? false : true;
    console.warn(changeStatus);
    mongoose.set('useFindAndModify', false);
    schedule.findByIdAndUpdate(mongoose.Types.ObjectId(req.params.scheduleId), {
        isDisabled: changeStatus
    }, function (err, result) {
        if (err) {
            console.log("Error Updating Schedule", err);
            req.session.message = "Error Updating Schedule";
            req.session.messageType = "Failure";
            res.redirect("/createSchedule");
        } else {
            console.log("Schedule Successfully Updated");
            req.session.message = "Schedule Updated successfully";
            req.session.messageType = "Success";
            res.redirect("/createSchedule");
        }
    })
}
async function disableSubSchedule(req, res) {
    try {
        const changeStatus = req.params.status == "true" ? false : true;
        console.warn(changeStatus);
        mongoose.set('useFindAndModify', false);
        await schedule.findOneAndUpdate({
            subSchedule: {
                $elemMatch: { _id: mongoose.Types.ObjectId(req.params.subScheduleId) }
            }
        }, {
            $set: {
                "subSchedule.$.isDisabled": changeStatus
            }
        });
    }
    catch (err) {
        console.log("Error Updating Schedule", err);
        req.session.message = "Error Updating Schedule";
        req.session.messageType = "Failure";
        res.redirect("/createSchedule");

    }
    finally {
        console.warn("success");
        res.redirect("/createSchedule");
    }
}

async function allSchedulesOfDoctor(req, res, next) {
    const docId = req.params.docId;
    const allSchedule = await schedule.find({
        doctor: docId, isDisabled: false
    });
    req.session.user.availableSchedule = allSchedule;
    var date = new Date().toUTCString();
    date = new Date(date);
    var today = new Date();
    var dayName = today.toDateString().split(" ")[0].toLowerCase();
    var nowTimeInMin = parseInt(today.toTimeString().split(":")[0]) * 60 + parseInt(today.toTimeString().split(":")[1]);
    req.session.user.appointmentDetails = {};
    req.session.user.appointmentDetails.dateOfToday = date;
    var temp = [], temp2 = [];
    for (var i = 0; i < allSchedule.length; i++) {
        for (var j = 0, c = 0; j < allSchedule[i].subSchedule.length; j++) {
            var apntDayName = allSchedule[i].days.substring(0, 3);
            if (allSchedule[i].subSchedule[j].isBooked === false && allSchedule[i].subSchedule[j].isDisabled === false) {       // && (await valueInMin(allSchedule[i].subSchedule[j].startTime)) > nowTimeInMin) {
                if (dayName === apntDayName) {
                    if ((await valueInMin(allSchedule[i].subSchedule[j].startTime)) > nowTimeInMin)
                        c++;
                }
                else c++;
            }
        }
        temp.push(allSchedule[i].days, allSchedule[i].hospital, c);
    }
    for (i = 0; i < temp.length; i += 3) {
        if (temp.indexOf(temp[i]) !== i) {
            if (temp[i + 1] === temp[temp.indexOf(temp[i]) + 1]) {
                temp2[temp2.indexOf(temp[i]) + 2] += temp[i + 2];
            }
            else {
                temp2.push(temp[i], temp[i + 1], temp[i + 2])
            }
        }
        else {
            temp2.push(temp[i], temp[i + 1], temp[i + 2])
        }
    }
    temp2.push("sunday", "none", 0);
    req.session.user.schedulWithDay = temp2;
    console.log("All schedules of doctor fetched Successfully");
    res.status(200).send(`${date} ===${req.session.user.schedulWithDay}`);
}

async function subSchedule(req, res) {
    try {
        const hosplitalList = req.params.hospitalName.split(" , ");
        const allSchedule = [];
        for (var i = 0; i < hosplitalList.length; i++) {
            var result = await schedule.find({
                doctor: req.params.docId, isDisabled: false, hospital: hosplitalList[i], days: req.params.dayName
            });
            allSchedule.push(result)
        }
        const temp = [];
        for (var i = 0, m = 0; i < allSchedule.length; i++, m++) {
            temp[m] = [];
            for (var j = 0; j < allSchedule[i].length; j++) {
                for (var k = 0; k < allSchedule[i][j].subSchedule.length; k++) {
                    if (allSchedule[i][j].subSchedule[k].isBooked === false && allSchedule[i][j].subSchedule[k].isDisabled === false) {
                        temp[m].push(allSchedule[i][j].subSchedule[k]);
                    }
                }
            }
        }
        const temp2 = [];
        for (var i = 0; i < hosplitalList.length; i++) {
            temp2.push(hosplitalList[i], temp[i])
        }
        req.session.user.subSchedule = temp2;
    }
    catch (err) {
        req.session.user.subSchedule = [];
    }
    finally {
        res.status(200).send(`${JSON.stringify(req.session.user.subSchedule)}`);
    }
}

async function appoint(req, res) {
    let subScheduleId = req.params.subScheduleId;
    let data = await schedule.findOne({ "subSchedule._id": subScheduleId });
    if (data.doctor == req.session.user._id) {
        req.session.message = "You can not Appoint yourself";
        req.session.messageType = "Failure";
        res.redirect("/doctors");
    } else {
        let days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
        let dayOfAppointment = req.params.dayName.substring(0, 3);
        let dayOfToday = new Date(req.session.user.appointmentDetails.dateOfToday).toUTCString().split(",")[0].toLowerCase();
        let appointmentDate = new Date(req.session.user.appointmentDetails.dateOfToday);
        if (days.indexOf(dayOfToday) < days.indexOf(dayOfAppointment)) {
            var diff = days.indexOf(dayOfAppointment) - days.indexOf(dayOfToday);
            var aDate = appointmentDate.getDate() + diff;
            appointmentDate.setDate(aDate);
            console.warn("appointmentDatebig", appointmentDate);
        }
        if (days.indexOf(dayOfToday) > days.indexOf(dayOfAppointment)) {
            var diff = days.indexOf(dayOfToday) - days.indexOf(dayOfAppointment);
            var aDate = appointmentDate.getDate() + 7 - diff;
            appointmentDate.setDate(aDate);
            console.warn("appointmentDatesmall", appointmentDate);
        }
        appointmentDate = new Date(appointmentDate).toUTCString();
        console.warn("appointmentDateFinal Sat, 29 Aug 2020 12:11:33 GMT", appointmentDate);
        schedule.find({ "subSchedule._id": subScheduleId })
            .then(result => {
                console.warn("result", result[0]);
                req.session.user.appointmentDetails.appointmentSchedule = result[0];
                for (var i = 0; i < result[0].subSchedule.length; i++)
                    if (result[0].subSchedule[i]._id == subScheduleId)
                        req.session.user.appointmentDetails.bookingSubSchedule = result[0].subSchedule[i];
                req.session.user.appointmentDetails.dateOfAppointment = appointmentDate;
                userData.findById(result[0].doctor)
                    .then(docInfo => {
                        req.session.user.appointmentDetails.dInfo = docInfo;
                        console.warn("Appointment Details Successfully Fethed");
                        return res.redirect("/bookappointment");
                    })
                    .catch(err => {
                        console.warn("err", err);
                        res.redirect("/doctors");
                    });
            })
            .catch(err => {
                console.warn("err", err);
                res.redirect("/doctors");
            });
    }
}

async function bookappointment(req, res) {
    const { name,
        pNumber,
        email } = req.body;
    var newAppointment = new appointment({
        doctor: mongoose.Types.ObjectId(req.session.user.appointmentDetails.dInfo._id),
        slot: mongoose.Types.ObjectId(req.session.user.appointmentDetails.bookingSubSchedule._id),
        userId: mongoose.Types.ObjectId(req.session.user._id),
        patientName: name,
        pMobileNumber: pNumber,
        pEmail: email,
        hospital: req.session.user.appointmentDetails.appointmentSchedule.hospital,
        date: req.session.user.appointmentDetails.dateOfAppointment
    });
    newAppointment.save()
        .then(async newAppointmentResult => {
            console.log("New Appointment Saved Successfully");
            var scheduleFindResult = await schedule.findOneAndUpdate({
                subSchedule: {
                    $elemMatch: { _id: mongoose.Types.ObjectId(req.session.user.appointmentDetails.bookingSubSchedule._id) }
                }
            }, {
                $set: {
                    "subSchedule.$.isBooked": true,
                    "subSchedule.$.bookedDate": req.session.user.appointmentDetails.dateOfToday
                }
            });
            req.session.user.currentAppDetails = newAppointmentResult;
            req.session.message = "New Appointment Saved Successfully";
            req.session.messageType = "Success";
            return res.redirect("/bookingstatus");
        })
        .catch(err => {
            console.log("Error Booking Appointment", err);
            req.session.message = "Error Booking Appointment";
            req.session.messageType = "Failure";
            return res.redirect("/bookappointment");
        });
}
async function cancelAppointment(req, res) {
    try {
        const appointmentId = mongoose.Types.ObjectId(req.params.appId);
        mongoose.set('useFindAndModify',false);
        await appointment.findOneAndUpdate({
            _id: appointmentId
        }, {
            $set: { status: "Canceled" }
        });
        const appointmentFind = await appointment.findOne({ _id: appointmentId });
        const enableSubSchedule = await schedule.findOneAndUpdate({
            subSchedule: {
                $elemMatch: { _id: mongoose.Types.ObjectId(appointmentFind.slot) }
            }
        }, {
            $set: {
                "subSchedule.$.isBooked": false,
                "subSchedule.$.bookedDate": null
            }
        });
        req.session.message = "Appointment Canceled Successfully";
        req.session.messageType = "Success";
    }
    catch (err) {
        console.log("Error Canceling  Appointment", err);
        req.session.message = "Appointment Not Canceled";
        req.session.messageType = "Failure";
        return req.params.appId ? res.redirect("/allappointments") : res.redirect("/bookingstatus");
    }
    finally {
        return req.session.user.role === "admin" ? res.redirect(`/adminUserAllAppointments/${req.params.userId}`) : res.redirect("/allappointments");
    }
}

async function reschedule(req, res) {

}

async function allappointments(req, res, next) {
    try {
        var allApp = await appointment.find({ userId: mongoose.Types.ObjectId(req.session.user._id) });
        var docDataArr = [], subSchArr = [];
        for (var i = 0; i < allApp.length; i++) {
            var docData = await userData.findOne({
                _id: mongoose.Types.ObjectId(allApp[i].doctor)
            });
            docDataArr.push(docData);
            var subSchData = await schedule.findOne({
                "subSchedule._id": allApp[i].slot
            });
            for (var j = 0; j < subSchData.subSchedule.length; j++) {
                if (subSchData.subSchedule[j]._id.toString().trim() == allApp[i].slot.toString().trim())
                    subSchArr.push(subSchData.subSchedule[j]);
            }
        }
        req.session.user.allAppData = {};
        req.session.user.allAppData.allApp = allApp;
        req.session.user.allAppData.subSchData = subSchArr;
        req.session.user.allAppData.docData = docDataArr;
    }
    catch (err) {
        console.log("Error Fetching user  Appointment", err);
        req.session.message = "Error Fetching user  Appointment";
        req.session.messageType = "Failure";
    }
    finally {
        next();
    }
}
async function completeAppointment(appointmentId) {
    const cancelAppointmentResult = await appointment.findOneAndUpdate({
        _id: appointmentId
    }, {
        $set: { status: "Completed" }
    });
    const appointmentFindResult = await appointment.findOne({ _id: appointmentId });
    const enableSubSchedule = await schedule.findOneAndUpdate({
        subSchedule: {
            $elemMatch: { _id: mongoose.Types.ObjectId(appointmentFindResult.slot) }
        }
    }, {
        $set: {
            "subSchedule.$.isBooked": false,
            "subSchedule.$.bookedDate": null
        }
    });
}

async function updateAppointment(req, res, next) {
    try {
        const allApps = await appointment.find({ status: "Approved" });
        var today = new Date();
        var ny = today.getFullYear();
        var nm = today.getMonth();
        var nd = today.getDate();
        var nowTimeInMin = parseInt(today.toTimeString().split(":")[0]) * 60 + parseInt(today.toTimeString().split(":")[1]);
        for (var i = 0; i < allApps.length; i++) {
            var y = allApps[i].date.getFullYear();
            var m = allApps[i].date.getMonth();
            var d = allApps[i].date.getDate();
            if (y < ny) {
                completeAppointment(allApps[i]._id);
            }
            else if (y === ny) {
                if (m < nm) {
                    completeAppointment(allApps[i]._id);
                }
                else if (m === nm) {
                    if (d < nd) {
                        completeAppointment(allApps[i]._id);
                    }
                    else if (d === nd) {
                        var schData = await schedule.findOne({
                            subSchedule: {
                                $elemMatch: { _id: mongoose.Types.ObjectId(allApps[i].slot) }
                            }
                        });
                        var slot = {};
                        for (var j = 0; j < schData.subSchedule.length; j++) {
                            if (schData.subSchedule[j]._id.toString().trim() === allApps[i].slot.toString().trim())
                                slot = schData.subSchedule[j];
                        }
                        var slotEndTimeInMin = valueInMin(slot.endTime);
                        if (slotEndTimeInMin < nowTimeInMin) {
                            completeAppointment(allApps[i]._id);
                        }
                    }
                }
            }
        }
    }
    catch (err) {
        console.log("Some error occured", err);
    }
    finally {
        console.log("next update");
        next()
    }
}

async function getRescheduleAppointment(req, res, next) {
    try {
        let userid = req.params.userId;
        console.log("userid",userid);
        let subSchArr = [];
        let rescheduleAppData = await appointment.findOne({ _id: req.params.appId });
        let rescheduleDocData = await userData.findOne({ _id: mongoose.Types.ObjectId(rescheduleAppData.doctor) });
        let rescheduleSubSchData = await schedule.findOne({ "subSchedule._id": mongoose.Types.ObjectId(rescheduleAppData.slot) });
        for (var i = 0; i < rescheduleSubSchData.subSchedule.length; i++) {
            if (rescheduleSubSchData.subSchedule[i]._id.toString().trim() == rescheduleAppData.slot.toString().trim()) {
                subSchArr.push(rescheduleSubSchData.subSchedule[i]);
            }
        }

        req.session.user.rescheduleData = {};
        req.session.user.rescheduleData.rescheduleAppData = rescheduleAppData;
        req.session.user.rescheduleData.rescheduleDocData = rescheduleDocData;
        req.session.user.rescheduleData.subScheduleData = subSchArr;
        if (req.session.user.role === "admin") {
            req.session.user.rescheduleData.userId = req.params.userId;
            console.log("userId Admin",req.session.user.rescheduleData.userId);
        }
    }
    catch (err) {
        req.session.user.rescheduleData = {};
        console.log("error fetching rescheduleData", err);
    }
    finally {
        console.log("Success");
       return next();
    }
}


async function rescheduleAppointment(req, res,) {
    try {
        const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
        const dayOfAppointment = req.params.dayName.substring(0, 3);
        var dayOfToday = new Date().toUTCString().split(",")[0].toLowerCase();
        var appointmentDate = new Date(req.session.user.appointmentDetails.dateOfToday);
        if (days.indexOf(dayOfToday) < days.indexOf(dayOfAppointment)) {
            var diff = days.indexOf(dayOfAppointment) - days.indexOf(dayOfToday);
            var aDate = appointmentDate.getDate() + diff;
            appointmentDate.setDate(aDate);
        }
        if (days.indexOf(dayOfToday) > days.indexOf(dayOfAppointment)) {
            var diff = days.indexOf(dayOfToday) - days.indexOf(dayOfAppointment);
            var aDate = appointmentDate.getDate() + 7 - diff;
            appointmentDate.setDate(aDate);
        }
        appointmentDate = new Date(appointmentDate).toUTCString();
        console.log(req.session.user.rescheduleData.rescheduleAppData);
        req.session.message = "Error Fetching user Appointment";
        mongoose.set('useFindAndModify', false);
        await schedule.findOneAndUpdate({
            subSchedule: {
                $elemMatch: { _id: mongoose.Types.ObjectId(req.session.user.rescheduleData.rescheduleAppData.slot) }
            }
        }, {
            $set: {
                "subSchedule.$.isBooked": false,
                "subSchedule.$.bookedDate": null
            }
        }, async function (err, result) {
            if (err) {
                console.log("err1", err);
            } else {
                await schedule.findOneAndUpdate({
                    subSchedule: {
                        $elemMatch: { _id: mongoose.Types.ObjectId(req.params.subSchId) }
                    }
                }, {
                    $set: {
                        "subSchedule.$.isBooked": true,
                        "subSchedule.$.bookedDate": appointmentDate
                    }
                }, async function (err, result2) {
                    if (err) {
                        console.log("err2", err);
                    } else {
                        await appointment.findOneAndUpdate({
                            slot: mongoose.Types.ObjectId(req.session.user.rescheduleData.rescheduleAppData.slot)
                        }, {
                            $set: {
                                slot: mongoose.Types.ObjectId(req.params.subSchId),
                                date: appointmentDate
                            }
                        }, async function (err, result3) {
                            if (err) {
                                console.log("err3", err);
                            } else {
                                console.log("Appointment Rescheduled Successfully");
                                req.session.message = "Appointment Rescheduled Successfully";
                                req.session.messageType = "Success";
                            }
                        });
                    }
                });
            }
        });
    }
    catch (err) {
        console.log("Error Booking Appointment", err);
        req.session.message = "Error Booking Appointment";
        req.session.messageType = "Failure";
    }
    finally {
        console.log("print", req.session.user.rescheduleData);
        return req.session.user.role === "admin" ? res.redirect(`/adminUserAllAppointments/${req.session.user.rescheduleData.userId}`) : res.redirect("/allappointments");
    }
}






