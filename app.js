require('dotenv').config();

//REQUIRE STATEMENTS
var express         = require("express"),
    app             = express(),
    bodyParser 	    = require("body-parser"),
    flash           = require("connect-flash"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    User            = require("./models/user"),
    mongoose        = require("mongoose");

var commentRoutes = require("./routes/comments"),
    postsRoutes   = require("./routes/posts"),
    indexRoutes   = require("./routes/index");

//MONGO CONNECT
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@prod.tj5jl.gcp.mongodb.net/prod?retryWrites=true&w=majority`;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

//SETUP
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//PASSPORT CONFIG
app.use(require("express-session")({
  secret: "CHANGE THIS LATER!!!",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//FLASH MIDDLEWARE
app.use(function(req, res, next){
  res.locals.currentUser  = req.user;
  res.locals.error        = req.flash("error");
  res.locals.success      = req.flash("success");
  next();
});

//ROUTES
app.use("/", indexRoutes);
app.use("/posts", postsRoutes);
app.use("/posts/:id/comments", commentRoutes);

//SERVER STARTUP
app.listen(3000, function(){
  console.log("Server running on Port 3000.");
});