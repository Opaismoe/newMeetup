var Meetup = require("meetup")
var mup = new Meetup()

mup.stream("/2/rsvps", stream => {
  stream
    .on("data", item => {
      console.log("got item " + item)
    }).on("error", e => {
       console.log("error! " + e)
    });
});   
