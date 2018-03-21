var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/cat_app");

var catSchema = new mongoose.Schema({
  name : String,
  age : Number,
  temperament: String
});

var Cat = mongoose.model("Cat", catSchema);
//adding a new cat to db
// var george = new Cat({
//   name: "Catty",
//   age: 9,
//   temperament: "Italian"
// });
// george.save(function(err, cat){
//   if(err){
//     console.log("Something went wrong");
//   }else {
//     console.log("We just saved a cat to DB");
//     console.log(cat);
//   }
// });

Cat.create({
  name:"Snow White",
  age: 15,
  temperament: "good"
}, function(err, cat) {
  if (err) {
    console.log(err);
  }else {
    console.log(cat);
  }
});
//retrieve all cats from db console.Log each one
Cat.find({}, function (err, cats) {
  if(err){
    console.log("Oh, ERR!");
    console.log(err);
  }
  else {
    console.log("All the cats");
    console.log(cats);
  }
});
