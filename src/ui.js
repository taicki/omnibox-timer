$(function() {
  chrome.storage.local.get({
    timers: [],
    idCounter: 0,
    soundType: "tts",
    historySuggestionType: "time"
  }, function(object) {
    for (var i = 0; i < object.timers.length; i++) {
      var timer = object.timers[i];
      notificationTime = timer.currentTime + timer.seconds * 1000;
      $("#timers > tbody:last").append(
        "<tr><td>" + timer.desc + "</td>"
        + "<td>" + moment(timer.currentTime).calendar() + "</td>"
        + "<td>" + moment(notificationTime).calendar() + " (" + moment(notificationTime).fromNow() + ")</td>"
        + "</tr>");
    }

    $("#stats").append("<li># of timers you created: " + object.idCounter + "</li>");

    if (object.soundType == "tts") {
      $("input#tts").attr("checked", true);
    } else if(object.soundType == "mute") {
      $("input#mute").attr("checked", true);
    } else {
      $("input#bell").attr("checked", true);
    }

    $("input#tts").change(function() {
      chrome.storage.local.set({soundType: "tts"});
      showSaveMessage();
    });
    $("input#mute").change(function() {
      chrome.storage.local.set({soundType: "mute"});
      showSaveMessage();
    });
    $("input#bell").change(function() {
      chrome.storage.local.set({soundType: "bell"});
      showSaveMessage();
    });

    if (object.historySuggestionType === "time") {
      $("input#time").attr("checked", true);
    } else {
      $("input#count").attr("checked", true);
    }

    $("input#time").change(function() {
      chrome.storage.local.set({historySuggestionType: "time"});
      showSaveMessage();
    });
    $("input#count").change(function() {
      chrome.storage.local.set({historySuggestionType: "count"});
      showSaveMessage();
    });

  });
});

function showSaveMessage() {
  $("#flash").show();
  $("#flash").html("Saved");
  setTimeout(function() {
    $("#flash").fadeOut("slow");
  }, 1000);
}
