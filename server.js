const expres = require("express");
const passport = require("passport");
const bodyParser = require("body-parser");
const Strategy = require("passport-facebook").Strategy;
const path =require("path");

const port = process.env.PORT || 3000;

passport.use(new Strategy({
    clientID:"2681584715460317",
    clientSecret:"9ac66c2023a63d8a3215257890cc5d31",
    callbackURL: "https://localhost:3000/login/facebook/return",
    },
function(accessToken,refreshToken,profile,cb){
    return cb(null,profile)
    }
  )
);                                          

passport.serializeUser(function(user,cb){
     cb(null,user);
});

passport.deserializeUser(function(obj,cb){
    cb(null,obj);
});

//create express app
const app = expres();
// setting view directory

app.set("views",path.join(__dirname , "views"));
app.set("view engine","ejs");

app.use(require('morgan')('combined'));
app.use(require("cookie-parser")());
app.use(require("body-parser").urlencoded({extented: true}));
app.use(require("express-session")({secret:'my app',resave:true, saveUninitialized:true}));

//@route   - GET /
//@desc    - a route to home page
//@access  - PUBLIC 

app.get("/",(req,res) =>{
    res.render("home",{user: req.user})
});

//@route   - GET /login
//@desc    - a route to login page
//@access  - PUBLIC 

app.get("/login",(req,res) =>{
    res.render("login");
});

//@route   - GET /login/facebook
//@desc    - a route to facebook auth  page
//@access  - PUBLIC 

app.get("/login/facebook",
passport.authenticate("facebook"));

//@route   - GET /login/facebook
//@desc    - a route to facebook auth  page
//@access  - PUBLIC 

app.get('/login/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

//@route   - GET /profile
//@desc    - a route to facebook auth  page
//@access  - PRIVATE    

app.get("/profile",require('connect-ensure-login').ensureLoggedIn(),(req,res)=>{
    res.render("profile",{user:req.user});
});


app.listen(port);










