const db = require("../databases/Database");
const bcrypt = require("bcryptjs");
const userData = require("../databases/userSchema");
const multer = require("multer");
const path = require("path")
const mongoose = require("mongoose");


const signup = async (req, res) => {
  req.body.password = bcrypt.hashSync(req.body.password, 10);
  const users = await userData.create({
    name: req.body.name,
    gender: req.body.gender,
    dob: req.body.dob,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email.toLowerCase(),
    password: req.body.password,
    city: req.body.city,
    state: req.body.state,
    country: req.body.country,
    role: req.body.isdoctor ? "doctor" : "user"
  });
  users
    .save()
    .then((usr) => {
      console.warn("new user created Successfully");
      req.session.loggedUser = true;
      req.session.user = usr;
      req.session.message = "Sign Up Success";
      req.session.messageType = "Success";
      return req.session.user.role === "doctor" ? res.redirect("/emaillogin") : res.redirect("/profile");
    })
    .catch((err) => {
      console.log("Some error occured", err);
      req.session.loggedUser = false;
      req.session.message = "Sign Up Failed";
      req.session.messageType = "Failure";
      if (err.code === 11000) {
        req.session.message = `${err.keyValue[((Object.keys(err.keyPattern)))]} is already registered.`;
      }
      return res.redirect("/signup");
    });
}

const emaillogin = async (req, res) => {
  const { email, password } = req.body;

  userData.findOne({ email: email.toLowerCase() })
    .then(async (usr) => {
      if (usr) {
        await bcrypt.compare(
          password, usr.password,
          async (err, result) => {
            if (err) {
              console.warn("Invalid Password", err);
              req.session.loggedUser = false;
              req.session.message = "Login Failed";
              req.session.messageType = "Failure";
              return res.redirect("/emailLogin");
            } else if (result === true) {
              console.log("Login Success");
              req.session.loggedUser = true;
              req.session.user = usr;
              req.session.message = "Login Successfull";
              req.session.messageType = "Success";
              return req.session.user.role == "admin" ? res.redirect("/adminDashboard") : res.redirect("/profile");
            } else {
              console.log("Wrong Password");
              req.session.loggedUser = false;
              req.session.message = "Invalid Password";
              req.session.messageType = "Failure";
              res.redirect("emaillogin");
            }

          }
        );
      } else {
        console.log("User not exist");
        req.session.message = "User Doesn't Exists";
        req.session.messageType = "Failure"
        req.session.loggedUser = false;
        return res.redirect("/emailLogin");
      }
    })
    .catch((err) => {
      console.log("User not exist");
      req.session.loggedUser = false;
      req.session.message = "Wrong username";
      req.session.messageType = "Failure";
      return res.redirect("/emailLogin");
    });
}

async function create_new_password(req, res) {
  var { password, cnfpassword } = req.body;
  password = bcrypt.hashSync(req.body.password, 10);

  userData.findById(req.session.user._id)
    .then(result => {
      result.password = password;
      result.save()
        .then(usr => {
          console.warn("password successfully changed");
          req.session.loggedUser = false;
          req.session.user = null;
          req.session.message = "Password Changed Successfully";
          req.session.messageType = "Success";
          res.redirect("/emaillogin");
        })
        .catch((err) => {
          console.warn("Some error", err);
          req.session.message = "Error Occured Try Again";
          req.session.messageType = "Failure";
          req.session.loggedUser = false;
          res.redirect("/create_new_password");
        });
    })
    .catch((err) => {
      console.log("Some error occured", err);
      req.session.message = "Try Again Due to Technical Issue";
      req.session.messageType = "Failure";
      req.session.loggedUser = false;
      return res.redirect("/create_new_password");
    });

}

const add_doc_details = (req, res) => {
  var { description,
    speciality,
    treatment,
    qualification,
    hospital,
    achievement,
    awards,
    experience,
    fees } = req.body;
    let Image;
  
  userData.findById(req.session.user._id)
    .then(result => {
      if (req.file !== undefined) {
        Image = req.file.filename;
        result.doctorData.description = description,
          result.doctorData.speciality = speciality,
          result.doctorData.treatments = treatment,
          result.doctorData.qualifications = qualification,
          result.doctorData.hospitals = hospital,
          result.doctorData.achievements = achievement,
          result.doctorData.awards = awards,
          result.doctorData.experience = experience,
          result.doctorData.averageFees = fees,
          result.Image = Image
      } else {
        result.doctorData.description = description,
          result.doctorData.speciality = speciality,
          result.doctorData.treatments = treatment,
          result.doctorData.qualifications = qualification,
          result.doctorData.hospitals = hospital,
          result.doctorData.achievements = achievement,
          result.doctorData.awards = awards,
          result.doctorData.experience = experience,
          result.doctorData.averageFees = fees
      }
      console.warn("data", result.doctorData.speciality);
      result.save()
        .then(usr => {
          console.warn("data saved");
          req.session.user = usr;
          req.session.message = "Data Saved";
          req.session.messageType = "Success";
          res.redirect("profile");
        })
        .catch((err) => {
          console.warn("Some error", err);
          req.session.message = "Error Occured Try Again";
          req.session.messageType = "Failure";
          req.session.loggedUser = true;
        })
    })
    .catch((err) => {
      console.warn("Some error", err);
      req.session.message = "Error Occured Try Again";
      req.session.messageType = "Failure";
      req.session.loggedUser = true;
    })
}

module.exports = {
  signup: signup,
  emaillogin: emaillogin,
  create_new_password: create_new_password,
  add_doc_details: add_doc_details
}