const express = require("express");
const mainController = require("../controller/MainController");
const postController = require("../controller/PostController");
const middle = require("../controller/middle");
const otpController = require("../controller/OtpController");
const profileController = require("../controller/ProfileController");
const doctorController = require("../controller/DoctorController");
const scheduleController = require("../controller/ScheduleController");
const reportController = require("../controller/ReportController");
const adminController = require("../controller/AdminController");
const router = express.Router();
const app = express();
const path = require("path");
const multer = require("multer");
const ScheduleController = require("../controller/ScheduleController");


//MULTER START

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, path.join(__dirname + "../../../client/assets/images/uploads"));
  },
  filename: (req, file, cb) => {
      console.log(file);
      cb(null, Date.now() + path.extname(file.originalname));
  }
});
const fileFilter = (req, file, cb) => {
  console.log("multer file filter")
  if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
      cb(null, true);
  } else {
      cb(null, false);
  }
}
let upload  = multer({ storage: storage , fileFilter : fileFilter });

//MULTER END
/**********************************************LOAD PAGE*************************************************
 ******************************************************************************************************/
router.route("/").get(middle.notloggedin, middle.doctorProfileNotComplete,  mainController.profile);
router.route("/profile").get(middle.notloggedin, middle.doctorProfileNotComplete,doctorController.allDoctors,doctorController.loadCity, doctorController.search, mainController.profile);
router.route("/doctors").get(middle.notloggedin, middle.doctorProfileNotComplete, doctorController.allDoctors, mainController.doctors);
router.route("/doctors/:docId").get(middle.notloggedin, middle.doctorProfileNotComplete, doctorController.allDoctors, mainController.doctors);
router.route("/doctors/:pageI").get(middle.notloggedin, middle.doctorProfileNotComplete, doctorController.allDoctors, mainController.doctors);
router.route("/hospitals").get(middle.notloggedin, middle.doctorProfileNotComplete, adminController.loadHospitalData, mainController.hospitals);
router.route("/treatment").get(middle.notloggedin, middle.doctorProfileNotComplete, mainController.treatment);
router.route("/contactus").get(middle.notloggedin, middle.doctorProfileNotComplete, mainController.contactus);
router.route("/aboutus").get(middle.notloggedin, middle.doctorProfileNotComplete, mainController.aboutus);
router.route("/faq").get(middle.notloggedin, middle.doctorProfileNotComplete, mainController.faq);
router.route("/otplogin").get(middle.loggedin, mainController.otplogin);
router.route("/emaillogin").get(middle.login, mainController.emaillogin);
router.route("/signup").get(middle.loggedin, mainController.signup);
router.route("/submit_your_query").get(middle.notloggedin, middle.doctorProfileNotComplete, mainController.submit_your_query);
router.route("/about_hospital").get(middle.notloggedin, middle.doctorProfileNotComplete, mainController.about_hospital);
router.route("/appointment").get(middle.notloggedin, middle.doctorProfileNotComplete, mainController.appointment);
router.route("/bookappointment").get(middle.notloggedin, middle.doctorProfileNotComplete, mainController.bookappointment);
router.route("/aboutDoc/:docId").get(middle.notloggedin, middle.doctorProfileNotComplete, doctorController.aboutDoctor, mainController.aboutDoc);
router.route("/tvastra_plus").get(middle.notloggedin, middle.doctorProfileNotComplete, mainController.tvastra_plus);
router.route("/create_new_password").get(middle.loggedin, mainController.create_new_password);
router.route("/otp_changepass").get(middle.loggedin, mainController.otp_changepass);
router.route("/logout").get(middle.notloggedin, mainController.logout);
router.route("/otp_verification").get(middle.loggedin, mainController.otp_verification);
router.route("/add_doc_details").get(middle.notloggedin, middle.ifNotDoctor, middle.doctorProfileComplete, mainController.add_doc_details);
router.route("/login").get(middle.loggedin, mainController.login);
router.route("/login").post(middle.notloggedin, otpController.login);
router.route("/editprofile").get(middle.notloggedin, middle.doctorProfileNotComplete, mainController.editprofile);
router.route("/editprofile/:userId").get(middle.notloggedin, middle.notAdmin, adminController.loadUser, mainController.editprofile);
router.route("/setting").get(middle.notloggedin, middle.doctorProfileNotComplete, mainController.setting);
router.route("/allappointments").get(middle.notloggedin, middle.doctorProfileNotComplete, scheduleController.update, scheduleController.allappointments, mainController.allappointments);
router.route("/createSchedule").get(middle.notloggedin, middle.doctorProfileNotComplete, middle.ifNotDoctor, scheduleController.all, mainController.createSchedule);
router.route("/disableSchedule/:scheduleId/disabled/:status").get(middle.notloggedin, scheduleController.disableSchedule);
router.route("/disableSubSchedule/:subScheduleId/currentState/:status").get(middle.notloggedin, scheduleController.disableSubSchedule);
router.route("/scheduleOfCurrentDoctor/:docId").put(middle.notloggedin, scheduleController.alls);
router.route("/subSchedule/:docId/:dayName/:hospitalName").put(middle.notloggedin, scheduleController.subSchedule);
router.route("/bookingstatus").get(middle.notloggedin, middle.doctorProfileNotComplete, middle.appointment, mainController.status);
router.route("/reschedule/:appId").get(middle.notloggedin, middle.doctorProfileNotComplete,  scheduleController.getreschedule, mainController.reschedule);
router.route("/reschedule/:appId/:userId").get(middle.notloggedin, middle.notAdmin, scheduleController.getreschedule, mainController.reschedule);
router.route("/medicalreport").get(middle.notloggedin, middle.doctorProfileNotComplete, mainController.report);
router.route("/medicalreport/:userId").get(middle.notloggedin, middle.notAdmin,adminController.loadUser, mainController.report);
router.route("/showreport/:reportId").get(middle.notloggedin, middle.doctorProfileNotComplete,reportController.get, mainController.show);
router.route("/showreport/:reportId/:userId").get(middle.notloggedin, middle.notAdmin, adminController.loadUser, reportController.get, mainController.show);
router.route("/adminDashboard").get(middle.notloggedin, middle.notAdmin, adminController.loadAdminData, mainController.adminDashboard);
router.route("/adminUserAllAppointments/:userId").get(middle.notloggedin, middle.notAdmin, adminController.userAppointment, mainController.adminUserAppointment);
router.route("/adminUserAllAppointments").get(middle.notloggedin, middle.notAdmin, mainController.adminUserAppointment);
router.route("/adminUsers").get(middle.notloggedin, middle.notAdmin, adminController.loadAdminData, mainController.adminUser);
router.route("/adminEditProfile/:userId").get(middle.notloggedin, middle.notAdmin, adminController.loadUser, mainController.adminEditProfile);
router.route("/adminDoctors").get(middle.notloggedin, middle.notAdmin, adminController.loadAdminData, mainController.adminDoctor);
router.route("/adminHospitals").get(middle.notloggedin, middle.notAdmin, adminController.loadHospitalData, mainController.adminHospital);
router.route("/adminDoctorAllAppointments/:docId").get(middle.notloggedin, middle.notAdmin, adminController.getAllDoctorAppointments, mainController.adminDoctorAllAppointments);
router.route("/adminEditHospital/:hname").get(middle.notloggedin, middle.notAdmin, adminController.loadHospital, mainController.editHospital);
router.route("/autocomplete").get(middle.notloggedin, mainController.auto);
/**********************************************POST METHOD*************************************************
 ******************************************************************************************************/
