var util                      = require('util');
var RequestResponseController = require('castv2-client').RequestResponseController;

function YouTubeRedirectController(client, sourceId, destinationId) {
  RequestResponseController.call(this, client, sourceId, destinationId, 'urn:x-cast:com.blinkbox.cast.youtuberedirect');

  this.currentSession = null;

  this.on('message', onmessage);
  this.once('close', onclose);

  var self = this;

  function onmessage(data, broadcast) {
    console.log('YouTubeRedirectController', 'onmessage', data, broadcast);
  }

  function onclose() {
    self.removeListener('message', onmessage);
    self.stop();
  }

}

util.inherits(YouTubeRedirectController, RequestResponseController);

YouTubeRedirectController.prototype.goTo = function(youTubeAppId, startTime, callback) {
  this.request({ youTubeAppId: youTubeAppId, startTime: startTime }, callback);
};

module.exports = YouTubeRedirectController;