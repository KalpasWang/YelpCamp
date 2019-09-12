const express = require("express"),
      router = express.Router(),
	  Campground = require("../models/campground"),
	  bodyParser = require("body-parser");


//INDEX show all campgrounds
router.get("/", (req, res) => {
	Campground.find({}, (err, allCamps) => {
		if(err) {
			console.log(err);
		} else {
			res.render("campgrounds/campgrounds", {campgrounds: allCamps});
		}		
	});
});

//CREATE create new campground
router.post("/", isLoggedIn, (req, res) => {
	const name = req.body.name;
	const img = req.body.img;
	const author = {
		id: req.user._id,
		username: req.user.username
	};
	const description = req.body.description;
	const newCamp = { name, img, description, author };
	
	Campground.create(newCamp, (err, newCampAdded) => {
		if(err) {
			console.log(err);
		} else {
			res.redirect("/campgrounds");
		}	
	});
});


//NEW show form for creating new campground
router.get("/new", isLoggedIn, (req, res) => {
	res.render("campgrounds/new");
});


//SHOW show details for a campground
router.get("/:id", (req, res) => {
	Campground.findById(req.params.id).populate("comments").exec((err, foundCamp) => {
		if(err) {
			console.log(err);
		} else {
			res.render("campgrounds/detail", {camp: foundCamp});
		}
	});
});


//=============
// MIDDLEWARE
//=============

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login")
}



module.exports = router;
