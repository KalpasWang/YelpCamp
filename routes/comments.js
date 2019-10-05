const express = require("express"),
      router = express.Router( {mergeParams: true} ),
	  Campground = require("../models/campground"),
	  Comment = require("../models/comment"),
	  bodyParser = require("body-parser"),
	  middle = require("../middleware/middle");



//===============
// COMMENTS ROUTE
//===============


router.get("/new", middle.isLoggedIn, (req, res) => {
	Campground.findById(req.params.id, (err, foundCamp) => {
		if(err) {
			console.log(err);
		} else {
			res.render("comments/new", {camp: foundCamp});
		}
	});
});

router.post("/", middle.isLoggedIn, (req, res) => {
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

router.get("/:comment_id/edit", middle.checkCommentOwnership, (req, res) => {
	Comment.findById(req.params.comment_id, (err, comment) => {
		if(err) {
			res.redirect("back");
		} else {
			res.render("comments/edit", {campground_id: req.params.id, comment: comment });
		}
	});
});

router.put("/:comment_id", middle.checkCommentOwnership, (req, res) => {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, comment) => {
		if(err) {
			console.log(err);
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

router.delete("/:comment_id", middle.checkCommentOwnership, (req, res) => {
	Comment.findByIdAndRemove(req.params.comment_id, err => {
		if(err) {
			console.log(err);
		} else {
			res.redirect("back");
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

// function checkCommentOwnership(req, res, next) {
// 	if(req.isAuthenticated()) {
// 		Comment.findById(req.params.comment_id, (err, comment) => {
// 			if(err) {
// 				res.redirect("back");
// 			} else {
// 				if(comment.author.id.equals(req.user._id)) {
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


// export comment router
module.exports = router;