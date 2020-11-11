
var mongoose = require("mongoose");
var db = require("./Database");
var userData = require("./usersSchema");
var Schema = mongoose.Schema;

const sellerSchema = new Schema({
	seller: {
		type: mongoose.ObjectId,
		ref: userData
	},
	productName: {
		type: String,
		required: true
	},
	quantity: {
		type: Number,
		required: true
	},
	price: {
		type: Number,
		required: true
  },
  type: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  Image: {
    type: String,
    required: true
  }

  },
  { timestamps: true },
);
const sellerData = mongoose.model("seller",sellerSchema);
module.exports = sellerData;