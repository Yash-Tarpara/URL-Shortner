const shortid = require("shortid");
const URL = require("../models/url");

async function handleGenerateNewShortUrl(req, res) {
  const body = req.body;
  if (!body.url) return res.status(400).json({error: `Url is required!`});
  const shortId = shortid.generate();
  await URL.create({
    shortId: shortId,
    redirectUrl: body.url,
    visitHistory: [],
    createdBy: req.user._id,
  });

  return res.render("home", {id: shortId});
}

async function handleAnalytics(req, res) {
  const shortId = req.params.id;
  const result = await URL.findOne({shortId});
  return res.json({
    totalClicks: result.visitHistory.length,
    Analytics: result.visitHistory,
  });
}

module.exports = {
  handleGenerateNewShortUrl,
  handleAnalytics,
};
