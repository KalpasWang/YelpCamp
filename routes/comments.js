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
					createdComment.author.id = req.user._id;
					createdComment.author.username = req.user.username;
					createdComment.save();
					foundCamp.comments.push(createdComment);
					foundCamp.save();
					res.redirect("/campgrounds/" + foundCamp._id);
				}
			});
		}
	});
});

router.get("/:comment_id/edit", (req, res) => {
	res.send("EDIT COMMENT PAGE");
});

router.delete("/:comment_id", (req, res) => {
	res.send("DELETE COMMENT PAGE");
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