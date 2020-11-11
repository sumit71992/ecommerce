
var mongoose = require("mongoose");
var db = require("./Database");
var userData = require("./usersSchema");
var Schema = mongoose.Schema;

const orderSchema = new Schema({
	userId: {
		type: mongoose.ObjectId,
		ref: userData
	},
	products: {
		type: Object,
		required: true
	},
	phoneNumber: {
		type: Number,
		required: true
	},
	address: {
		type: String,
		required: true
  },
  paymentType: {
    type: String,
    default: 'COD'
  },
  status: {
    type: String,
    default: 'placed'
  },

  },
  { timestamps: true },
);
const orderData = mongoose.model("order",orderSchema);
module.exports = orderData;