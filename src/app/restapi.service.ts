import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class RestAPIService {
  constructor(private httpClient: HttpClient) {};

  getPosts(): Observable<any[]> {
    return this.httpClient.get<any[]>('https://jsonplaceholder.typicode.com/posts/');
  };
};
