import client from './feathers';
const appServerKey = 'BBq0lNxTcXa9SlDzccCNuqD6U3KGCnH64WSJ6RdQykpIJ4NSAtqIzzu1N5-1B2wo8rLBu-k7ARmpZocENI2iSBU';
const serviceWorkerFilePath = '/sw.js';

function permissionRequest() {

    return new Promise(function (resolve, reject) {
        const permissionResult = Notification.requestPermission(function (result) {
            resolve(result)
        });

        if (permissionResult) {
            permissionResult.then(resolve, reject);
        }
    })
        .then(function (permissionResult) {
            if (permissionResult !== 'granted') {
                throw new Error('We weren\'t granted permission.')
            }
        });
}

function urlB64ToUint8Array(base64String) {

    // console.log(base64String);
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

function subscribe() {

    // do something for this line
    return navigator.serviceWorker.register(serviceWorkerFilePath)
        .then(function (registration) {
            const subscribeOptions = {
                userVisibleOnly: true,
                applicationServerKey: urlB64ToUint8Array(appServerKey)
            };
            return registration.pushManager.subscribe(subscribeOptions);
        }).then(function (pushSubscription) {
            console.log('Received PushSubscription: ', JSON.stringify(pushSubscription));
            client.service('subscription').create(pushSubscription)
                .then(function (response) {
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                });
            return pushSubscription;
        });
}

function main() {

    navigator.serviceWorker.ready.then(function (reg) {

        reg.pushManager.getSubscription().then(function (subscription) {

            console.log({ subscription });

            client.service('subscription').find({
                query: {
                    endpoint: subscription?.endpoint || ''
                }
            }).then(result => {
                console.log('issubscribed:', result);
                if (result.total === 0) {
                    subscribe();
                }
            }).catch(error => {
                console.log(error);
            })
        }).catch(error => {
            console.log(error);
        })
    }).catch(error => {
        console.log(error);
    })
}

function register() {

    // register service worker
    if ('serviceWorker' in navigator && 'PushManager' in window) {

        window.addEventListener('load', function () {

            navigator.serviceWorker.register(serviceWorkerFilePath);
            permissionRequest();
        });
    }

    main();
}

const serviceWorker = {
    register
};

export default serviceWorker;