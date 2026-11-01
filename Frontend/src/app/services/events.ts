import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { Destinations } from '../models/destinations';
import { environment } from '../../environments/environment';
import { EventsDTO } from '../models/events';

@Service()
export class Events {
    http = inject(HttpClient);
    private apiUrl = `${environment.SERVICE_API_URL}`;

    GetAllDestinationsForUser(): Observable<{destinationList:Destinations[]}> {
        let url = `${this.apiUrl}/destinations/getall`;
        return this.http.get<{destinationList:Destinations[]}>(url)

    }

    GetAllEvents():Observable<EventsDTO>{
          let url = `${this.apiUrl}/events/getall`;
        return this.http.get<EventsDTO>(url)
    }

}
