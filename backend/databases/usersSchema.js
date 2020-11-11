var mongoose = require("mongoose");
var db = require("./Database");
var Schema = mongoose.Schema;


const usersSchema = new Schema({
	name: {
		type: String,
		required: [true, 'Every user must have a name.']
	},
	number: {
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
	role: { type: String, enum: ["user", "seller", "admin"], default: "user" },
  },
  { timestamps: true },
);
const userData = mongoose.model("euser",usersSchema);
module.exports = userData;