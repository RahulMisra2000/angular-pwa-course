

import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";



@Injectable()
export class NewsletterService {

    constructor(private http: HttpClient) { }

    // *** Just sending the subscription object to a Web API Backend so that it can be persisted for later use.
    //     Later another Web API call can be made that will send message with the subscription object to a Push Notification Service
    //     like Google Firebase Cloud Messaging (for Chrome)
    addPushSubscriber(sub:any) {
        return this.http.post('/api/notifications', sub);
    }

    send() {
        return this.http.post('/api/newsletter', null);
    }

}


