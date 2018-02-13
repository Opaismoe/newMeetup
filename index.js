var app = require('express')()
var server = require('http').Server(app)
var io = require('socket.io')(server)

let topicsCounter = {}
var Meetup = require("meetup")
var mup = new Meetup()

server.listen(3002)

io.on('connection', socket => {
  console.log('got connection')

});

mup.stream("/2/rsvps", stream => {
  stream
  .on("data", item => {
    const topicNames = item.group.group_topics.map(topic => topic.topic_name)
    if (topicNames.indexOf('Web Development') < 0) {
      return
    }
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
    io.emit("action", {
      type: 'ADD_RSVP',
      payload: item
    })
    io.emit("action", {
      type: "UPDATE_TOPICS",
      payload: topTen
    })

  }).on("error", e => {
    console.log("error! " + e)
  });
});

mup.stream("/2/rsvps", stream => {
  stream
    .on("data", item => {
    }).on("error", e => {
       console.log("error! " + e)
    });
});
