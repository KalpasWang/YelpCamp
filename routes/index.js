const express = require("express"),
      router = express.Router(),
	  passport = require("passport"),
	  User = require("../models/user");
      


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
			console.log(err);
			res.redirect("auth/register");
		}
		passport.authenticate("local")(req, res, () => {
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
		failureRedirect: "/login"
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