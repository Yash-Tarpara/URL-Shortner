const express = require("express");
const path = require("path");
const {connectToMongoDB} = require("./connect");
const URL = require("./models/url");
const cookieParser = require("cookie-parser");
const {checkForAuthentication, restrictTo} = require("./middlewares/auth");

const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/user");

const app = express();
const PORT = 8000;

connectToMongoDB("mongodb://127.0.0.1:27017/short-url")
  .then(() => console.log("MongoDB connected!"))
  .catch((err) => console.error(`Error connecting mongo`));

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(checkForAuthentication);

app.use("/", staticRoute);
app.use("/url", restrictTo(["NORMAL"]), urlRoute);
app.use("/user", userRoute);

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.get("/:id", async (req, res) => {
  const shortID = req.params.id;
  const entry = await URL.findOneAndUpdate(
    {
      shortId: shortID,
    },
    {
      $push: {
        visitHistory: {timestamp: Date.now()},
      },
    }
  );

  if (!entry) {
    return res.status(404).send("Short URL not found");
  }

  res.redirect(entry.redirectUrl);
});

app.listen(PORT, () => console.log(`Server started at port: ${PORT}`));
