// Initializes the `push` service on path `/push`
const { Push } = require('./push.class');
const createModel = require('../../models/push.model');
const hooks = require('./push.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/push', new Push(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('push');

  service.hooks(hooks);
};
