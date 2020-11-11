const mongoose = require("mongoose");
const userData = require("../databases/usersSchema");
const hospital = require("../databases/HospitalSchema");
const appointment = require("../databases/AppointmentSchema");
const schedule = require("../databases/scheduleSchema");


module.exports = {
    loadAdminData: loadAdminData,
    userAppointment: userAppointment,
    loadUser: loadUser,
    getAllDoctorAppointments: getAllDoctorAppointments,
    cancel: cancelAppointment,
    loadHospitalData: loadHospitalData,
    loadHospital: loadHospital,
    editHospital: editHospital
}

async function loadAdminData(req, res, next) {
    try {

        let allUser = await userData.find({ role: "user" });
        let allDoctors = await userData.find({ role: "doctor" });
        let allAppointments = await appointment.find({
            status: { $ne: 'Canceled' }
        }).sort("-date");
        let recentUser = [], temp = [];
        for (var i = 0; i < allAppointments.length; i++) {
            if (temp.indexOf((allAppointments[i].userId).toString()) === -1) {
                temp.push((allAppointments[i].userId).toString());
                recentUser.push(await userData.findOne(allAppointments[i].userId));
            }
        }
        let allHospitals = [];
        for (var i = 0; i < allDoctors.length; i++) {
            for (var j = 0; j < allDoctors[i].doctorData.hospitals.length; j++) {
                if (allDoctors[i].doctorData.hospitals !== null) {
                    if (allHospitals.indexOf(allDoctors[i].doctorData.hospitals[j]) === -1) {
                        allHospitals.push(allDoctors[i].doctorData.hospitals[j])
                    }
                }
            }
        }
        let pageIndex = req.query.page ? parseInt(req.query.page) : 1;
        let recentUserLength = recentUser.length;
        recentUser = recentUser.splice((pageIndex - 1) * 5, pageIndex * 5);
        req.session.user.adminData = {
            allUser: allUser,
            allDoctors: allDoctors,
            recentUser: recentUser,
            allHospitals: allHospitals,
            allAppointments: allAppointments,
            recentUserLength: recentUserLength
        }
    }
    catch (err) {
        console.log("Some error occured", err);
    }
    finally {
        next();
    }
}

async function userAppointment(req, res, next) {
    try {
        let ObjectId = mongoose.Types.ObjectId;
        console.log("true or false", ObjectId.isValid(req.params.userId));
        var allUserAppointments = await appointment.find({ userId: (ObjectId(req.params.userId)).toString() });
        console.log("hello", req.params.userId, "", req.params.userId.length);
        var docDataArr = [], subSchArr = [];
        for (var i = 0; i < allUserAppointments.length; i++) {
            var docData = await userData.findOne({
                _id: new ObjectId(allUserAppointments[i].doctor)
            });
            docDataArr.push(docData);
            var subSchData = await schedule.findOne({
                "subSchedule._id": allUserAppointments[i].slot
            });
            for (var j = 0; j < subSchData.subSchedule.length; j++) {
                if (subSchData.subSchedule[j]._id.toString().trim() == allUserAppointments[i].slot.toString().trim())
                    subSchArr.push(subSchData.subSchedule[j]);
            }
        }
        req.session.user.allAppointmentsData = {};
        req.session.user.allAppointmentsData.allUserAppointments = allUserAppointments;
        req.session.user.allAppointmentsData.subSchData = subSchArr;
        req.session.user.allAppointmentsData.docData = docDataArr;
    }
    catch (err) {
        console.log("Error Fetching Appointment", err);
        req.session.message = "Error Fetching user Appointment";
        req.session.messageType = "Failure";
    }
    finally {
        console.log("success");
        next();
    }
}

async function loadUser(req, res, next) {
    try {
        const users = await userData.findOne({ _id: mongoose.Types.ObjectId(req.params.userId) });
        req.session.user.adminData.userData = users;
    }
    catch (err) {
        console.log("Error Fetching user  Data", err);

    }
    finally {
        next();
    }
}


async function getAllDoctorAppointments(req, res, next) {
    try {
        const allDoctorAppointments = await appointment.find({ doctor: req.params.docId });
        const doctorName = (await userData.findOne({ _id: req.params.docId })).name;
        const userName = [];
        const slots = [];
        for (var i = 0; i < allDoctorAppointments.length; i++) {
            userName.push((await userData.findOne({ _id: allDoctorAppointments[i].userId })).name);
            var slotData = await schedule.findOne({ "subSchedule._id": allDoctorAppointments[i].slot });
            for (var j = 0; j < slotData.subSchedule.length; j++) {
                if ((slotData.subSchedule[j]._id).toString() == (allDoctorAppointments[i].slot).toString())
                    slots.push(slotData.subSchedule[j]);
            }
        }
        const allAppointments = {
            allAppointments: allDoctorAppointments,
            doctorName: doctorName,
            userName: userName,
            slot: slots,
            _id: req.params.doctorId
        };
        console.log("Doctor Appointment Data is Fetched");
        req.session.user.allDoctorAppointments = allAppointments;
    }
    catch (err) {
        console.log("Some Error Occurred", err);
    }
    finally {
        next();
    }
}

