$(function() {
  chrome.storage.local.get({timers: [], idCounter: 0}, function(object) {

    _.each(object.timers, function(timer) {
      notificationTime = timer.currentTime + timer.seconds * 1000;
      $("#timers > tbody:last").append(
        "<tr><td>" + timer.desc + "</td>"
        + "<td>" + moment(timer.currentTime).calendar() + "</td>"
        + "<td>" + moment(notificationTime).calendar() + " (" + moment(notificationTime).fromNow() + ")</td>"
        + "</tr>");
    });

    $("#stats").append("<li># of timers you created: " + object.idCounter + "</li>");
  });
});

