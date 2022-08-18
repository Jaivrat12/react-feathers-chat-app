// Initializes the `subscription` service on path `/subscription`
const { Subscription } = require('./subscription.class');
const createModel = require('../../models/subscription.model');
const hooks = require('./subscription.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/subscription', new Subscription(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('subscription');

  service.hooks(hooks);
};
