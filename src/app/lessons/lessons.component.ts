import {Component, OnInit} from '@angular/core';
import {LessonsService} from "../services/lessons.service";
import {Observable} from "rxjs/Observable";
import {Lesson} from "../model/lesson";
import {SwPush} from "@angular/service-worker";
import {NewsletterService} from "../services/newsletter.service";

@Component({
    selector: 'lessons',
    templateUrl: './lessons.component.html',
    styleUrls: ['./lessons.component.css']
})
export class LessonsComponent implements OnInit {

    lessons$: Observable<Lesson[]>;
    isLoggedIn$: Observable<boolean>;

    sub: PushSubscription;

    readonly VAPID_PUBLIC_KEY = "BLnVk1MBGFBW4UxL44fuoM2xxQ4o9CuxocVzKn9UVmnXZEyPCTEFjI4sALMB8qN5ee67yZ6MeQWjd5iyS8lINAg";

    constructor(
        private lessonsService: LessonsService,
        private swPush: SwPush,
        private newsletterService: NewsletterService) {

    }

    ngOnInit() {
        this.loadLessons();
    }


    loadLessons() {
        this.lessons$ = this.lessonsService.loadAllLessons().catch(err => Observable.of([]));
    }

    subscribeToNotifications() {

        // This will popup a window asking the User if they give permission for subscription **********************
        this.swPush.requestSubscription({
                      // The Web API backend has a VAPID Private Key and this is the corresponding public key
                      serverPublicKey: this.VAPID_PUBLIC_KEY
        })
        .then(sub => {
            this.sub = sub;
            console.log("Notification Subscription: ", sub);

            // Sending the subscription object to a Web API backend that will persist it for later
            // sending notification to this user/subscriber
            this.newsletterService.addPushSubscriber(sub).subscribe(
                () => console.log('Sent push subscription object to server.'),
                err =>  console.log('Could not send subscription object to server, reason: ', err)
            );
        })
        .catch(err => console.error("Could not subscribe to notifications", err));

    }


    sendNewsletter() {
        console.log("Sending Newsletter to all Subscribers ...");
        this.newsletterService.send().subscribe();
    }





}
