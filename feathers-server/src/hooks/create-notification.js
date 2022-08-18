module.exports = function (options = {}) {

    return async (context) => {

        const msg = context.result;
        if (msg.text && msg.data) {

            const notification = {
                title: msg.data.user.email,
                body: msg.text,
                icon: msg.data.user.avatar,
                url: 'http://localhost:3000/'
            };

            context.app
                .service('notifications')
                .create(notification);
        }
        return context;
    };
};