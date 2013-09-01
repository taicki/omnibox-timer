chrome.omnibox.onInputEntered.addListener(function(text){
  if (text == "options" || text == "show") {
    window.open("options.html");
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
