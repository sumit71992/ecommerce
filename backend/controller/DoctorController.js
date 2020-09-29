const userData = require("../databases/userSchema");
module.exports = {
  allDoctors: allDoctors,
  aboutDoctor: aboutDoctor,
  sort: sort,
  filterDoc: filterDoc,
  search: loadSearchData,
  loadCity: loadCity
}

async function allDoctors(req, res, next) {
  try {
    if (req.session.filtered !== true) {
      const allDocs = await userData.find({ role: "doctor" }).sort(req.session.sortBy);
      req.session.user.doctorList = allDocs;
      req.session.user.doctorListFilter = allDocs;
      req.session.user.filter = [];
    }
  }
  catch(err){
    console.warn("error",err) || 1;
  }
  finally{
    next();
  }
}

async function aboutDoctor(req, res, next){
  var docData;
  for (var i = 0; i < req.session.user.doctorList.length; i++) {
      if (req.session.user.doctorList[i]._id == req.params.docId)
          docData = req.session.user.doctorList[i];
  }
  req.session.user.doc = docData;
  next();
}

async function filterDoc(req, res, next){
  try{
  var { city, treatments, hospitals, experience } = req.body;
  var docName = req.params.docFilter || null;
  console.warn(docName);
  req.session.user.filter=[];
  if(!req.session.sortBy)
  req.session.sortBy="1";
  let fCity = city ? city : [], fTreatments = treatments ? treatments: [], fHospitals = hospitals ? hospitals: [], fExperience = experience ? experience: [];
  fCity.forEach(e =>{
    if(req.session.user.filter.indexOf(e)===-1){
      req.session.user.filter.push(e);
    }
  });
  fTreatments.forEach(e =>{
    if(req.session.user.filter.indexOf(e)===-1){
      req.session.user.filter.push(e);
    }
  });
  fHospitals.forEach(e =>{
    if(req.session.user.filter.indexOf(e)===-1){
      req.session.user.filter.push(e);
    }
  })
  fExperience.forEach(e =>{
    if(req.session.user.filter.indexOf(e)===-1){
      req.session.user.filter.push(e);
    }
  });
  var max = 0;
  if(fExperience.length>0){
    max = parseInt(fExperience[0]);
    for(var i=0; i<fExperience.length; i++)
    max=parseInt(fExperience[i])>max ? parseInt(fExperience[i]): max;
  }
  var query ={
    role: "doctor",
    city: {$all: fCity},
    "doctorData.experience": {$gt: max},
    "doctorData.treatments": {$all: fTreatments},
    "doctorData.hospitals": {$all: fHospitals}
  };
  if(fCity.length ===0){
    delete query.city;
  }
  if (fTreatments.length === 0) {
    delete query["doctorData.treatments"];
}
if (fHospitals.length === 0) {
    delete query["doctorData.hospitals"];
}
if (req.body.name) {
    req.session.user.filter.push(req.body.name);
    query = {
        role: "doctor",
        name: req.body.name
    }
}
else
    if (docName !== null) {
        query = {
            role: "doctor"
        }
    }
    let result = await userData.find(query).sort(req.session.sortBy);
    req.session.user.doctorList = result;
    req.session.filtered = true;
}
catch (err) {
  console.log("error occured ", err)
}
finally {
  return res.redirect("/doctors");
}
}

async function sort(req, res){
  req.session.sortBy = sortBy = req.body.sort.split("-")[1] === "asc" ? req.body.sort.split("-")[0] : "-" + req.body.sort.split("-")[0];
  return res.redirect("/doctors");
}
async function loadCity(req, res, next){
  let result =[];
  let city = [];
  for(var i=0; i<req.session.user.doctorList.length; i++){
    city.push(req.session.user.doctorList[i].city);
  }
  var data = {};
  for (var i = 0; i < city.length; i++) {
      data = {};
      data.city = city[i];
      if (city.indexOf(city[i]) === i)
          result.push(data);
  }
  req.session.user.searchCity = result;
  next();
}
async function loadSearchData(req, res, next) {
  let allSearchData = [];
  let names = [], treatments = [], hospitals = [], qualifications = [];
  for (var i = 0; i < req.session.user.doctorList.length; i++) {
      names.push(req.session.user.doctorList[i].name);
      if (req.session.user.doctorList[i].doctorData.treatments && req.session.user.doctorList[i].doctorData.treatments !== null)
          for (var j = 0; j < req.session.user.doctorList[i].doctorData.treatments.length; j++) {
              treatments.push(req.session.user.doctorList[i].doctorData.treatments[j])
          }
  }
  for (var i = 0; i < req.session.user.doctorList.length; i++) {
      if (req.session.user.doctorList[i].doctorData.hospitals && req.session.user.doctorList[i].doctorData.hospitals !== null)
          for (var j = 0; j < req.session.user.doctorList[i].doctorData.hospitals.length; j++) {
              hospitals.push(req.session.user.doctorList[i].doctorData.hospitals[j]);
          }
  }
  for (var i = 0; i < req.session.user.doctorList.length; i++) {
      if (req.session.user.doctorList[i].doctorData.qualifications && req.session.user.doctorList[i].doctorData.qualifications !== null)
          for (var j = 0; j < req.session.user.doctorList[i].doctorData.qualifications.length; j++) {
              qualifications.push(req.session.user.doctorList[i].doctorData.qualifications[j])
          }
  }
  var data = {};
  for (var i = 0; i < names.length; i++) {
      data = {};
      data.name = names[i];
      if (names.indexOf(names[i]) === i)
          allSearchData.push(data);
  }
  for (var i = 0; i < treatments.length; i++) {
      data = {};
      data.treatments = treatments[i];
      if (treatments.indexOf(treatments[i]) === i)
          allSearchData.push(data);
  }
  for (var i = 0; i < hospitals.length; i++) {
      data = {};
      data.hospitals = hospitals[i];
      if (hospitals.indexOf(hospitals[i]) === i)
          allSearchData.push(data);
  }
  for (var i = 0; i < qualifications.length; i++) {
      data = {};
      data.qualifications = qualifications[i];
      if (qualifications.indexOf(qualifications[i]) === i)
          allSearchData.push(data);
  }
  req.session.user.allSearchData = allSearchData;
  next();
}