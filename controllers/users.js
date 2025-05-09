const User= require("../models/user.js")
const passport = require("passport");

module.exports.renderSignupForm=(req, res) => {
    res.render("users/signup.ejs");
  }

  module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs")
}

module.exports.signUp=async (req,res,next)=>{
    try{
    let {username,email,password}=req.body
    let newUser=new User({username,email})
  const registeredUser= await User.register(newUser,password) 
  req.login(registeredUser, (err)=>{
    if(err){
        return next(err)
    }
    req.flash("success", "Welcome to Homify!")
    res.redirect("/listings")
  })}
  catch(e){
    req.flash("error",e.message)
    res.redirect("/signup")
}}


module.exports.login=async (req, res) => {
    req.flash("success", "Welcome back to Homify!");
    let redirectUrl = res.locals.redirectUrl || "/listings" 
    res.redirect(redirectUrl ); 
}

module.exports.logout=(req, res,next) => {
    req.logout((err) => {
        if (err) {
        return next(err);
        }
        req.flash("success", "Goodbye! You have logged out successfully.");
        res.redirect("/listings");
    });
}