router.route("/signup").post(middle.loggedin, postController.signup);
router.route("/emaillogin").post(middle.loggedin, postController.emaillogin);
router.route("/otp_request").post(middle.loggedin, otpController.otp_request, mainController.otp_verification);
router.route("/otp_resend").post(middle.loggedin, otpController.otp_resend);
router.route("/otp-validation").post(middle.loggedin, otpController.otp_validate, mainController.profile);
router.route("/otp_forgot_verification").post(middle.loggedin, otpController.otp_forgot_verification);
router.route("/forgot").post(middle.loggedin, otpController.forgot);
router.route("/create_new_password").post(middle.loggedin, postController.create_new_password);
router.route("/doc_details").post(middle.notloggedin, upload.single('Image'), postController.add_doc_details);
router.route("/editprofile").post(middle.notloggedin, upload.single('Image'), profileController.editprofile);
router.route("/editprofile/:userId").post(middle.notloggedin,middle.notAdmin, upload.single('Image'), profileController.editprofile);
router.route("/setting").post(middle.notloggedin, profileController.setting);
router.route("/filterDoc").post(middle.notloggedin, doctorController.filterDoc);
router.route("/filterDoc/:docFilter").post(middle.notloggedin, doctorController.filterDoc);
router.route("/sort").post(middle.notloggedin, doctorController.sort);
router.route("/createSchedule").post(middle.notloggedin, scheduleController.createSchedule);
router.route("/removeSlot").post(middle.notloggedin, scheduleController.removeSchedule);
router.route("/edit/:id").post(middle.notloggedin, middle.doctorProfileNotComplete, middle.ifNotDoctor, scheduleController.editslot);
router.route("/appointIt/:subScheduleId/:dayName").post(middle.notloggedin, scheduleController.appoint);
router.route("/booking").post(middle.notloggedin, scheduleController.book);
router.route("/cancel/:appId").post(middle.notloggedin, scheduleController.cancel);
router.route("/cancel/:appId/:userId").post(middle.notloggedin, scheduleController.cancel);
router.route("/rescheduleAppointment/:subSchId/:dayName").post(middle.notloggedin, scheduleController.reschedule);
router.route("/addRecord").post(middle.notloggedin,upload.array('Image',3), reportController.add);
router.route("/deleteRecord/:recordId").post(middle.notloggedin, reportController.delete, mainController.report);
router.route("/deleteRecord/:recordId/:userId").post(middle.notloggedin, middle.notAdmin, reportController.delete, mainController.report);
router.route("/addExistedReport/:reportId").post(middle.notloggedin, upload.array('Image',3), reportController.addExist, reportController.get, mainController.show);
router.route("/addExistedReport/:reportId/:userId").post(middle.notloggedin, upload.array('Image',3), reportController.addExist, reportController.get, mainController.show);
router.route("/deleteReports/:reportId/:reportsURL").post(middle.notloggedin, reportController.deletes, mainController.report);
router.route("/deleteReports/:reportId/:userId/:reportsURL").post(middle.notloggedin, reportController.deletes, mainController.report);
router.route("/adminCancelDoctorAppointment/:appId").post(middle.notloggedin, middle.notAdmin, adminController.cancel, adminController.loadAdminData, mainController.adminDoctor);
router.route("/editHospital").post(middle.notloggedin, middle.notAdmin, upload.single('Image'), adminController.editHospital);



router.route("/clearToaster").put(middle.clearToaster);

module.exports = router;