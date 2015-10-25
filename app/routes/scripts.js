'use strict';

module.exports = function(app) {
  var scripts = require('../../app/controllers/scripts');

  app.get('/scripts', scripts.getScripts);
  app.get('/scripts/getupload', scripts.getUpload);
  app.get('/scripts/:id', scripts.getScriptById);
  app.get('/getSample/:id', scripts.getSample);
  app.put('/scripts/favorite/:id', scripts.updateFavorites);
  app.post('/scripts/upload', scripts.uploadScript);
  app.post('/script/add', scripts.addScript);
  app.post('/script/confirm', scripts.confirmScript);

}
