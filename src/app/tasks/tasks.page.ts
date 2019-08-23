import { Component, OnInit } from '@angular/core';
import { TaskService } from '../task.service';
import { AlertController, NavController } from '@ionic/angular';
import { TaskGraphqlService } from '../task-graphql.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
})
export class TasksPage implements OnInit {
  tasks = []
  originalTasks = []
  tab = 1

  constructor(private task: TaskService, private alertController: AlertController, private taskGraphql: TaskGraphqlService, private storage: Storage, private navController: NavController) { }

  async ngOnInit() {
    this.getTasks()
  }

  getRandomAPIMethod() {
    const randomNum = Math.random() * (1 - 0) + 0
    return randomNum > 0.5 ? this.task : this.taskGraphql
  }

  async getTasks() {
    const service = this.getRandomAPIMethod()
    const [error, { data: tasks }] = await <any>this.task.getUserTasks()
    if (error) return console.log(error)
    this.originalTasks = tasks
    this.tasks = tasks
  }

  filterTasks(filterType) {
    this.tab = filterType
    if (filterType == 1) {
      this.tasks = this.originalTasks
      return
    }

    if (filterType == 2) {
      this.tasks = this.originalTasks.filter(task => task.done === false)
      return
    }

    this.tasks = this.originalTasks.filter(task => task.done === true)
  }

  async createNewTask() {
    const alert = await this.alertController.create({
      header: 'Add new task',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'My new task'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Add task',
          handler: data => {
            this.addTask(data)
          }
        }
      ]
    });

    await alert.present();
  }


  async addTask(task) {
    const service = this.getRandomAPIMethod()
    const [error] = await this.taskGraphql.create(task)
    if (error) return console.log(error)
    this.tab = 1
    this.getTasks()
  }

  async toggleStatus(task, slidingItem) {
    const service = this.getRandomAPIMethod()
    slidingItem.close()
    task.done = !task.done
    const [error] = await service.update(task)
    if (error) return task.done = !task.done
    this.filterTasks(this.tab)
  }

  async edit(task, slidingItem) {
    const alert = await this.alertController.create({
      header: 'Edit task',
      inputs: [
        {
          name: 'name',
          type: 'text',
          value: task.name,
          placeholder: 'My new task'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            slidingItem.close()
          }
        }, {
          text: 'Edit task',
          handler: data => {
            slidingItem.close()
            this.updateTaskName(task, data)
          }
        }
      ]
    });

    await alert.present();
  }

  async updateTaskName(task, { name }) {
    const service = this.getRandomAPIMethod()
    task.name = name
    const [error] = await service.update(task)
    if (error) return console.log(error)
  }

  async deleteTask({ _id }) {
    const service = this.getRandomAPIMethod()
    const [error] = await service.delete(_id)
    if (error) return console.log(error)
    const index = this.originalTasks.findIndex(task => task._id === _id)
    this.originalTasks.splice(index, 1)
    this.filterTasks(this.tab)
  }

  async logout() {
    await this.storage.remove('token')

    setTimeout(_ => this.navController.navigateRoot('/home'), 500)
  }
}
