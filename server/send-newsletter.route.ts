import {USER_SUBSCRIPTIONS} from "./in-memory-db";

const webpush = require('web-push');


export function sendNewsletter(req, res) {

    console.log('Total subscriptions', USER_SUBSCRIPTIONS.length);

  // sample notification payload.
  // This payload will be sent to the Browser Push Service (eg FCM ) and it will forward the message to the 
  // browser instance which will then forward it to the Service Worker and the Service Worker (the Angular one) 
  // expects the payload to be in this format ...
    const notificationPayload = {
        "notification": {
            "title": "Angular News",
            "body": "Newsletter Available!",
            "icon": "assets/main-page-logo-small-hat.png",
            "vibrate": [100, 50, 100],
            "data": {
                "dateOfArrival": Date.now(),
                "primaryKey": 1
            },
            "actions": [{
                "action": "explore",
                "title": "Go to the site"
            }]
        }
    };

    // webpush.sendNotification() returns a Promise ...
    // Inside the subscription object, sub, is the Endpoint address at which the Browser Push Service is listening
    // In case the user was on a chorme browser when he consented to receive the notifications then, this Endpoint address
    // will point to the Google FCM and.... 
    Promise.all(USER_SUBSCRIPTIONS.map(sub => webpush.sendNotification( sub, JSON.stringify(notificationPayload) )))
    .then(() => res.status(200).json({message: 'Newsletter sent successfully.'}))  // all promises resolved
    .catch(err => {
          console.error("Error sending notification, reason: ", err);
          res.sendStatus(500);
          });






}

