const express = require("express");
const Router = express.Router();
const {handleUserSignUp, handleUserLogin} = require("../controllers/user");

Router.post("/", handleUserSignUp);

Router.post("/login", handleUserLogin);

module.exports = Router;
