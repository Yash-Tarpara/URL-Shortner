require("dotenv").config();

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
const PORT = process.env.PORT || 8000;

// Use environment variable for MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI environment variable is not set!");
  console.error(
    "Please add your MongoDB Atlas connection string to Replit Secrets"
  );
  process.exit(1);
}

// Connect to MongoDB Atlas
connectToMongoDB(MONGODB_URI)
  .then(() => console.log("MongoDB Atlas connected successfully!"))
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1);
  });

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
  try {
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
  } catch (error) {
    console.error("Error redirecting:", error);
    res.status(500).send("Internal server error");
  }
});

app.listen(PORT, () => console.log(`Server started at port: ${PORT}`));
