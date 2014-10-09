var UAParser = require('ua-parser-js');
var parser = new UAParser();

exports.checkDevice = function(req, res) {
  var ua = req.headers['user-agent'];
  var type = parser.setUA(ua).getDevice().type; // tablet, mobile, console
  var model = parser.setUA(ua).getDevice().model; // iPhone, iPad, GT-I905
  var device = parser.setUA(ua).getOS().name; // Android, iOS, Mac OS X, Windows

  if( model === 'iPhone' ) {
    return 'iPhone';
  }

  if( model === 'iPad' ) {
    return 'iPad';
  }

  if ( type === 'tablet' ) {
    if ( device === 'Android' ) {
      return 'Android Tablet';
    }
  }

  if ( type === 'mobile' ) {
    if ( device === 'Android' ) {
      return 'Android Phone';
    }
  }

  if (  device.indexOf('Mac') !== -1 || 
        device.indexOf('Windows') !== -1 ||
        device.indexOf('Ubuntu') !== -1 ||
        device.indexOf('Mint') !== -1 ) 
  {
      return 'Desktop';
  }

  return 'Other';
}