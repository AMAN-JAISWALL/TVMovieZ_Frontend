import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { enviroment } from '../../../enviroment/enviroment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  private _httpClient = inject(HttpClient);
  private apiUrl = enviroment.apiUrl;

  addMovies(data: any): Observable<any> {
    return this._httpClient.post(`${this.apiUrl}/movies/addMovies`, data);
  }

  getAllMovies(data: any): Observable<any> {
    return this._httpClient.post(`${this.apiUrl}/movies/getAllMovies`, data);
  }

  editMovie(data: any): Observable<any> {
    return this._httpClient.post(`${this.apiUrl}/movies/editMovie`, data);
  }

  deleteMovie(data: any): Observable<any> {
    return this._httpClient.post(`${this.apiUrl}/movies/deleteMovie`, data);
  }
}
