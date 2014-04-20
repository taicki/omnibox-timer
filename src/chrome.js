// Store history
var histories = [];
var historiesHash = {};

// Compare histories.
// Frequently entered one comes first.
function compareHistories(a, b) {
  if (a["count"] < b["count"]) {
    return 1;
  } else if (a["count"] === b["count"]) {
    return 0;
  } else {
    return -1;
  }
}

chrome.omnibox.onInputEntered.addListener(function(text){
  if (text == "options" || text == "show") {
    openOptionsPage();
  } else {
    var result = tryToSetupTimer(text);

    // Store history when a timer is set
    if (result) {
      text = text.trim()
      if (text in historiesHash) {
        historiesHash[text]["count"] += 1;
      } else {
        var obj = {
          text: text,
          count: 1
        };
        histories.push(obj);
        historiesHash[text] = obj;
      }
      histories.sort(compareHistories);
    }
  }
});

function resetDefaultSuggestion() {
  chrome.omnibox.setDefaultSuggestion({
    description: 'Timer set: &lt;time&gt; [&lt;message&gt;]'
  });
}

chrome.omnibox.onInputStarted.addListener(function() {
  resetDefaultSuggestion();
});

chrome.omnibox.onInputChanged.addListener(function(text, suggest) {
  var suggestions = [];
  var trimmed = text.trim()
  for (var i = 0; i < histories.length; i++) {
    var history = histories[i];
    if (history["text"].indexOf(trimmed) >= 0) {
      suggestions.push({
        content: history["text"],
        description: history["text"] + " - <dim>Used " + history["count"] + " time(s)</dim>"
      });
    }
  }
  suggest(suggestions);
});

chrome.browserAction.onClicked.addListener(function(tab) {
  openOptionsPage();
});

function openOptionsPage() {
  var url = chrome.runtime.getURL("options.html");
  chrome.tabs.query({url: url, currentWindow: true}, function(tabs) {
    if (tabs.length > 0) {
      chrome.tabs.update(tabs[0].id, {active: true});
    } else {
      chrome.tabs.create({url: url});
    }
  });
}
