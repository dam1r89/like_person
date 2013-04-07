
if (localStorage.getItem('authToken')){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var tabId = tabs[0].id;
        if (tabs[0].url.match('facebook.com')=== null){
          $('.no-fb-page').show().siblings('div').hide();
          return;
        }
        try{
          chrome.tabs.sendMessage(tabId, {action: "getFbPageData"}, function(response) {
            console.log(response.profileOwner);
            if (typeof response.profileOwner === 'undefined'){
              $('.your-page').show().siblings('div').hide();
              return;
            }
            $('.logged').removeClass('hidden');
            var fromID = response.env.user;
            var toID = response.profileOwner;

            $.post('http://api.dollardoteach.com/person/get-info',{
                  fromID: fromID,
                  toID: toID,
                  authToken: localStorage.getItem('authToken'),
                  sessionID: localStorage.getItem('sessionID')
            }, function(response){
              $('.name').text(response.data.toUserData.name)
              $('.profile-picture').prop('src', "https://graph.facebook.com/" + toID + "/picture?type=normal");
              $('.like-count').text(response.data.socialCounts.likes);
              $('.hate-count').text(response.data.socialCounts.hates);
              $('.button-text').addClass('full-opacity');
              if (response.data.state.like || response.data.state.hate){
                $('.logged').addClass('already-voted');
                if (response.data.state.like){
                  $('.like-button').addClass('disabled').data('disabled', true);
                }
                else{
                  $('.hate-button').addClass('disabled').data('disabled', true);
                }
              }
            });

            $('.logged').on('click', '.buttons', function(){
                var $t = $(this);
                if ($t.data().disabled){
                  return;
                }
                $t.data('disabled', true);
                var url = 'http://api.dollardoteach.com/person/';
                if ($t.hasClass('like-button')){
                  url+='like';
                }
                else{
                  url+='hate';
                }
                $t.find('.big').addClass('grow');
                $.post(url ,{
                  fromID: fromID,
                  toID: toID,
                  authToken: localStorage.getItem('authToken'),
                  sessionID: localStorage.getItem('sessionID')
                },function(response){

                });
                $('.logged').addClass('hidden');
                $('.thank-you').removeClass('hidden');


            });


          });
        }
        catch(e)
        {
          $('.no-fb-page').siblings('div').hide().show();
        }
  });
}
else{
  $('.not-logged').removeClass('hidden');
}
