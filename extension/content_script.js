chrome.runtime.onMessage.addListener(function(request, sender, response){
  if (request.action === 'getFbPageData'){
    var uv = document.createElement('script');
    uv.type = 'text/javascript';
    uv.onload = function(){
      var dataExtension = JSON.parse(document.getElementById('facebook').getAttribute('data-extension'));
      response(dataExtension);
    }
    uv.src = chrome.extension.getURL('injected.js');
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(uv, s);
  }
  return true;
});

