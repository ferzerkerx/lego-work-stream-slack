module.exports = (webserver, controller) => {
  webserver.use((req, res, next) => {
    next();
  });
};
