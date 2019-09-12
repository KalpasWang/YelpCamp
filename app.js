const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session"),
	  passport = require("passport"),
	  localStrategy = require("passport-local"),
	  User = require("./models/user.js"),
	  seed = require("./seeds.js"),
	  indexRouter = require("./routes/index"),
	  campgroundRouter = require("./routes/campgrounds"),
	  commentRouter = require("./routes/comments");


mongoose.connect("mongodb+srv://goormIDE:4DS8pMEvjKfQyLbk@cluster0-xmhsz.gcp.mongodb.net/test?retryWrites=true&w=majority", {
	useNewUrlParser: true,
	useCreateIndex: true
}).then(() => {
	console.log("Connected to MongoDB Atlas!");
}).catch(err => {
	console.log("ERROR: ", err.message);
});

//seed(); // seed database
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
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	next();
});


// set routers
app.use(indexRouter);
app.use("/campgrounds", campgroundRouter);
app.use("/campgrounds/:id/comments", commentRouter);




app.listen(3000, () => {
	console.log("The YelpCamp Server start!");
});