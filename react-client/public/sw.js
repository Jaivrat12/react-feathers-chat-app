const self = this;

let click_open_url;
self.addEventListener('fetch', function (event) {});

self.addEventListener('push', function (event) {

    let push_message = event.data.json();
    console.log(push_message.notification);
    click_open_url = push_message.notification.data.url;
    const options = {
        body: push_message.notification.body,
        icon: push_message.notification.icon,
        image: push_message.notification.image,
        // tag: new Date(),
        // renotify: true,
    };
    event.waitUntil(self.registration.showNotification(push_message.notification.title, options));
});

self.addEventListener('notificationclick', function (event) {

    event.notification.close();
    if (click_open_url) {

        event.waitUntil(self.clients.matchAll({ type: 'window' }).then((clientsArr) => {

            // If a Window tab matching the targeted URL already exists, focus that;
            const hadWindowToFocus = clientsArr.some(
                (windowClient) => windowClient.url === click_open_url
                    ? (windowClient.focus(), true)
                    : false
            );

            // Otherwise, open a new tab to the applicable URL and focus it.
            if (!hadWindowToFocus) {
                self.clients.openWindow(click_open_url)
                    .then((windowClient) => windowClient ? windowClient.focus() : null);
            }
        }));
    }
});