import { Injectable } from '@angular/core';

import to from 'await-to-js'
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';

const API_URL = environment.api_url;

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor(private http: HttpClient) { }

  async login(credentials: any) {
    return await to(this.http.post(`${API_URL}/auth/login`, credentials).toPromise());
  }

  async signUp(credentials: any) {
    return await to(this.http.post(`${API_URL}/auth/signup`, credentials).toPromise());
  }
}
