var nid = 0;

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

  nid += 1;
  var id = nid;
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
    chrome.tts.speak(timer.desc);
    console.log(id + ": notified at " + new Date().toString());
  }, ms);
}

function tryToSetTimer(text) {
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

  setupNotification(timer);
}
