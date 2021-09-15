const express = require("express");
const passport = require("passport");
const router = express.Router();


// @description   Authenticate With Google
// @route         GET /auth/google
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

// @description   Google Auth Callback
// @route         GET /auth/google/callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/home");
  }
);

// @description   Logout User
// @route         GET /auth/logout
router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

module.exports = router;