async function cancelAppointment(req, res, next) {
    try {
        const appointmentId = mongoose.Types.ObjectId(req.params.appId);
        mongoose.set('useFindAndModify', false);
        await appointment.findOneAndUpdate({
            _id: appointmentId
        }, {
            $set: { status: "Canceled" }
        });
        const appointmentFindResult = await appointment.findOne({ _id: appointmentId });
        await schedule.findOneAndUpdate({
            subSchedule: {
                $elemMatch: { _id: mongoose.Types.ObjectId(appointmentFindResult.slot) }
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
        console.log("Some error occured", err);
        req.session.message = "Some error occured";
        req.session.messageType = "Failure";
    }
    finally {
        next();
    }
}

async function loadHospitalData(req, res, next) {
    try {
        const allHospitals = [];
        const allHospitalInDb = await hospital.find();
        const allHospitalIndbName = [];
        for (var i = 0; i < allHospitalInDb.length; i++) {
            allHospitalIndbName.push(allHospitalInDb[i].name)
        }
        allHospitals.push(...allHospitalInDb);

        const allDoctors = await userData.find({ role: "doctor" });
        for (var i = 0; i < allDoctors.length; i++) {
            for (var j = 0; j < allDoctors[i].doctorData.hospitals.length; j++) {
                if (allDoctors[i].doctorData.hospitals !== null) {
                    if (allHospitalIndbName.indexOf(allDoctors[i].doctorData.hospitals[j]) === -1) {
                        allHospitals.push({ name: allDoctors[i].doctorData.hospitals[j] });
                        allHospitalIndbName.push(allDoctors[i].doctorData.hospitals[j]);
                    }
                }
            }
        }
        req.session.user.allHospitals = allHospitals;
    }
    catch (err) {
        console.log("Some Error Occurred", err);
    }
    finally {
        next();
    }
}



async function loadHospital(req, res, next) {
    try {
        var hospitalData = await hospital.findOne({ name: req.params.hospitalName });
        if (hospitalData === null) {
            hospitalData = { name: req.params.hospitalName };
        }
        req.session.user.hospitalData = hospitalData;
    }
    catch (err) {
        console.log("Some Error Occurred", err);
    }
    finally {
        next();
    }
}

async function editHospital(req, res) {
    try {
        const hospitalName = req.session.user.hospitalData.name;
        const hospitalData = await hospital.findOne({ name: hospitalName });
        const profilePic = req.file.filename;
        if (hospitalData === null) {
            const newHospital = new hospital({
                name: req.body.name,
                description: req.body.description.trim(),
                address: req.body.address.trim(),
                beds: req.body.bed,
                speciality: req.body.speciality,
                treatments: req.body.treatment,
                hospitalPic: profilePic || null
            });
            const hospitalSaveResult = await newHospital.save();
        }
        else {
            var photo;
            if (hospitalData.hospitalPic !== null)
                photo = hospitalData.profilePic;
            else photo = null;
            mongoose.set('useFindAndModify', false);
            const hospitalSaveResult = await hospital.findOneAndUpdate({
                name: hospitalName
            }, {
                name: req.body.name,
                description: req.body.description.trim(),
                address: req.body.address.trim(),
                beds: req.body.bed,
                speciality: req.body.speciality,
                treatments: req.body.treatment,
                hospitalPic: profilePic ? profilePic : hospitalData.hospitalPic
            });
        }
        if (hospitalName !== req.body.name) {
            const allDoctors = await userData.find({
                role: "doctor",
                "doctorData.hospitals": { $all: [hospitalName] }
            });
            const allSchedules = await schedule.find({ hospital: hospitalName });
            const allAppointments = await appointment.find({ hospital: hospitalName });
            for (var i = 0; i < allDoctors.length; i++) {
                var currrentHospital = allDoctors[i].doctorData.hospitals;
                currrentHospital.splice(currrentHospital.indexOf(hospitalName), 1, req.body.name);
                await userData.findOneAndUpdate({
                    _id: allDoctors[i]._id
                }, {
                    "doctorData.hospitals": currrentHospital
                });
            }
            for (var i = 0; i < allSchedules.length; i++) {
                await schedule.findOneAndUpdate({
                    _id: allSchedules[i]._id
                }, {
                    hospital: req.body.name
                });
            }
            for (var i = 0; i < allAppointments.length; i++) {
                await appointment.findOneAndUpdate({
                    _id: allAppointments[i]._id
                }, {
                    hospitalName: req.body.name
                });
            }
        }
        req.session.message = "Hospital Data Updated Successfully";
        req.session.messageType = "Success";
    }
    catch (err) {
        console.log("Some error occured", err);
        req.session.message = "Error Updating Hospital Data";
        req.session.messageType = "Failure";
    }
    finally {

        return res.redirect("/adminHospitals");
    }
}