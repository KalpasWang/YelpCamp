const Campground = require("../models/campground"),
	  Comment = require("../models/comment"),
	  Error = require("../messages/error"),
	  middle = {};

middle.isLoggedIn = function(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	req.flash("error", Error.LOGIN_FIRST);
	res.redirect("/login")
};
 


middle.checkCommentOwnership = function(req, res, next) {
	if(req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, (err, comment) => {
			if(err) {
				req.flash("error", Error.COMMENT_NOT_FOUND);
				res.redirect("back");
			} else {
				if(comment.author.id.equals(req.user._id)) {
					return next();
				} else {
					req.flash("error", Error.NO_PERMISSION);
					res.redirect(".");
				}
			}
		});
	} else {
		req.flash("error", Error.LOGIN_FIRST);
		res.redirect("/login");	
	}
};

middle.checkCampgroundOwnership = function(req, res, next) {
	if(req.isAuthenticated()) {
		Campground.findById(req.params.id, (err, campground) => {
			if(err) {
				res.flash("error", Error.CAMPGROUND_NOT_FOUND);
				res.redirect("/campgrounds");
			} else {
				if(campground.author.id.equals(req.user._id)) {
					return next();
				} else {
					req.flash("error", Error.NO_PERMISSION);
					res.redirect(".");
				}
			}
		});
	} else {
		req.flash("error", Error.LOGIN_FIRST);
		res.redirect("/login");	
	}
};


module.exports = middle;