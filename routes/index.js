var express   = require("express"),
    router    = express.Router(),
    passport  = require("passport"),
    User      = require("../models/user");

//ROOT ROUTE
router.get("/", function(req, res){
  res.render("landing");
});

//SHOW SIGNUP FORM
router.get("/signup", function(req, res){
  res.render("signup");
});

//HANDLE SIGNUP LOGIC
router.post("/signup", function(req, res){
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user){
    if(err) {
      req.flash("error", err.message);
			return res.redirect("/posts");
    }
    passport.authenticate("local")(req, res, function(){
      req.flash("success", "Welcome! Nice to meet you " + user.username);
      res.redirect("/posts");
    });
  });
});

//SHOW LOGIN FORM
router.get("/login", function(req, res){
  res.render("login");
});

//HANDLE LOGIN LOGIC
router.post("/login", passport.authenticate("local",
  {
    successRedirect: "/posts",
    failureRedirect: "/login"
  }), function(req, res){
});

//LOGOUT ROUTE
router.get("/logout", function(req, res){
  req.logout();
  req.flash("success", "Logged you out!");
  res.redirect("/posts");
});

module.exports = router;