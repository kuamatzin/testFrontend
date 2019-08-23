import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Task, Query } from './types';
import to from 'await-to-js';

@Injectable({
  providedIn: 'root'
})

export class TaskGraphqlService {


  constructor(private apollo: Apollo) { }

  private _getUserTasks() {
    return new Promise((resolve, reject) => {
      this.apollo.watchQuery<Query>({
        query: gql`
        query getTasks {
          tasks {
            _id
            name
            done
          }
        }
      `
      }).valueChanges.subscribe((data: any) => {
        const deliverData = {}
        deliverData['data'] = data.data.tasks
        resolve(deliverData)
      }, error => {
        reject(error)
      })
    })
  }

  async getUserTasks() {
    return await to(this._getUserTasks())
  }

  private _create({ name, done }) {
    return new Promise((resolve, reject) => {
      this.apollo.mutate({
        mutation: gql`
        mutation store {
          storeTask(name: "${name}", done: ${done}){
            _id,
            name,
            done
          }
        }
        `
      }).subscribe((data: any) => {
        const deliverData = {}
        deliverData['data'] = data.data.storeTask
        resolve(deliverData)
      }, error => {
        reject(error)
      })
    })
  }

  async create({ name }) {
    return await to(this._create({ name: name, done: false }))
  }

  private _update({ _id, name, done }) {
    return new Promise((resolve, reject) => {
      this.apollo.mutate({
        mutation: gql`
        mutation update {
          updateTask(id: "${_id}", name: "${name}", done: ${done}){
            _id,
            name,
            done
          }
        }
        `
      }).subscribe((data: any) => {
        const deliverData = {}
        deliverData['data'] = data.data.updateTask
        resolve(deliverData)
      }, error => {
        reject(error)
      })
    })
  }

  async update(task) {
    return await to(this._update(task))
  }

  private _delete(id) {
    return new Promise((resolve, reject) => {
      this.apollo.mutate({
        mutation: gql`
        mutation delete {
        deleteTask(id: "${id}"){
          _id,
          name,
          done
        }
      }
        `
      }).subscribe((data: any) => {
        const deliverData = {}
        deliverData['data'] = data.data.deleteTask
        resolve(deliverData)
      }, error => {
        reject(error)
      })
    })
  }

  async delete(task_id) {
    return await to(this._delete(task_id))
  }
}
