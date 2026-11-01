import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { Destinations } from '../models/destinations';
import { environment } from '../../environments/environment';

@Service()
export class Events {
    http = inject(HttpClient);
    private apiUrl = `${environment.SERVICE_API_URL}`;

    GetAllDestinationsForUser(): Observable<{destinationList:Destinations[]}> {
        let url = `${this.apiUrl}/destinations/getall`;

        const token = sessionStorage.getItem("accesstoken");
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });
        return this.http.get<{destinationList:Destinations[]}>(url, { headers })

    }

}
