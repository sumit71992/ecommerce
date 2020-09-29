const user = require("../databases/userSchema");

const notloggedin = (req, res, next) => {
  if (!req.session.loggedUser) {
    req.session.message = "Please Login First";
    req.session.messageType = "Failure";
    res.redirect("/emaillogin");
  } else {
    next();
  }
};
const loggedin = (req, res, next) => {
  if (req.session.loggedUser) {
    res.redirect("/profile");
  } else {
    next();
  }
};
const login = (req, res, next) => {
  if (!req.session.loggedUser || req.session.loggedUser) {
    next();
  } else {
    res.redirect("/emaillogin");
  }
};
const ifNotDoctor = async (req, res, next) => {
  if (req.session.user.role !== "doctor") {
    req.session.message = "You are Not a Doctor";
    req.session.messageType = "Failure";
    return res.redirect("/profile");
  }
  next();
};
const doctorProfileComplete = async (req, res, next) => {
  if ((req.session.user.role === "doctor") && (req.session.user.doctorData)&&(req.session.user.doctorData.speciality[0]!==null)&&(req.session.user.doctorData.speciality[0]!==undefined)){
      return res.redirect("/profile");
  }else{
  next();
  }
};
const doctorProfileNotComplete = async (req, res, next) => {
  if ((req.session.user.role === "doctor") && (!req.session.user.doctorData || req.session.user.doctorData === undefined || req.session.user.doctorData === null || req.session.user.doctorData.speciality[0]===null || req.session.user.doctorData.speciality[0]===undefined)){
      return res.redirect("/add_doc_details");
  }else{
  next();
  }
};

const appointment = async (req, res, next) => {
  if(!req.session.user.appointmentDetails){
    req.session.message = "No Appointment Available";
    req.session.messageType = "Failure";
    res.redirect("/profile");
  }else{
    next();
  }
};
const notAdmin = async (req, res, next) => {
  if (req.session.user.role !== "admin") {
    req.session.message = "You are Not a Admin";
    req.session.messageType = "Failure";
    return res.redirect("/home");
  }
  next();
}


const clearToaster = async (req, res) => {
  req.session.messageType = null;
  req.session.message = null;
  res.status(200).send("Successfully changed");
}
module.exports = {
  notloggedin: notloggedin,
  loggedin: loggedin,
  login: login,
  ifNotDoctor: ifNotDoctor,
  appointment:appointment,
  doctorProfileComplete: doctorProfileComplete,
  doctorProfileNotComplete: doctorProfileNotComplete,
  notAdmin: notAdmin,
  clearToaster: clearToaster
};
