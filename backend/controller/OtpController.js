const Nexmo = require('nexmo');
const db = require("../databases/userSchema");
const userData = require('../databases/userSchema');
module.exports = {
  otp_request: otp_request,
  otp_resend: otp_resend,
  otp_validate: otp_validate,
  forgot: forgot,
  login: login,
  otp_forgot_verification: otp_forgot_verification
}

const nexmo = new Nexmo({
  apiKey: '165364f3',
  apiSecret: 'rPRzqwkxd2Kagt2y'
});

function otp_request(req, res, next) {
  const mobile = req.body.number;
  console.log(mobile);
  userData.findOne({ "phoneNumber": mobile })
    .then(usr => {
      if (usr) {
        nexmo.verify.request({
          number: "91" + mobile,
          brand: 'Tvastra',
          code_length: '6',
          pin_expiry: "60"
        }, (err, result) => {
          if (err) {
            console.log("error", err);
            req.session.loggedUser = false;
            req.session.message = "OTP Not Sent";
            req.session.messageType = "Failure";
            res.redirect("/otplogin");
          }
          else {
            if (result) {
              req.session.user = usr;
              req.session.phoneNumber = mobile;
              req.session.nexmoRequestId = result.request_id;
              req.session.otpType = "login";
              req.session.message = "   OTP Sent Successfully";
              req.session.messageType = "Success";
              next();
            }
          }
        });
      }
      else {
        console.warn("mobile not registerd");
        req.session.loggedUser = false;
        req.session.message = "Mobile Number Not Registered";
        req.session.messageType = "Failure";
        res.redirect("/otplogin");
      }
    })
}
function otp_resend(req, res) {
  nexmo.verify.control({
    request_id: req.session.nexmoRequestId,
    cmd: 'cancel'
  }, (err, result) => {
    if (err) {
      console.log("error sending otp", err);
      req.session.message = "Error Sending OTP Try again";
      req.session.messageType = "Failure";
      res.redirect("/otp_verification");
    } else {
      nexmo.verify.request(
        {
          number: "91" + req.session.phoneNumber,
          brand: "Tvastra Resend",
          code_length: "6",
          pin_expiry: "60"
        }, (err1, result1) => {
          if (err1) {
            console.log("error sending otp", err1);
            req.session.message = "Error Sending OTP Try again";
            req.session.messageType = "Failure";
            return res.redirect("/otp_verification");
          } else {
            if (result1) {
              console.log("otp sent");
              req.session.phoneNumber = req.session.phoneNumber;
              req.session.nexmoRequestId = result1.request_id;
              req.session.message = "OTP Sent Successfully";
              req.session.messageType = "Success";
              return res.redirect("/otp_verification");
            } else {
              console.log("some error occured try again");
              req.session.message = "Error Sending OTP Try again";
              req.session.messageType = "Failure";
              return res.redirect("/otp_verification");
            }
          }
        });
    }
  });
}

function otp_validate(req, res, next) {
  var code = req.body.code;
  nexmo.verify.check({
    request_id: req.session.nexmoRequestId,
    code: code
  }, (err, result) => {
    if (result) {
      console.log("otp verified")
      req.session.message = "Otp Verified";
      req.session.messageType = "Success";
      next();
    }
    else {
      req.session.message = "Invalid Otp";
      req.session.messageType = "Failure"; 555
      res.redirect("/otp_verification")
    }
  });
}

function forgot(req, res) {
  const email = req.body.email.toLowerCase();
  console.log(email);
    userData.findOne({ "email": email })
    .then(usr => {
      if (usr) {
        const mobile = usr.phoneNumber;
        console.warn("number", mobile);
        nexmo.verify.request({
          number: "91" + mobile,
          brand: 'Tvastra forgot',
          code_length: '6',
          pin_expiry: "60"
        }, (err, result) => {
          if (err) {
            console.log("error", err);
            req.session.loggedUser = false;
            req.session.message = "Invalid Request";
            req.session.messageType = "Failure";
            res.redirect("/emaillogin");
          }
          else {
            if (result) {
              req.session.user = usr;
              req.session.phoneNumber = usr.phoneNumber;
              req.session.nexmoRequestId = result.request_id;
              req.session.otpType = "change password";
              req.session.message = "OTP Sent Successfully to change password";
              req.session.messageType = "Success";
              res.redirect("/otp_changepass");
            }
          }
        });
      }
      else {
        console.warn("email not registerd");
        req.session.loggedUser = false;
        req.session.message = "Email Not Registered";
        req.session.messageType = "Failure";
        res.redirect("/emaillogin");
      }
    })
}

function otp_forgot_verification(req, res) {
  var code = req.body.code;
  nexmo.verify.check({
    request_id: req.session.nexmoRequestId,
    code: code
  }, (err, result) => {
    if (result) {
      console.log("otp verified")
      req.session.message = "Otp Verified";
      req.session.messageType = "Success";
      res.redirect("/create_new_password");
    }
    else {
      req.session.message = "Invalid Otp";
      req.session.messageType = "Failure"; 555
      res.redirect("/otp_changepass")
    }
  });
}




function login(req,res){
  userData.find({}, function(err, res){
    if(err){
      console.warn("err",err);
    }
    else{
      console.warn("res",res);
      console.warn("zero",res[0].doctorData.speciality);
      console.warn(res[0].doctorData.speciality.length);
      console.warn(res.length);
    }
  })
 
}