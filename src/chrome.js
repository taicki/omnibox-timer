chrome.omnibox.onInputEntered.addListener(function(text){
  if (text == "options" || text == "show") {
    openOptionsPage();
  } else {
    tryToSetupTimer(text);
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

chrome.browserAction.onClicked.addListener(function(tab) {
  openOptionsPage();
});

function openOptionsPage() {
  var url = chrome.runtime.getURL("options.html");
  chrome.tabs.query({currentWindow: true}, function(tabs) {
    var targetTab;
    for (var i = 0; i < tabs.length; i++) {
      var tab = tabs[i];
      if (tab.url == url) {
        targetTab = tab;
        break;
      }
    }
    if (targetTab) {
      chrome.tabs.update(targetTab.id, {active: true});
    } else {
      chrome.tabs.create({url: url});
    }
  });
}
