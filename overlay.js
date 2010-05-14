chrome.extension.sendRequest({method: "settings"}, function(response) {
  var domain = new RegExp( response.data['domain'] );
  if ( window.location.href.search(domain) != -1 ) {
    var comp = response.data['comp'];
    var leftOffset = response.data['leftOffset'];
    var topOffset = response.data['topOffset'];
    $('<div id="ppc_overlay" style="z-index:9999;position:absolute;left:0;top:0;width:100%;height:auto;min-height:100%;background:url('+comp+') no-repeat top center;">').appendTo('body');
    var img = new Image();
    $(img).load(function(){
      iWidth = img.width;
      $('#ppc_overlay').css('height', img.height);
      $('#ppc_overlay').css('width', iWidth);
      bWidth = $('body').width();
      if( iWidth > bWidth )
        $('body').width(iWidth);
    });
    img.src = comp;

    $('#ppc_overlay').css('top',parseInt(topOffset));
    $('#ppc_overlay').css('left',parseInt(leftOffset));
    $('#ppc_overlay').fadeTo('fast',.5);
  }
});

chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");

    switch(request.command)
    {
    case 'up':
      $('#ppc_overlay').css('top',parseInt($('#ppc_overlay').css('top'))-1)
      break;
    case 'down':
      $('#ppc_overlay').css('top',parseInt($('#ppc_overlay').css('top'))+1)
      break;
    case 'left':
      $('#ppc_overlay').css('left',parseInt($('#ppc_overlay').css('left'))-1)
      break;
    case 'right':
      $('#ppc_overlay').css('left',parseInt($('#ppc_overlay').css('left'))+1)
      break;
    case 'lighter':
      $('#ppc_overlay').css('opacity',parseFloat($('#ppc_overlay').css('opacity'))-.1)
      break;
    case 'darker':
      $('#ppc_overlay').css('opacity',parseFloat($('#ppc_overlay').css('opacity'))+.1)
      break;
    case 'top':
      $('#ppc_overlay').css('z-index',10000);
      break;
    case 'bottom':
      $('#wrapper').css('opacity',parseFloat($('#ppc_overlay').css('opacity')));
      $('#ppc_overlay').css('z-index',-999);
      $('#ppc_overlay').css('opacity',1);
      break;
    default:
    }
    sendResponse( {
      'topOffset': parseInt($('#ppc_overlay').css('top')),
      'leftOffset': parseInt($('#ppc_overlay').css('left')),
      'opacity': $('#ppc_overlay').css('opacity')
    });

  });
