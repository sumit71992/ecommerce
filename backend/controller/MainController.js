const express = require("express");
const userData = require("../databases/usersSchema");
const sellerData = require("../databases/sellerSchema");
const db = require("../databases/Database")
const mongoose = require("mongoose");


module.exports = {
  index: index,
  profile: profile,
  cart: cart,
  product: product,
  contactus: contactus,
  aboutus: aboutus,
  myorder: myorder,
  login: login,
  signup:signup,
  seller: seller,
  logout: logout
};
async function index(req, res) {
  res.render("index", {
    user: req.session.user,
    message: req.session.message,
    messageType: req.session.messageType
  });
}
async function profile(req, res) {
  res.render("profile", {
    user: req.session.user,
    message: req.session.message,
    messageType: req.session.messageType
  });
}
async function cart(req, res) {
  return res.render("cart", {
    user: req.session.user,
    message: req.session.message,
    messageType: req.session.messageType
  });
}
async function myorder(req, res) {
  return res.render("myorder", {
    user: req.session.user,
    message: req.session.message,
    messageType: req.session.messageType
  });
}
async function seller(req, res) {
  res.render("seller", {
    user: req.session.user,
    message: req.session.message,
    messageType: req.session.messageType
  });
}
async function contactus(req, res) {
  res.render("contactus", {
    user: req.session.user,
    message: req.session.message,
    messageType: req.session.messageType
  });
}
async function aboutus(req, res) {
  res.render("aboutus", {
    user: req.session.user,
    message: req.session.message,
    messageType: req.session.messageType
  });
}
async function login(req, res) {
  res.render("login", {
    user: req.session.user,
    message: req.session.message,
    messageType: req.session.messageType,
  });
}
async function signup(req, res) {
  res.render("signup", {
    user: req.session.user,
    message: req.session.message,
    messageType: req.session.messageType
  });
}
async function product(req, res, next) {
  try{
    let all = await sellerData.find();
    req.session.user.product = all;
  }
 finally{
   next();
 }
}
async function logout(req, res) {
  req.session.user = null;
  req.session.loggedUser = false;
  req.session.filtered = false;
  req.session.message = "Successfully Logged Out";
  req.session.messageType = "Success";
  res.redirect("/login");
}