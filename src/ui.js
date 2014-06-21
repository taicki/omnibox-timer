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
      $("#timers > tbody").append(
        $("<tr>").append(
          $("<td>").html(timer.text),
          $("<td>").html(moment(timer.currentTime).calendar()),
          $("<td>").html(moment(notificationTime).calendar() + " (" + moment(notificationTime).fromNow() + ")")
        )
      );
    }

    $("#clear").click(function() {
      chrome.storage.local.set({timers: [], idCounter: 0, notificationCounter: 0});
      chrome.extension.getBackgroundPage().window.location.reload();
      window.location.reload();
    });

    $("#stats").text(object.idCounter);

    if (object.soundType == "tts") {
      $("input#tts").attr("checked", true);
    } else {
      $("input#bell").attr("checked", true);
    }

    $("input#tts").change(function() {
      chrome.storage.local.set({soundType: "tts"});
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
  $("#flash").stop(true, true).html("saved!").show().fadeOut(2000);
}
