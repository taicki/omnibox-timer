$(function() {
  chrome.storage.local.get({timers: [], idCounter: 0, soundType: "tts"}, function(object) {

    _.each(object.timers, function(timer) {
      notificationTime = timer.currentTime + timer.seconds * 1000;
      $("#timers > tbody:last").append(
        "<tr><td>" + timer.desc + "</td>"
        + "<td>" + moment(timer.currentTime).calendar() + "</td>"
        + "<td>" + moment(notificationTime).calendar() + " (" + moment(notificationTime).fromNow() + ")</td>"
        + "</tr>");
    });

    $("#stats").append("<li># of timers you created: " + object.idCounter + "</li>");

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
  });
});

function showSaveMessage() {
  $("#flash").show();
  $("#flash").html("Saved");
  setTimeout(function() {
    $("#flash").fadeOut("slow");
  }, 1000);
}
