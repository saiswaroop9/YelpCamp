var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var data = [
    {
      name: "Nandhi Hills ",
      image: "https://www.quirkybyte.com/wp-content/uploads/2016/03/151.jpg",
      description: "Nandi Hills, or Nandidurg, is a hill fortress in the south Indian state of Karnataka. Tipu Sultan Fort, a summer retreat of the namesake 18th-century ruler, features stone carvings and wall paintings. Prisoners are said to have been thrown to their death from Tipu’s Drop, now known for its panoramic views. Local Hindu temples include the hilltop Yoga Nandeeshwara Temple, guarded by a huge statue of a bull (nandi)"
    },
    {
      name: "Ooty",
      image: "http://media2.intoday.in/indiatoday/images/stories/tamil-nadustory_647_030317044932.jpg",
      description: "Nandi Hills, or Nandidurg, is a hill fortress in the south Indian state of Karnataka. Tipu Sultan Fort, a summer retreat of the namesake 18th-century ruler, features stone carvings and wall paintings. Prisoners are said to have been thrown to their death from Tipu’s Drop, now known for its panoramic views. Local Hindu temples include the hilltop Yoga Nandeeshwara Temple, guarded by a huge statue of a bull (nandi)"
    },
    {
      name: "Coorg",
      image: "https://cdn-images-1.medium.com/max/800/1*DHx0VGC1x4IpdyOKZ45krA.jpeg",
      description: "Nandi Hills, or Nandidurg, is a hill fortress in the south Indian state of Karnataka. Tipu Sultan Fort, a summer retreat of the namesake 18th-century ruler, features stone carvings and wall paintings. Prisoners are said to have been thrown to their death from Tipu’s Drop, now known for its panoramic views. Local Hindu temples include the hilltop Yoga Nandeeshwara Temple, guarded by a huge statue of a bull (nandi)"
    }
]

function seedDB() {
//Remove all campgrounds
Campground.remove({}, function(err) {
  if (err) {
    console.log(err);
  }
  console.log("Wispe Off");

  data.forEach(function(seed){
    Campground.create(seed, function(err, campground) {
      if (err) {
        console.log(err);
      }else {
        console.log("added a campground");
        //create a comments
        Comment.create(
          {
            text: "This place is great, but I wish there was free internet",
            author: "Aaapun ich"
          },function(err, comment) {
            if (err) {
              console.log(err);
            }else {
              campground.comments.push(comment);
              campground.save(function (err,doc) {
                if(!err){
                  console.log("no error in save")
                }else{
                  console.log(err)
                }
              });


            }
          });
      }
    });
  });
});
//adding up campgrounds

//adding comments
}
module.exports = seedDB;
