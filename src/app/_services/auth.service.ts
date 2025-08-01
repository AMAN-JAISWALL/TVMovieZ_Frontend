import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { enviroment } from '../../enviroment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private _httpClient = inject(HttpClient);
  private _apiUrl = enviroment.apiUrl;

  register(data: any): Observable<any> {
    return this._httpClient.post(`${this._apiUrl}/auth/register`, data);
  }
  
  login(data: any): Observable<any> {
    return this._httpClient.post(`${this._apiUrl}/auth/login`, data);
  }

}
