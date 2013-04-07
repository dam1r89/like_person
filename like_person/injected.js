requireLazy(['Env'], function(data){

  function getAllElementsWithAttribute(attribute)
  {
    var matchingElements = [];
    var allElements = document.getElementsByTagName('*');
    for (var i = 0; i < allElements.length; i++)
    {
      if (allElements[i].getAttribute(attribute))
      {
        matchingElements.push(allElements[i]);
      }
    }
    return matchingElements;
  }
  var fbPageData = {};
  var withAttr = getAllElementsWithAttribute('data-gt');
  for(var i in withAttr){
    var object = JSON.parse(withAttr[i].dataset.gt);
      if (object.hasOwnProperty('profile_owner')){
        fbPageData.profileOwner = object.profile_owner;
      }
  }
  fbPageData.env = data;
  document.getElementById('facebook').setAttribute('data-extension', JSON.stringify(fbPageData));
});

