module.exports = function (options = {}) {

    return async (context) => {

        context.app
            .service('push')
            .create({
                notification: context.result._id
            });
        return context;
    };
};