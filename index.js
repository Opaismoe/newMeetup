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

let topicsCounter = {}

mup.stream("/2/rsvps", stream => {
  stream
    .on("data", item => {
      console.log("got item " + item)

      // inside of our stream event handler (!) we retrieve the group topics
      const topicNames = item.group.group_topics.map(topic => topic.topic_name)
      topicNames.forEach(name => {
        if (topicsCounter[name]) {
          topicsCounter[name]++
        }
        else {
          topicsCounter[name] = 1
        }
      })
      console.log(topicsCounter)

    }).on("error", e => {
       console.log("error! " + e)
    });
});
