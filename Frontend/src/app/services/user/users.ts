import { Service, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { APIGeneratedDTO, CreateUserInput, LoginDTO, UserCreatedDTO, UserDTO, UserLogin } from '../../models/users';
import { Observable, ObservableLike } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';

@Service()
export class Users {
    private apiUrl = `${environment.SERVICE_API_URL}/user`;

    http = inject(HttpClient);

    RegisterAccount(submitBody: CreateUserInput): Observable<UserCreatedDTO> {
        const url = `${this.apiUrl}/register`;

        return this.http.post<UserCreatedDTO>(url,
            submitBody
        )
    }

    LoginAccount(submitBody: UserLogin): Observable<LoginDTO> {
        const url = `${this.apiUrl}/login`;

        return this.http.post<LoginDTO>(url,
            submitBody
        )
    }

    private currentUserSignal = signal<UserDTO | null>(
        this.loadUser()
    );

    currentUser = this.currentUserSignal.asReadonly();

    private loadUser(): UserDTO | null {
        const storedUser = sessionStorage.getItem('currentUser');

        if (!storedUser) return null;

        try {
            return JSON.parse(storedUser) as UserDTO;
        } catch {
            sessionStorage.removeItem('currentUser');
            return null;
        }
    }

    setCurrentUser(user: UserDTO): void {
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSignal.set(user);
    }

    getCurrentUser(): UserDTO | null {
        return this.currentUserSignal();
    }

    clearCurrentUser(): void {
        sessionStorage.removeItem('currentUser');
        sessionStorage.removeItem('accesstoken');
        this.currentUserSignal.set(null);
    }

    GenerateAPIKey(name: string): Observable<APIGeneratedDTO> {
        let url = `${this.apiUrl}/generatekey`;

        return this.http.post<APIGeneratedDTO>(
            url, { name: name }
        )
    }
}
