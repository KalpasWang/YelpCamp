const express = require("express"),
      router = express.Router( {mergeParams: true} ),
	  Campground = require("../models/campground"),
	  Comment = require("../models/comment"),
	  bodyParser = require("body-parser");



//===============
// COMMENTS ROUTE
//===============


router.get("/new", isLoggedIn, (req, res) => {
	Campground.findById(req.params.id, (err, foundCamp) => {
		if(err) {
			console.log(err);
		} else {
			res.render("comments/new", {camp: foundCamp});
		}
	});
});

router.post("/", (req, res) => {
	Campground.findById(req.params.id, (err, foundCamp) => {
		if(err) {
			console.log(err);
		} else {
			const comment = req.body.comment;
			Comment.create(comment, (err, createdComment) => {
				if(err) {
					console.log(err);
				} else {
					foundCamp.comments.push(createdComment);
					foundCamp.save();
					res.redirect("/campgrounds/" + foundCamp._id);
				}
			});
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