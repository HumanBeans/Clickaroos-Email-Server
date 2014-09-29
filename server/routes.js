'use strict';

//####### to be included later when done with the exports file
// var imageRequestHandlers = require('./api/')

// module.exports = function( app ){
//   console.log('hello');
// };

module.exports = function(app){
  // app.use('/clicks', imageRequestHandlers);

  app.route('/').get(function(req, res){
    res.send('hello world');
  });
};
