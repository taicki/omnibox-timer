// configurations
var audioList = [
  {
    "name": "ring",
    "src": "alarm.wav"
  }
];
var audios = {};

// Reset timers when Chrome starts
resetTimers();

// Load all Audios
loadAudios();

function parseTime(str) {
  var num = parseInt(str);
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
  if (!window.webkitNotifications) {
    return;
  }

  var id = timer.id;
  var ms = timer.seconds * 1000;
  var title = 'Timer done!';

  console.log(id + ": setup " + timer.seconds + " seconds from "
              + timer.currentTime);

  var notification = window.webkitNotifications.createNotification(
    "48.png",
    title,
    timer.desc
  );
  notification.addEventListener('click', function(e) {
    e.target.close();
    console.log(id + ": closed at " + new Date().toString());
  });
  setTimeout(function() {
    notification.show();
    chrome.storage.local.get({soundType: "tts", soundId: "ring"}, function(object) {
      if (object.soundType == "tts") {
        chrome.tts.speak(timer.desc);
      } else {
        audios[object.soundId].play();
      }
    });
    console.log(id + ": notified at " + new Date().toString());
  }, ms);
}

function tryToSetupTimer(text) {
  var arr = text.split(/\s+/);
  var seconds = parseTime(arr.shift());
  if (!seconds) {
    console.log("parse error: " + text);
    return;
  }

  if (arr.length > 0) {
    desc = arr.join(" ");
  } else {
    desc = 'Timer done!';
  }

  var timer = {
    currentTime: (new Date()).getTime(),
    desc: desc,
    seconds: seconds
  };

  setupTimer(timer, function(timer) {
    setupNotification(timer);
    storeTimer(timer);
  });
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

function resetTimers() {
  if (chrome && chrome.storage) {
    chrome.storage.local.set({timers: []});
  }
}

function loadAudios() {
  _.each(audioList, function(item) {
    var audio = new Audio();
    audio.src = item.src;
    audio.load();
    audios[item.name] = audio;
    console.log(audio);
  });
}
