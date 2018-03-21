 var express       = require("express"),
        app        = express(),
        bodyParser = require("body-parser"),
        mongoose   = require("mongoose"),
        passport   = require("passport"),
        LocalStrategy = require("passport-local"),
        Campground = require("./models/campground"),
        Comment    = require("./models/comment"),
        User       = require("./models/user"),
        seedDB     = require("./seeds"),
        cookieSession = require("cookie-session")


seedDB();
mongoose.connect("mongodb://localhost/YelpcampDB");
app.use(bodyParser.urlencoded({extended: true}));//Uses the bodyParser package
app.set("view engine", "ejs");
app.use(cookieSession({
  name: 'session',
  keys: ["Once agaim here !"],
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))
app.use(express.static(__dirname + "/public"));// dictorary+

//passport configuration

// app.use(require("express-session")({
//   secret: "Once agaim here !",
//   resave: false,
//   saveUninitialized: false
// }));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  next();
});

//Schema setup
// var campgroundSchema = new mongoose.Schema({
//   name: String,
//   image: String,
//   description: String
// });
//
// var Campground = mongoose.model("Campground",campgroundSchema);
//
// Campground.create(
//   {
//     name: "Nandi Hills",
//     image: "https://www.quirkybyte.com/wp-content/uploads/2016/03/151.jpg",
//     descrition: "This is huge hill in Bangalore. Good place to visit in mornings"
//   }, function(err, campground){
//     if (err) {
//       console.log(err);
//     }else {
//       console.log("Newly created campground");
//       console.log(campground);
//     }
//   }
// );

//Landing page
// var campgrounds = [
//   {name: "Nandi Hills", image:"https://www.quirkybyte.com/wp-content/uploads/2016/03/151.jpg" },
//   {name:"Ooty", im age:"http://media2.intoday.in/indiatoday/images/stories/tamil-nadustory_647_030317044932.jpg"},
//   {name:"Coorg", image:"https://cdn-images-1.medium.com/max/800/1*DHx0VGC1x4IpdyOKZ45krA.jpeg"},
//   {name: "Nandi Hills", image:"https://www.quirkybyte.com/wp-content/uploads/2016/03/151.jpg" },
//   {name:"Ooty", image:"http://media2.intoday.in/indiatoday/images/stories/tamil-nadustory_647_030317044932.jpg"},
//   {name:"Coorg", image:"https://cdn-images-1.medium.com/max/800/1*DHx0VGC1x4IpdyOKZ45krA.jpeg"}
// ];

app.get("/", function(req, res){
  res.render("landing");
});
//======================INDEX==================
//Index- Campground
app.get("/campgrounds", function(req, res) {
  console.log(req.user);
  //get all campgrounds from DB'
  Campground.find({},function(err, allCampgrounds){
    if(err){
      console.log(err);
     }else {
      res.render("index",{campgrounds: allCampgrounds});
    }// still wanna run campground files

  });

//1st campgrounds: Is the page name which is given.
//2nd campgrounds - Data we are passing in it.
});

//post routes with same names here dont get confuse.this is call "convention rest"
//Create a new campground
app.post("/campgrounds", function(req, res){
  // get the data from form and add to campgrounds Page
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;
  var newCampground = {name: name, image: image, description: description}

  //Create a new campground and save to DB
  Campground.create(newCampground, function(err, NewlyCreated) {
    if(err){
      console.log(err);
    }else {
    //redirect back to campgrounds page.
    res.redirect("/campgrounds");
    }
  });
  //campgrounds.push(newCampground);// we are pushing the above obj
});
//New Route - Show form to create new campgrounds
app.get("/campgrounds/new", function(req, res){
  res.render("new");
});
// Shows the template- show the more info about campground
app.get("/campgrounds/:id", function(req, res) {
  //find the campground with provided id.
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
    console.log("Found ID========>",foundCampground);
    if (err) {
      console.log(err);
    }else {
      console.log(foundCampground);
      res.render("show",{campground: foundCampground})
    }
  });
  // req.params.id
  //render show the template  with that campgrounds
  // res.render("show");


// =====================================================
//                     COMMENTS ROUTES
// ====================================================
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res) {
  //Find campground by Id
  Campground.findById(req.params.id, function(err, campground){
    if(err){
    }else {
      console.log(err);
      res.render("comments/new", {campground: campground});
    }
  })
})

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res) {
  //lookup campground using ID
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    }else {
      //comment.create({})
      Comment.create(req.body.comment, function(err, comment) {
        if (err) {
          console.log(err);
        }else {
          campground.comments.push(comment);
          campground.save();
          res.redirect('/campgrounds/'+ campground._id);
        }
      })
    }
  });
  //create new comment
  //coonect new comment to campground
  //redirect to campground show page
});
});
//=================Auth Routes==========

//show register form

app.get("/register", function(req, res){
  res.render("register");
});
// handle sign up logic
app.post("/register", function(req, res) {
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user) {
      if (err) {
        console.log(err);
        return res.render("register");
      }
      passport.authenticate("local")(req, res, function(){
        res.redirect("/campgrounds");
      });
  });
});

//show login form
app.get("/login", function(req, res){
  res.render("Login");
});
//handling login logic
app.post("/login", passport.authenticate("local",
  {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
  }),function(req, res){
});
//logout ROUTES
app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/campgrounds");
});
function isLoggedIn(req, res, next) {
  if(req. isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

//this shows the data which you send to campgrounds
app.listen(5000, function() {
  console.log("Yelpcamp server has started !");
})
