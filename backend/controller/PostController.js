const db = require("../databases/Database");
const bcrypt = require("bcryptjs");
const userData = require("../databases/usersSchema");
const sellerData = require("../databases/sellerSchema");
const orderData = require("../databases/orderSchema");
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");
const axios = require("axios");

const signup = async (req, res) => {
  req.body.password = bcrypt.hashSync(req.body.password, 10);
  const euser = await userData.create({
    name: req.body.name,
    number: req.body.number,
    email: req.body.email.toLowerCase(),
    password: req.body.password,
    role: req.body.isdoctor ? "seller" : "user",
  });
  euser
    .save()
    .then((usr) => {
      console.warn("new user created Successfully");
      req.session.loggedUser = true;
      req.session.user = usr;
      req.session.message = "Sign Up Success";
      req.session.messageType = "Success";
      return req.session.user.role === "seller"
        ? res.redirect("/login")
        : res.redirect("/index");
    })
    .catch((err) => {
      console.log("Some error occured", err);
      req.session.loggedUser = false;
      req.session.message = "Sign Up Failed";
      req.session.messageType = "Failure";
      if (err.code === 11000) {
        req.session.message = `${
          err.keyValue[Object.keys(err.keyPattern)]
        } is already registered.`;
      }
      return res.redirect("/signup");
    });
};

const emaillogin = async (req, res) => {
  const { email, password } = req.body;

  userData
    .findOne({ email: email.toLowerCase() })
    .then(async (usr) => {
      if (usr) {
        await bcrypt.compare(password, usr.password, async (err, result) => {
          if (err) {
            console.warn("Invalid Password", err);
            req.session.loggedUser = false;
            req.session.message = "Login Failed";
            req.session.messageType = "Failure";
            return res.redirect("/login");
          } else if (result === true) {
            console.log("Login Success");
            req.session.loggedUser = true;
            req.session.user = usr;
            req.session.message = "Login Successfull";
            req.session.messageType = "Success";
            return req.session.user.role == "seller"
              ? res.redirect("/seller")
              : res.redirect("/");
          } else {
            console.log("Wrong Password");
            req.session.loggedUser = false;
            req.session.message = "Invalid Password";
            req.session.messageType = "Failure";
            res.redirect("/login");
          }
        });
      } else {
        console.log("User not exist");
        req.session.message = "User Doesn't Exists";
        req.session.messageType = "Failure";
        req.session.loggedUser = false;
        return res.redirect("/login");
      }
    })
    .catch((err) => {
      console.log("User not exist");
      req.session.loggedUser = false;
      req.session.message = "Wrong username";
      req.session.messageType = "Failure";
      return res.redirect("/login");
    });
};

async function create_new_password(req, res) {
  var { password, cnfpassword } = req.body;
  password = bcrypt.hashSync(req.body.password, 10);

  userData
    .findById(req.session.user._id)
    .then((result) => {
      result.password = password;
      result
        .save()
        .then((usr) => {
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

const add = (req, res) => {
  const seller = new sellerData({
    seller: mongoose.Types.ObjectId(req.session.user._id),
    productName: req.body.name,
    quantity: req.body.quantity,
    price: req.body.price,
    description: req.body.des,
    Image: req.file.filename,
  });
  seller
    .save()
    .then((usr) => {
      console.warn("Product added");
      req.session.message = "Product added";
      req.session.messageType = "Success";
      return res.redirect("/seller");
    })
    .catch((err) => {
      console.log("Some error occured", err);
      req.session.message = "Product added failed";
      req.session.messageType = "Failure";
      return res.redirect("/seller");
    });
};

function update(req, res) {
  // let cart = {
  //   items : {
  //     productId : { item : productObject, qty: 0 },
  //   },
  //   totalQty: 0,
  //   totalPrice: 0
  // }
  if (!req.session.user.cart) {
    req.session.user.cart = {
      items: {},
      totalQty: 0,
      totalPrice: 0,
    };
  }
  let cart = req.session.user.cart;
  if (!cart.items[req.body._id]) {
    cart.items[req.body._id] = {
      item: req.body,
      qty: 1,
    };
    cart.totalQty = cart.totalQty + 1;
    cart.totalPrice = cart.totalPrice + req.body.price;
  } else {
    cart.items[req.body._id].qty = cart.items[req.body._id].qty + 1;
    cart.totalQty = cart.totalQty + 1;
    cart.totalPrice = cart.totalPrice + req.body.price;
  }
  return res.json({ totalQty: req.session.user.cart.totalQty });
}
function order(req, res) {
  let { number, address } = req.body;
  if (!number || !address) {
    req.session.message = " All fields are required";
    req.session.messageType = "Failure";
    return res.redirect("/cart");
  }
  const orders = new orderData({
    userId: req.session.user._id,
    products: req.session.user.cart.items,
    phoneNumber: number,
    address,
  });
  orders.save().then((result) => {
    req.session.message = "order placed";
    req.session.messageType= "Success";
    delete req.session.user.cart;
    return res.redirect("/myorder");
  }).catch(err=>{
    req.session.message = "something went wrong";
    req.session.messageType= "Failure";
    return res.redirect("/cart");
  })

}
async function myorder(req, res, next) {
  const id = req.session.user._id;
  await orderData.find({ userId: id }, null , {sort: {'createdAt': -1}})
      .then(allOrder => {
          if (allOrder) {
              console.log("All orders fetched Successfully");
              req.session.user.allOrder = allOrder;
              console.log("All orders fetched Successfully");
              next();
          }
          else {
              console.log(`The doctor ${req.session.user.name} have no orders yet`);
              req.session.user.allOrder = allOrder;
              next();
          }
      })
      .catch(err => {
          console.log("Error occured finding schedules", err)
          next();
      });
}


module.exports = {
  signup: signup,
  login: emaillogin,
  create_new_password: create_new_password,
  add: add,
  update: update,
  order: order,
  myorder: myorder
};
