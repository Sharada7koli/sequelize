// user.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface DuplicateCheckResponse {
  isDuplicate: boolean;
  user: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  addUser(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/add-users`, data);
  }

  checkForDuplicate(user: string): Observable<DuplicateCheckResponse> {
    const url = `${this.baseUrl}/checkDuplicate/${user}`;
    return this.http.get<DuplicateCheckResponse>(url);
  }

  deleteUser(user: string): Observable<any> {
    const url = `${this.baseUrl}/delete-users/${user}`;
    return this.http.delete<any>(url);
  }

  updateUser(user: string, data: any): Observable<any> {
    const url = `${this.baseUrl}/update-user/${user}`;
    return this.http.put<any>(url, data);
  }
}
