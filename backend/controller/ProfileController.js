const userData = require('../databases/usersSchema');
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
module.exports = {
  editprofile: editprofile,
  setting: setting
}

function editprofile(req, res) {
  var { name,
    number,
    email,
    gender,
    dob,
    timezone,
    housenum,
    locality,
    city,
    state,
    country,
    description,
    speciality,
    treatment,
    qualification,
    achievement,
    hospital,
    awards,
    experience,
    fees
  } = req.body;
  let Image;
  if (!req.params.userId) {
    if (req.file !== undefined) {
      Image = req.file.filename;
      mongoose.set('useFindAndModify', false);
      userData.findOneAndUpdate({ "email": req.session.user.email }, {
        name: name,
        phoneNumber: number,
        email: email.toLowerCase(),
        gender: gender,
        dob: dob,
        timeZone: timezone,
        houseNumber: housenum,
        locality: locality,
        city: city,
        state: state,
        country: country,
        Image: Image,
        "doctorData.description": description,
        "doctorData.speciality": speciality,
        "doctorData.treatments": treatment,
        "doctorData.qualifications": qualification,
       " doctorData.hospitals": hospital,
        'doctorData.achievements': achievement,
        "doctorData.awards": awards,
        "doctorData.experience": experience,
        "doctorData.averageFees": fees,
      }, function (err, result) {
        if (err) {
          console.warn("Error", err);
          req.session.message = "Error Occured";
          req.session.messageType = "Failure";
          res.redirect("/editprofile");
        } else {
          console.warn("Details Updated");
          req.session.message = "Details Updated";
          req.session.messageType = "Success";
          res.redirect("/editprofile");
        }
      })
    }
    else {
      mongoose.set('useFindAndModify', false);
      userData.findOneAndUpdate({ "email": req.session.user.email }, {
        name: name,
        phoneNumber: number,
        email: email.toLowerCase(),
        gender: gender,
        dob: dob,
        timeZone: timezone,
        houseNumber: housenum,
        locality: locality,
        city: city,
        state: state,
        country: country,
        "doctorData.description": description,
        "doctorData.speciality": speciality,
        "doctorData.treatments": treatment,
        "doctorData.qualifications": qualification,
       " doctorData.hospitals": hospital,
        'doctorData.achievements': achievement,
        "doctorData.awards": awards,
        "doctorData.experience": experience,
        "doctorData.averageFees": fees,
      }, function (err, result) {
        if (err) {
          console.warn("Error", err);
          req.session.message = "Error Occured";
          req.session.messageType = "Failure";
          res.redirect("/editprofile");
        } else {
          console.warn("Details Updated");
          req.session.message = "Details Updated";
          req.session.messageType = "Success";
          res.redirect("/editprofile");
        }
      })
    }
  } else {
    if (req.file !== undefined) {
      Image = req.file.filename;
      mongoose.set('useFindAndModify', false);
      userData.findOneAndUpdate({ _id: req.params.userId }, {
        name: name,
        phoneNumber: number,
        email: email.toLowerCase(),
        gender: gender,
        dob: dob,
        timeZone: timezone,
        houseNumber: housenum,
        locality: locality,
        city: city,
        state: state,
        country: country,
        Image: Image,
        "doctorData.description": description,
        "doctorData.speciality": speciality,
        "doctorData.treatments": treatment,
        "doctorData.qualifications": qualification,
        "doctorData.hospitals": hospital,
        'doctorData.achievements': achievement,
        "doctorData.awards": awards,
        "doctorData.experience": experience,
        "doctorData.averageFees": fees,
      }, function (err, result) {
        if (err) {
          console.warn("Error", err);
          req.session.message = "Error Occured";
          req.session.messageType = "Failure";
          res.redirect(`/editprofile/${req.params.userId}`);
        } else {
          console.warn("Admin user Details Updated");
          req.session.message = "Details Updated";
          req.session.messageType = "Success";
          res.redirect(`/editprofile/${req.params.userId}`);
        }
      })
    } else {
      mongoose.set('useFindAndModify', false);
      userData.findOneAndUpdate({ _id: req.params.userId }, {
        name: name,
        phoneNumber: number,
        email: email.toLowerCase(),
        gender: gender,
        dob: dob,
        timeZone: timezone,
        houseNumber: housenum,
        locality: locality,
        city: city,
        state: state,
        country: country,
        "doctorData.description": description,
        "doctorData.speciality": speciality,
        "doctorData.treatments": treatment,
        "doctorData.qualifications": qualification,
        " doctorData.hospitals": hospital,
        'doctorData.achievements': achievement,
        "doctorData.awards": awards,
        "doctorData.experience": experience,
        "doctorData.averageFees": fees,


      }, function (err, result) {
        if (err) {
          console.warn("Error", err);
          req.session.message = "Error Occured";
          req.session.messageType = "Failure";
          return res.redirect(`/editprofile/${req.params.userId}`);
        } else {
          console.warn("Admin user Details Updated");
          req.session.message = "Details Updated";
          req.session.messageType = "Success";
          return res.redirect(`/editprofile/${req.params.userId}`);
        }
      })
    }
  }
}

async function setting(req, res) {
  var { current_password, new_password,
    confirm_password } = req.body;
  new_password = bcrypt.hashSync(req.body.new_password, 10);
  if (current_password) {
    var cpass = await bcrypt.compare(current_password, req.session.user.password);
    if (cpass === false) {
      console.log("Current Password is incorrect");
      req.session.message = "Current Password is incorrect";
      req.session.messageType = "Failure";
      res.redirect("/setting");

    }
  }
  userData.findById(req.session.user._id)
    .then(result => {
      result.password = new_password;
      result.save()
        .then(usr => {
          console.log("Password changed succuss");
          req.session.loggedUser = false;
          req.session.user = null;
          req.session.message = "Password Changed Succussfully. Please Login again.";
          req.session.messageType = "Success";
          return res.redirect("/emailLogin");
        })
        .catch((err) => {
          console.log("Some error occured", err);
          req.session.message = "Password Not changed";
          req.session.messageType = "Failure";
          return res.redirect("/setting");
        });
    })
    .catch((err) => {
      console.log("Some error occured", err);
      req.session.message = "Password Not changed";
      req.session.messageType = "Failure";
      return res.redirect("/setting");
    });
}
