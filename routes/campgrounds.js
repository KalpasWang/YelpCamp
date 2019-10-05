const express = require("express"),
      router = express.Router(),
	  Campground = require("../models/campground"),
	  bodyParser = require("body-parser"),
	  middle = require("../middleware/middle");


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
router.post("/", middle.isLoggedIn, (req, res) => {
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
router.get("/new", middle.isLoggedIn, (req, res) => {
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

//EDIT show edit campgrounds form
router.get("/:id/edit", middle.checkCampgroundOwnership, (req, res) => {
	Campground.findById(req.params.id, (err, campground) => {
		if(err) {
			console.log(err);
		} else {
			res.render("campgrounds/edit", {camp: campground});
		}
	});
});

//UPDATE update campground with id
router.put("/:id", middle.checkCampgroundOwnership, (req, res) => {
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, campground) => {
		if(err) {
			console.log(err);
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

router.delete("/:id", middle.checkCampgroundOwnership, (req, res) => {
	Campground.findByIdAndRemove(req.params.id, (err) =>{
		if(err) {
			res.redirect("back");
		} else {
			res.redirect("/campgrounds");	
		}
	});
});

//=============
// MIDDLEWARE
//=============

// function isLoggedIn(req, res, next) {
// 	if(req.isAuthenticated()) {
// 		return next();
// 	}
// 	res.redirect("/login")
// }

// function checkCampgroundOwnership(req, res, next) {
// 	if(req.isAuthenticated()) {
// 		Campground.findById(req.params.id, (err, campground) => {
// 			if(err) {
// 				res.redirect("back");
// 			} else {
// 				if(campground.author.id.equals(req.user._id)) {
// 					return next();
// 				} else {
// 					res.redirect("back");
// 				}
// 			}
// 		});
// 	} else {
// 		res.redirect("back");	
// 	}
// }



module.exports = router;
