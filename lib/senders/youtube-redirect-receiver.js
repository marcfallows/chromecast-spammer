var util        = require('util');
var Application = require('castv2-client').Application;
var YouTubeRedirectController = require('../controllers/youtube-redirect');

function YouTubeRedirectReceiver(client, session) {
  Application.apply(this, arguments);

  var self = this;
  
  this.youTube = this.createController(YouTubeRedirectController);

  function onstatus(status) {
    self.emit('status', status);
  }

}

util.inherits(YouTubeRedirectReceiver, Application);

YouTubeRedirectReceiver.APP_ID = '36246272';

YouTubeRedirectReceiver.prototype.goTo = function() {
  this.youTube.goTo.apply(this.youTube, arguments);
};

module.exports = YouTubeRedirectReceiver;