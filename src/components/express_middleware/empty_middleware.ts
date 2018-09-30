module.exports = function(webserver, controller) {
  webserver.use(function(req, res, next) {
    next();
  });
};
