const express = require("express");
const {
  handleGenerateNewShortUrl,
  handleAnalytics,
} = require("../controllers/url");
const Router = express.Router();

Router.post("/", handleGenerateNewShortUrl);
Router.get("/analytics/:id", handleAnalytics);
module.exports = Router;
