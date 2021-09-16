require("./db/connect");
require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const connectToDB = require("./db/connect");
const ejs = require("ejs");
const ejsMate = require("ejs-mate");
const ExpressError = require("./helpers/ExpressError");
const session = require("express-session");
const path = require("path");
const passport = require("passport");
const MongoStore = require("connect-mongo");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const helmet = require("helmet");

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(console.log("Connected to MongoDB via Mongoose"))
  .catch((err) => {
    console.log("Error", err);
  });

// Passport Config
require("./config/passport")(passport);

const app = express();

// App Set Up
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(flash());
app.use(helmet());

const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/js/bootstrap.bundle.min.js",
  "https://kit.fontawesome.com/c1f368b5b8.js",
  "https://cdnjs.cloudflare.com/ajax/libs/ckeditor/4.16.2/ckeditor.js",
];
const styleSrcUrls = [
  "https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css",
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
  "https://fontawesome.com/",
  "https://fontawesome.com/v5.15/icons?d=gallery&p=2",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css",
  "https://kit.fontawesome.com/c1f368b5b8.js",
  "https://fontawesome.com/start",
  "https://icons.getbootstrap.com/",
  "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css",
];
const fontSrcUrls = [];
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: false,
    directives: {
      defaultSrc: [],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      imgSrc: ["'self'", "blob:", "data:", "https://images.unsplash.com/"],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);

//Methodoverride
app.use(methodOverride("_method"));

const secret = process.env.SECRET;

// Session
app.use(
  session({
    name: "OurJournal",
    secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
        secure: true
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI, //(URI FROM.env file)
      crypto: {
        secret
      }
    }),
  })
);

// Locals
app.locals.stripTags = function (input) {
  return input.replace(/<(?:.|\n)*?>/gm, "");
};
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Static folder
app.use(express.static(path.join(__dirname, "public")));

//Routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/entries", require("./routes/entries"));

// Error Handling
// app.use((err, req, res, next) => {
//     next(new ExpressError('Page Not Found', 404))
// })

// app.all('*', (req, res, next) => {
//     next(new ExpressError('Page not found', 404))
// });

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message)
    err.message =
      "Oh, no! Looks like something went wrong. Please go back and try again.";
  res.status(statusCode).render("error", { err });
});

const port = process.env.PORT || 3000;


app.listen(port, () => {
  console.log(`Listening to port ${port}.`);
});


