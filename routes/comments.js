var express     = require("express"),
    router      = express.Router({ mergeParams: true }),
    Post        = require("../models/post"),
	  Comment     = require("../models/comment"),
	  middleware 	= require("../middleware");

//CREATE ROUTE
router.post("/", middleware.isLoggedIn, function(req, res){
	Post.findById(req.params.id, function(err, post){
		if(err) {
			console.log(err);
			res.redirect("/posts");
		} else {
			Comment.create(req.body.comment, function(err, comment){
				if(err) {
					req.flash("error", "Something went wrong");
					console.log(err);
				} else {
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					
					post.comments.push(comment);
					post.save();
					
					req.flash("success", "Successfully added comment");
					res.redirect("/posts/" + post._id);
				}
			});
		}
	});
});

//UPDATE ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err) {
			res.redirect("back");
		} else {
			res.redirect("/posts/" + req.params.id);
		}
	});
});

//DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err) {
			res.redirect("back");
		} else {
			req.flash("success", "Comment deleted");
			res.redirect("/posts/" + req.params.id);
		}
	})
});

module.exports = router;