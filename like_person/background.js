chrome.runtime.onInstalled.addListener(function() {
  chrome.tabs.query({url: '*://*.facebook.com/*'}, function(tabs){
    for(var i in tabs){
      chrome.tabs.reload(tabs[i].id);
    }
  });
  localStorage.clear();
});

var successURL = 'facebook.com/connect/login_success.html';
var deniedURL = 'facebook.com/connect/login_success.html?error_reason=user_denied';
chrome.tabs.onUpdated.addListener(function(){

  if (localStorage.getItem('authToken') == null) {
    chrome.tabs.query({}, function(tabs) { // get all tabs from every window
      for (var i = 0; i < tabs.length; i++) {

        if (tabs[i].url.indexOf(successURL) !== -1) {


          if( tabs[i].url.indexOf(deniedURL) !== -1 )
          {
            chrome.tabs.update(tabs[i].id, {url:chrome.extension.getURL("index.html")});
            return;
          }

          var params = tabs[i].url.split('#')[1];

          if( typeof params !== "undefined" )
          {
            var state = params.split('&')[0];
            state = state.split('=')[1];

            var accessToken = params.split('&')[0];
            accessToken = accessToken.split('=')[1];
            $.post('http://api.dollardoteach.com/auth/facebook',{
              fbAccessToken: accessToken,
              fbApplicationID: "117860031668062"
            },function(response){
              localStorage.setItem('authToken', response.authToken);
              localStorage.setItem('sessionID', response.sessionID);
            });


            chrome.tabs.remove(tabs[i].id);
          }
        }
      }
    });
  }
});
chrome.runtime.onMessage.addListener(function(request, sender, response){
  response({eto: 'ga'});
});



