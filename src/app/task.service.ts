import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import to from 'await-to-js'
import { Storage } from '@ionic/storage';

const API_URL = environment.api_url;

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient, private storage: Storage) { }

  async getToken() {
    const [error, token] = await to(this.storage.get('token'))
    if (error) console.log(error)

    return new HttpHeaders().set('Authorization', `Bearer ${token}`)
  }

  async getUserTasks() {
    const headers: any = await this.getToken()

    return await to(this.http.get(`${API_URL}/tasks`, { headers: headers }).toPromise())
  }

  async create({ name }) {
    const headers: any = await this.getToken()

    return await to(this.http.post(`${API_URL}/tasks`, { name: name, done: false }, { headers: headers }).toPromise())
  }

  async update(task) {
    const headers: any = await this.getToken()

    return await to(this.http.put(`${API_URL}/tasks/${task._id}`, task, { headers: headers }).toPromise())
  }

  async delete(task_id) {
    const headers: any = await this.getToken()

    return await to(this.http.delete(`${API_URL}/tasks/${task_id}`, { headers: headers }).toPromise())
  }
}
