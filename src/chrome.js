// Store history
var history = History()

chrome.omnibox.onInputEntered.addListener(function(text){
  if (text == "options" || text == "show") {
    openOptionsPage();
  } else {
    var result = tryToSetupTimer(text);

    // Store history when a timer is set
    if (result) {
      history.add(text);
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
  var founds = history.findByCount(text);
  for (var i = 0; i < founds.length; i++) {
    var found = founds[i];
    suggestions.push({
      content: found["text"],
      description: found["text"] + " - <dim>Used " + found["count"] + " time(s)</dim>"
    });
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
