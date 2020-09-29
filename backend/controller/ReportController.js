const mongoose = require("mongoose");
const userData = require("../databases/userSchema");
const reportData = require("../databases/MedicalReportSchema");


module.exports = {
  add: addRecord,
  get: getReport,
  delete: deleteReport,
  addExist: addExistedReport,
  deletes: deleteReports
}


async function addRecord(req, res) {
  try {
    console.log(req.body.reportInput);
    if (req.files == undefined || !req.body.reportInput) {
      req.session.message = "Please check type of report Or Select a Image";
      req.session.messageType = "Failure";
    } else {

      let image = [];
      for (var m = 0; m < req.files.length; m++) {
        image.push(req.files[m].filename);
      }
      let user = await userData.findOne({
        _id: req.session.user._id
      });
      let allReports = user.medicalReportData ? user.medicalReportData : [];
      let report = {
        title: req.body.title,
        dateOfReport: req.body.date,
        typeOfReport: req.body.reportInput,
        reports: image
      }
      allReports.push(report);
      user.medicalReportData = allReports;
      const finalData = await user.save();
      req.session.user = finalData;
      req.session.message = "Report Uploaded Successfully";
      req.session.messageType = "Success";
      console.log("Report Uploaded");
    }
  }
  catch (err) {
    console.log("Erro occured", err)
    req.session.message = "Error Uploading Report ";
    req.session.messageType = "Failure";
  }
  finally {
    return await res.redirect("/medicalreport");
  }
}

async function getReport(req, res, next) {
  try {
    const recordId = req.params.reportId;
    var record;
    if (!req.params.userId) {
      for (var i = 0; i < req.session.user.medicalReportData.length; i++) {
        if (recordId.toString().trim() === req.session.user.medicalReportData[i]._id.toString().trim()) {
          record = req.session.user.medicalReportData[i];
        }
      }
      req.session.user.report = record;
      console.log(req.session.user.report);
    } else {
      for (var i = 0; i < req.session.user.adminData.userData.medicalReportData.length; i++) {
        if (recordId == req.session.user.adminData.userData.medicalReportData[i]._id) {
          record = req.session.user.adminData.userData.medicalReportData[i];
        }
      }
      req.session.user.adminData.userData.report = record;
    }
  }
  catch (err) {
    console.log("Some error occured", err);
  }
  finally {
    
    next();
  }
}

async function deleteReport(req, res, next) {
  try {
    const recordId = req.params.recordId;
    if (!req.params.userId) {
      const reportFindResult = await userData.findOne({
        _id: req.session.user._id
      });
      for (var i = 0; i < reportFindResult.medicalReportData.length; i++) {
        if (recordId == reportFindResult.medicalReportData[i]._id) {
          reportFindResult.medicalReportData[i].isDisabled = true;
        }
      }
      let users = await reportFindResult.save();
      req.session.user = users;

    } else {
      let userFindRes = await userData.findOne({ _id: mongoose.Types.ObjectId(req.params.userId) });
      for (var i = 0; i < userFindRes.medicalReportData.length; i++) {
        if (recordId == userFindRes.medicalReportData[i]._id) {
          userFindRes.medicalReportData[i].isDisabled = true;
        }
      }
      let users = await userFindRes.save();
      req.session.user.adminData.userData = users;
    }
  }
  catch (err) {
    console.log("Some error occured", err);
  }
  finally {
    return req.session.user.role === "admin" ? res.redirect(`/medicalreport/${req.params.userId}`) : next();
  }
}

async function addExistedReport(req, res, next) {
  try {
    const recordId = req.params.reportId;
    const reportFindResult = await userData.findOne({
      _id: req.params.userId ? req.params.userId : req.session.user._id
    });
    const allPics = [];
    for (var m = 0; m < req.files.length; m++) {
      allPics.push(req.files[m].filename);
    }
    for (var i = 0; i < reportFindResult.medicalReportData.length; i++) {
      if (recordId == reportFindResult.medicalReportData[i]._id)
        reportFindResult.medicalReportData[i].reports.push(...allPics);
    }
    const users = await reportFindResult.save();
    if (req.params.userId){
    req.session.user.adminData.userData.medicalReportData = users.medicalReportData;
    }else{
    req.session.user.medicalReportData = users.medicalReportData;
    }
  }
  catch (err) {
    console.log("Some error occured", err);
  }
  finally {
    console.log("success");
    next();
  }
}

async function deleteReports(req, res, next) {
  try {
    const recordId = req.params.reportId;
    const picURL = req.params.reportsURL;
    const reportFindResult = await userData.findOne({
      _id: req.params.userId ? req.params.userId : req.session.user._id
    });
    for (var i = 0; i < reportFindResult.medicalReportData.length; i++) {
      if (recordId == reportFindResult.medicalReportData[i]._id) {
        for (var j = 0; j < reportFindResult.medicalReportData[i].reports.length; j++) {
          if (reportFindResult.medicalReportData[i].reports[j] == picURL)
            reportFindResult.medicalReportData[i].reports.splice(j, 1);
        }
      }
    }
    const users = await reportFindResult.save();
    if(req.params.userId){
      req.session.user.adminData.userData.medicalReportData = users.medicalReportData;
    }else{
      req.session.user.medicalReportData = users.medicalReportData;
    }


  }
  catch (err) {
    console.log("Some error occured", err);
  }
  finally {
    console.log("success");
    next();
  }
}
