const webpush = require('web-push');

const triggerPushMsg = function (subscription, dataToSend) {

    return webpush
        .sendNotification(subscription, dataToSend)
        .then(response => {
            console.log('msg sent', response);
        })
        .catch((err) => {
            console.log('Subscription is no longer valid: ', err);
        });
};

module.exports = function (options = {}) {

    return async (context) => {

        // get the notification by the notification parameter sent thru our POST
        context.app
            .service('notifications')
            .get(context.data.notification)
            .then(result => result)
            .then(notification => {

                // create the message to send based on our notification from DB
                const dataToSend = {
                    "notification": {
                        "title": notification.title,
                        "body": notification.body,
                        "image": notification.image ? notification.image : context.app.settings.image,
                        "icon": notification.icon || context.app.settings.logo,
                        "data": notification.url ? { "url": notification.url } : ''
                    }
                }

                // recall the vapid keys
                const vapidKeys = {
                    subject: context.app.settings.vapid.subject,
                    publicKey: context.app.settings.vapid.publicKey,
                    privateKey: context.app.settings.vapid.privateKey
                };

                // set our vapid keys
                webpush.setVapidDetails(
                    vapidKeys.subject,
                    vapidKeys.publicKey,
                    vapidKeys.privateKey
                );

                // find all subscribers in our DB
                context.app
                    .service('subscription')
                    .find()
                    .then((result) => {

                        // create a promise
                        let promiseChain = Promise.resolve();
                        // loop thru our subscribers
                        for (let i = 0; i < result.data.length; i++) {

                            const subscription = result.data[i];
                            console.log(`subscription[${i}] =>`, subscription);
                            promiseChain = promiseChain.then(() => {
                                // push our message
                                return triggerPushMsg(subscription, JSON.stringify(dataToSend));
                            });
                        }
                        return promiseChain;
                    });
            });
        return context;
    };
};