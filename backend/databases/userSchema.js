var mongoose = require("mongoose");
var db = require("./Database");
var Schema = mongoose.Schema;
var reportData = require("./MedicalReportSchema")


const userSchema = new Schema({
	name: {
		type: String,
		required: [true, 'Every user must have a name.']
	},
	gender: {
		type: String,
		enum: ['male', 'female', 'Other'],
		required: [true, 'Every user must have a gender.']
	},
	dob: {
		type: Date,
		required: [true, 'Every user must have a DOB']
	},
	phoneNumber: {
		type: Number,
		required: [true, 'Every user must have a phone number'],
		unique: true
	},
	email: {
		type: String,
		unique: true,
		required: [true, 'Every user must have a email address']
	},
	password: {
		type: String,
		required: [true, 'Every user must have a password.']
	},
	city: {
    type: String,
    lowercase: true,
	},
	state: {
    type: String,
    lowercase: true,
	},
	country: {
		type: String,
  },
  timeZone: {
    type: String,
    trim: true,
  },
  houseNumber: {
    type: String,
    lowercase: true,
    trim: true
  },
  locality: {
    type: String,
    lowercase: true,
    trim: true
  },
	role: { type: String, enum: ["user", "doctor", "admin"], default: "user" },
  
  doctorData: {
    description: {
      type: String,
      trim: true
    },
    speciality: {
      type: Array,
      lowercase: true,
    },
    treatments:{
      type: Array,
      lowercase: true,
    },
    qualifications: {
      type: Array,
      lowercase: true,
    },
    hospitals: {
      type: Array,
      lowercase: true,
    },
   
    achievements: {
      type: Array,
      lowercase: true,
    },
    awards: {
      type: Array,
      lowercase: true,
    },
    experience: {
      type: Number
    },
    averageFees: {
      type: Number
    }
  },
  Image: {
    type: String
  },
  medicalReportData: [reportData.medicalReportSchema]
  },
  

  { timestamps: true },
);
const userData = mongoose.model("User",userSchema);
module.exports = userData;