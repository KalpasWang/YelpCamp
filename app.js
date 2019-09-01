const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session"),
	  passport = require("passport"),
	  localStrategy = require("passport-local"),
	  User = require("./models/user.js"),
	  seed = require("./seeds.js"),
	  Campground = require("./models/campground.js"),
	  Comment = require("./models/comment.js");


mongoose.connect("mongodb+srv://goormIDE:4DS8pMEvjKfQyLbk@cluster0-xmhsz.gcp.mongodb.net/test?retryWrites=true&w=majority", {
	useNewUrlParser: true,
	useCreateIndex: true
}).then(() => {
	console.log("Connected to MongoDB Atlas!");
}).catch(err => {
	console.log("ERROR: ", err.message);
});

//seed();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));


//passport configuration
app.use(session({
	secret: "jknhbgf",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



//=============
// ROUTES
//=============

app.get("/", (req, res) => {
	res.render("landing");
});

//INDEX show all campgrounds
app.get("/campgrounds", (req, res) => {
	Campground.find({}, (err, allCamps) => {
		if(err) {
			console.log(err);
		} else {
			res.render("campgrounds/campgrounds", {campgrounds: allCamps});
		}		
	});
});

//CREATE create new campground
app.post("/campgrounds", (req, res) => {
	const name = req.body.name;
	const img = req.body.img;
	const description = req.body.description;
	const newCamp = {name, img, description};
	
	Campground.create(newCamp, (err, newCampAdded) => {
		if(err) {
			console.log(err);
		} else {
			res.redirect("/campgrounds");
		}	
	});
});


//NEW show form for creating new campground
app.get("/campgrounds/new", (req, res) => {
	res.render("campgrounds/new");
});


//SHOW show details for a campground
app.get("/campgrounds/:id", (req, res) => {
	Campground.findById(req.params.id).populate("comments").exec((err, foundCamp) => {
		if(err) {
			console.log(err);
		} else {
			res.render("campgrounds/detail", {camp: foundCamp});
		}
	});
});


////////////////////////
//COMMENTS ROUTE
///////////////////////


app.get("/campgrounds/:id/comments/new", (req, res) => {
	Campground.findById(req.params.id, (err, foundCamp) => {
		if(err) {
			console.log(err);
		} else {
			res.render("comments/new", {camp: foundCamp});
		}
	});
});

app.post("/campgrounds/:id/comments", (req, res) => {
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



////////////////////////
//AUTH ROUTEs
///////////////////////
app.get("/register", (req, res) => {
	res.render("auth/register");
});

app.post("/register", (req, res) => {
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




app.listen(3000, () => {
	console.log("The YelpCamp Server start!");
});