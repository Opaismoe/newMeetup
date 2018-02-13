var Meetup = require("meetup")
var mup = new Meetup()

mup.stream("/2/rsvps", stream => {
  stream
    .on("data", item => {
    }).on("error", e => {
       console.log("error! " + e)
    });
});

let topicsCounter = {}

mup.stream("/2/rsvps", stream => {
  stream
    .on("data", item => {
      const topicNames = item.group.group_topics.map(topic => topic.topic_name)
      topicNames.forEach(name => {
        if (topicsCounter[name]) {
          topicsCounter[name]++
        }
        else {
          topicsCounter[name] = 1
        }
      })
      const arrayOfTopics = Object.keys(topicsCounter)

      arrayOfTopics.sort((topicA, topicB) => {
        if (topicsCounter[topicA] > topicsCounter[topicB]) {
          return -1
        }
        else if (topicsCounter[topicB] > topicsCounter[topicA]) {
          return 1
        }
        else {
          return 0
        }
      })
      const topTen = arrayOfTopics.slice(0,10).map((topic) => {
        return {
          topic: topic,
          count: topicsCounter[topic]
        }
      })
      console.log(topTen)

    }).on("error", e => {
       console.log("error! " + e)
    });
});
