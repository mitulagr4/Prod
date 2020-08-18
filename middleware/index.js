var Post      = require("../models/post"),
    Comment   = require("../models/comment"),

middlewareObj = {
  //CHECK POST OWNER
  checkPostOwnership: function(req, res, next){
    if(req.isAuthenticated()){
      Post.findById(req.params.id, function(err, foundPost){
        if(err) {
          req.flash("error", "Error finding campground");
				  res.redirect("back");
          console.log(err);
        } else {
          if(foundPost.author.id.equals(req.user._id)) {
            next();
          } else {
            req.flash("error", "You don't have permission to do that");
            res.redirect("back");
          }
        }
      });
    } else {
		  req.flash("error", "You need to be logged in to do that");
      res.redirect("back");
    }
  },

  //CHECK COMMENT OWNER
  checkCommentOwnership: function(req, res, next){
    if(req.isAuthenticated()){
      Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err) {
          req.flash("error", "Error finding comment");
				  res.redirect("back");
          console.log(err);
        } else {
          if(foundComment.author.id.equals(req.user._id)) {
            next();
          } else {
            req.flash("error", "You don't have permission to do that");
            res.redirect("back");
          }
        }
      });
    } else {
      req.flash("error", "You need to be logged in to do that");
      res.redirect("back");
    }
  },

  //CHECK LOGIN STATUS
  isLoggedIn: function(req, res, next){
    if(req.isAuthenticated()) {
      return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
  }
};

module.exports = middlewareObj;