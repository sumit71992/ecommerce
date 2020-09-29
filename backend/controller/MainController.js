const express = require("express");
const userData = require("../databases/userSchema");
const schedule = require("../databases/scheduleSchema");
const db = require("../databases/Database")
const mongoose = require("mongoose")

module.exports = {
  index: index,
  profile: profile,
  doctors: doctors,
  hospitals: hospitals,
  treatment: treatment,
  contactus: contactus,
  aboutus: aboutus,
  faq: faq,
  login: login,
  emaillogin: emaillogin,
  signup: signup,
  submit_your_query: submit_your_query,
  about_hospital: about_hospital,
  appointment: appointment,
  bookappointment: bookappointment,
  aboutDoc: aboutDoc,
  tvastra_plus: tvastra_plus,
  create_new_password: create_new_password,
  otplogin: otplogin,
  otp_changepass: otp_changepass,
  otp_verification: otp_verification,
  add_doc_details: add_doc_details,
  editprofile: editprofile,
  setting: setting,
  allappointments: allappointments,
  createSchedule: createSchedule,
  status: status,
  reschedule: reschedule,
  report: medicalReport,
  show: showReport,
  adminDashboard: adminDashboard,
  adminUserAppointment: adminUserAppointment,
  adminUser:adminUser,
  adminEditProfile: adminEditProfile,
  adminDoctor: adminDoctor,
  adminHospital: adminHospital,
  adminDoctorAllAppointments: adminDoctorAllAppointments,
  editHospital: editHospital,
  auto: auto,
  logout: logout
};
async function index(req, res) {
  res.render("index", {
    user: req.session.user,
    message: req.session.message,
    messageType: req.session.messageType
  });
}
async function profile(req, res) {
  res.render("profile", {
    user: req.session.user,
    message: req.session.message,
    messageType: req.session.messageType
  });
}
async function doctors(req, res) {
  var pageI = req.params.pageI || 1;
  req.session.user.iPage = [];
  for (var i = (pageI - 1) * 4; i < pageI * 4; i++)
    if (req.session.user.doctorList[i])
      req.session.user.iPage.push(req.session.user.doctorList[i]);
  // req.session.user.indexedPages.push(...req.session.user.allDoctorList);
  return res.render("doctors", {
    user: req.session.user,
    message: req.session.message,
    messageType: req.session.messageType
  });
}
async function hospitals(req, res) {
  res.render("hospitals", {
    user: req.session.user,
    message: req.session.message,
    messageType: req.session.messageType
  });
}
async function treatment(req, res) {
  res.render("treatment", {
    user: req.session.user,
    message: req.session.message,
    messageType: req.session.messageType
  });
}
async function contactus(req, res) {
  res.render("contactus", {
    user: req.session.user,
    message: req.session.message,
    messageType: req.session.messageType
  });
}
async function aboutus(req, res) {
  res.render("aboutus", {
    user: req.session.user,
    message: req.session.message,
    messageType: req.session.messageType
  });
}
async function faq(req, res) {
  res.render("faq", {
    user: req.session.user,
    message: req.session.message,
    messageType: req.session.messageType
  });
}
async function login(req, res) {
  res.render("login", {
    user: req.session.user,
    message: req.session.message,
    messageType: req.session.messageType,
  });
}
async function emaillogin(req, res) {
  res.render("emaillogin", {
    user: req.session.user,
    message: req.session.message,
    messageType: req.session.messageType
  });
}
async function signup(req, res) {
  res.render("signup", {
    user: req.session.user,
    message: req.session.message,
    messageType: req.session.messageType
  });
}
async function submit_your_query(req, res) {
  res.render("submit_your_query", {
    user: req.session.user,
    message: req.session.message,
    messageType: req.session.messageType
  });
}
async function about_hospital(req, res) {
  res.render("about_hospital", {
    user: req.session.user,
    message: req.session.message,
    messageType: req.session.messageType
  });
}
async function appointment(req, res) {
  res.render("appointment", {
    user: req.session.user,
    message: req.session.message,
    messageType: req.session.messageType
  });
}
async function bookappointment(req, res) {
  res.render("bookappointment", {
    user: req.session.user,
    message: req.session.message,
    messageType: req.session.messageType
  });
}
async function aboutDoc(req, res) {
  res.render("doctor_profile", {
    user: req.session.user,
    message: req.session.message,
    messageType: req.session.messageType
  });
}
async function tvastra_plus(req, res) {
  res.render("tvastra_plus", {
    user: req.session.user,
    message: req.session.message,
    messageType: req.session.messageType
  });
}
async function create_new_password(req, res) {
  res.render("create_new_password", {
    user: req.session.user,
    message: req.session.message,
    messageType: req.session.messageType
  });
}
async function otplogin(req, res) {
  res.render("otplogin", {
    user: req.session.user,
    message: req.session.message,
    messageType: req.session.messageType
  });
}
async function otp_changepass(req, res) {
  res.render("otp_changepass", {
    user: req.session.user,
    message: req.session.message,
    messageType: req.session.messageType
  });
}
async function otp_verification(req, res) {
  res.render("otp_verification", {
    user: req.session.user,
    message: req.session.message,
    messageType: req.session.messageType
  });
}
async function add_doc_details(req, res) {
  res.render("add_doc_details", {
    user: req.session.user,
    message: req.session.message,
    messageType: req.session.messageType
  });
}
async function editprofile(req, res) {
  res.render("editprofile", {
    user: req.session.user,
    message: req.session.message,
    messageType: req.session.messageType
  });
}
async function setting(req, res) {
  res.render("setting", {
    user: req.session.user,
    message: req.session.message,
    messageType: req.session.messageType
  });
}
async function allappointments(req, res) {
  res.render("allappointments", {
    user: req.session.user,
    message: req.session.message,
    messageType: req.session.messageType
  });
}
async function createSchedule(req, res) {
  res.render("createSchedule", {
    user: req.session.user,
    message: req.session.message,
    messageType: req.session.messageType
  });
}
async function status(req, res) {
  res.render("bookingstatus", {
    user: req.session.user,
    message: req.session.message,
    messageType: req.session.messageType
  });
}
async function reschedule(req, res) {
  res.render("reschedule", {
    user: req.session.user,
    message: req.session.message,
    messageType: req.session.messageType
  });
}
async function showReport(req, res) {
  res.render("showreport", {
    user: req.session.user,
    message: req.session.message,
    messageType: req.session.messageType
  });
}
async function medicalReport(req, res) {
  res.render("medicalreport", {
    user: req.session.user,
    message: req.session.message,
    messageType: req.session.messageType
  });
}
async function adminDashboard(req, res) {
  res.render("adminDashboard", {
    user: req.session.user,
    message: req.session.message,
    messageType: req.session.messageType
  });
}
async function adminUserAppointment(req, res) {
  res.render("adminUserAppointment", {
    user: req.session.user,
    message: req.session.message,
    messageType: req.session.messageType
  });
}
async function adminUser(req, res) {
  res.render("adminUsers", {
    user: req.session.user,
    message: req.session.message,
    messageType: req.session.messageType
  });
}
async function adminEditProfile(req, res){
  res.render("adminUsers", {
    user: req.session.user,
    message: req.session.message,
    messageType: req.session.messageType
  });
}
async function adminDoctor(req, res){
  res.render("adminDoctors", {
    user: req.session.user,
    message: req.session.message,
    messageType: req.session.messageType
  });
}
async function adminHospital(req, res){
  res.render("adminHospitals", {
    user: req.session.user,
    message: req.session.message,
    messageType: req.session.messageType
  });
}
async function adminDoctorAllAppointments(req, res){
  res.render("adminDoctorAllAppointments",{
    user: req.session.user,
    message: req.session.message,
    messageType: req.session.messageType
  })
}

async function editHospital(req, res){
  res.render("editHospital",{
    user: req.session.user,
    message: req.session.message,
    messageType: req.session.messageType
  })
}

function auto(req,res,next){
  var regex = new RegExp(req.query["term"],"i");
  var doc = userData.find({city:regex},{'city':1}).sort({"updated_at":-1}).sort({"created_at":-1}).limit(5);
  doc.exec(function(err, data){
    console.log(data);
    var result=[];
    if(!err){
      if(data && data.length>0){
        data.forEach(user=>{
          let obj ={
            id:user._id,
            label: user.city
          };
          result.push(obj);
        });
      }
      console.log(result);
      res.jsonp(result);
    }
  });
}
async function logout(req, res) {
  req.session.user = null;
  req.session.loggedUser = false;
  req.session.filtered = false;
  req.session.message = "Successfully Logged Out";
  req.session.messageType = "Success";
  res.redirect("/emailLogin");
}