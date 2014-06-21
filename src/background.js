// configurations
var audioList = [
  {
    "name": "ring",
    "src": "alarm.wav"
  }
];
var audios = {};

// Show timer count
showActiveTimerCount();

// Load all Audios
loadAudios();

function parseTime(str) {
  var num = parseFloat(str);
  if (isNaN(num))
    return null;
  var last = str.charAt(str.length - 1);
  var mul;
  switch (last) {
  case 'h': mul = 60 * 60; break;
  case 'm': mul = 60; break;
  case 's': mul = 1; break;
  default: mul = 60; break;
  }
  return num * mul;
}

function setupNotification(timer) {
  if (!window.Notification) {
    return;
  }

  var id = timer.id;
  var ms = timer.seconds * 1000;
  var title = 'Timer done!';

  console.log(id + ": setup " + timer.seconds + " seconds from "
              + timer.currentTime);

  setTimeout(function() {
    var notification = new window.Notification(title, {
      tag: id,
      icon: "48.png",
      body: timer.desc
    });
    notification.addEventListener('click', function(e) {
      if (e && e.target && e.target.close) {
        e.target.close();
      }
      console.log(id + ": closed at " + new Date().toString());
    });
    chrome.storage.local.get({soundType: "tts", soundId: "ring", notificationCounter: 0}, function(object) {
      if (object.soundType == "tts") {
        chrome.tts.speak(timer.desc);
      } else {
        audios[object.soundId].play();
      }
      chrome.storage.local.set({notificationCounter: object.notificationCounter+1});
      showActiveTimerCount();
    });
    console.log(id + ": notified at " + new Date().toString());
  }, ms);
}

function tryToSetupTimer(text) {
  var arr = text.split(/\s+/);
  var seconds = parseTime(arr.shift());
  if (!seconds) {
    console.log("parse error: " + text);
    window.alert([
      'Your input could not be processed as given: "tm ' + text + '".',
      'Please specify "tm <time>" or "tm <time> <message>".',
      'For example: "tm 10", "tm 10 Lunch", or "tm 2h Meeting".',
    ].join("\n\n"));
    return false;
  }

  if (arr.length > 0) {
    desc = arr.join(" ");
  } else {
    desc = 'Timer done!';
  }

  var timer = {
    currentTime: (new Date()).getTime(),
    text: text,
    desc: desc,
    seconds: seconds
  };

  setupTimer(timer, function(timer) {
    setupNotification(timer);
    storeTimer(timer);
    showActiveTimerCount();
  });

  return true;
}

function setupTimer(timer, callback) {
  chrome.storage.local.get({idCounter: 0}, function(object) {
    var id = object.idCounter;
    timer.id = id;
    chrome.storage.local.set({idCounter: id+1});

    callback(timer);
  });
}

function storeTimer(timer) {
  chrome.storage.local.get({timers: []}, function(object) {
    timers = object.timers;
    timers.unshift(timer);
    chrome.storage.local.set({timers: timers});
  });
}

function loadAudios() {
  for (var i = 0; i < audioList.length; i++) {
    var item = audioList[i];
    var audio = new Audio();
    audio.src = item.src;
    audio.load();
    audios[item.name] = audio;
    console.log(audio);
  }
}

function showActiveTimerCount() {
  chrome.storage.local.get({idCounter: 0, notificationCounter: 0}, function(object) {
    var count = object.idCounter - object.notificationCounter;
    chrome.browserAction.setBadgeText({text: count > 0 ? String(count) : ""});
  });
}

function History() {
  // Store history
  var sortedByTime = [];
  var sortedByCount = [];
  var historiesHash = {};

  // Compare histories.
  // Frequently entered one comes later.
  function compareByCount(a, b) {
    if (a["count"] < b["count"]) {
      return -1;
    } else if (a["count"] === b["count"]) {
      return 0;
    } else {
      return 1;
    }
  }

  function findHistories(histories, text) {
    var text = text.trim();
    var founds = [];
    for (var i = histories.length - 1; i >= 0; i--) {
      var history = histories[i];
      if (history["text"].indexOf(text) >= 0) {
        // copy
        founds.push({
          text: history["text"],
          count: history["count"],
          timestamp: history["timestamp"]
        });
      }
    }
    return founds;
  }

  return {
    add: function(text) {
      text = text.trim()
      if (text in historiesHash) {
        var history = historiesHash[text];

        history["count"] += 1;
        history["timestamp"] = new Date().getTime();

        // sort by time: the latest one goes to the end.
        var idx = sortedByTime.indexOf(history);
        sortedByTime.splice(idx, 1);
        sortedByTime.push(history);
      } else {
        var obj = {
          text: text,
          count: 1,
          timestamp: new Date().getTime()
        };
        sortedByCount.push(obj);
        sortedByTime.push(obj);
        historiesHash[text] = obj;
      }

      // sort by count: frequently input one goes to the end.
      sortedByCount.sort(compareByCount);
    },
    findByCount: function(text) {
      return findHistories(sortedByCount, text);
    },
    findByTime: function(text) {
      return findHistories(sortedByTime, text);
    }
  }
}
