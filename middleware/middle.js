const Campground = require("../models/campground"),
	  Comment = require("../models/comment"),
	  middle = {};

middle.isLoggedIn = function(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login")
};


middle.checkCommentOwnership = function(req, res, next) {
	if(req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, (err, comment) => {
			if(err) {
				res.redirect("back");
			} else {
				if(comment.author.id.equals(req.user._id)) {
					return next();
				} else {
					res.redirect("back");
				}
			}
		});
	} else {
		res.redirect("back");	
	}
};

middle.checkCampgroundOwnership = function(req, res, next) {
	if(req.isAuthenticated()) {
		Campground.findById(req.params.id, (err, campground) => {
			if(err) {
				res.redirect("back");
			} else {
				if(campground.author.id.equals(req.user._id)) {
					return next();
				} else {
					res.redirect("back");
				}
			}
		});
	} else {
		res.redirect("back");	
	}
};


module.exports = middle;