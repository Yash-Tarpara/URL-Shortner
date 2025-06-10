const express = require("express");
const URL = require("../models/url");
const {restrictTo} = require("../middlewares/auth");

const Router = express.Router();

Router.get("/admin/urls", restrictTo(["ADMIN"]), async (req, res) => {
  const allUrls = await URL.find({});
  res.render("home", {
    urls: allUrls,
  });
});

Router.get("/", restrictTo(["NORMAL"]), async (req, res) => {
  const allUrls = await URL.find({createdBy: req.user._id});
  res.render("home", {
    urls: allUrls,
  });
});

Router.get("/signup", (req, res) => {
  return res.render("signup");
});

Router.get("/login", (req, res) => {
  return res.render("login");
});

module.exports = Router;
