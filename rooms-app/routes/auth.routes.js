const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/User.model");
const Room = require("../models/Room.model");
const SALT_FACTOR = 12;

const router = require("express").Router();

const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

/**
 * signup
 */

router.get("/signup", isLoggedOut, (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", isLoggedOut, async (req, res, next) => {
  const { email, password, fullName } = req.body;
  console.log(req.file);

  //checking if something is missing from the fields
  if (!email || !password) {
    return res.render("auth/signup", {
      errorMessage:
        "credentials missing, please fill all forms, this is mandatory.",
    });
  }

  //checking if password meets the requirements
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
  if (!regex.test(password)) {
    return res.render("auth/signup", {
      errorMessage:
        "Password needs to have 8 char, including lower/upper case and a digit",
    });
  }

  //checking if user exists
  //try catch here is to wait for the DB to respond, hence async/await
  try {
    const foundUser = await User.findOne({ email });

    if (foundUser) {
      return res.render("auth/signup", {
        errorMessage: "Email already in use",
      });
    }

    const hashedPassword = bcrypt.hashSync(password, SALT_FACTOR);
    await User.create({
      email,
      password: hashedPassword,
      fullName,
    });

    res.redirect("/auth/login");
  } catch (error) {
    next(error);
  }
});

/**
 * login
 */

router.get("/login", isLoggedOut, (req, res) => {
  res.render("auth/login");
});

router.post("/login", isLoggedOut, async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.render("auth/login", {
      errorMessage: "Credentials are mandatory!",
    });
  }

  try {
    const foundUser = await User.findOne({ email });

    if (!foundUser) {
      return res.render("auth/login", {
        errorMessage: "Wrong credentials",
      });
    }

    const checkPassword = bcrypt.compareSync(password, foundUser.password);
    if (!checkPassword) {
      return res.render("auth/login", {
        errorMessage: "Wrong credentials",
      });
    }

    const objectUser = foundUser.toObject();
    delete objectUser.password;
    req.session.currentUser = objectUser;

    return res.redirect("/rooms");
  } catch (error) {}
});

/**
 * logout
 */

router.get("/logout", isLoggedIn, (req, res) => {
  req.session.destroy();
  res.redirect("/auth/login");
});

module.exports = router;
