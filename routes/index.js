const express = require("express"),
      router = express.Router(),
	  passport = require("passport"),
	  User = require("../models/user"),
	  Error = require("../messages/error"),
	  Success = require("../messages/success");
      


//=============
// ROOT ROUTES
//=============

router.get("/", (req, res) => {
	res.render("landing");
});



//=============
// SIGNUP ROUTES
//=============
router.get("/register", (req, res) => {
	res.render("auth/register");
});

router.post("/register", (req, res) => {
	const newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, (err, user) => {
		if(err) {
			req.flash("error", Error.FAIL + err);
			res.redirect("auth/register");
		}
		passport.authenticate("local")(req, res, () => {
			req.flash("success", Success.SIGNUP_SUCCESS);
			res.redirect("/campgrounds");
		})
	})
});

//=============
// LOGIN ROUTES
//=============

router.get("/login", (req, res) => {
	res.render("auth/login");
});

router.post("/login", passport.authenticate("local",
	{
		successRedirect: "/campgrounds",
		failureRedirect: "/login",
		failureFlash: Error.LOGIN_FAILURE
	}), (req, res) => {
	
});

//=============
// LOGOUT ROUTES
//=============

router.get("/logout", (req, res) => {
	req.logout();
	res.redirect("/campgrounds");
});



module.exports = router;