import { Component } from '@angular/core';
import { ActionSheetController, AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  tasks : any[] = [];
  selected : any[] = [];
  constructor(private alertCtrl: AlertController, private toastCtrl: ToastController, private actionCtrl: ActionSheetController) {
    let taskJson = localStorage.getItem('taskDb')
    if (taskJson != null){
      this.tasks = JSON.parse(taskJson);
    }
   }

  updateLocalStorage(){
    localStorage.setItem('taskDb', JSON.stringify(this.tasks))
  }

  async showAdd() {
    const alert = await this.alertCtrl.create({
      header: 'O que deseja fazer?',
      inputs: [
        {
          name: 'newTask',
          type: 'text',
          placeholder: 'o que deseja fazer'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log("cancelar")
          }
        },
        {
          text: 'Adicionar',
          role: 'add',
          cssClass: 'secondary',
          handler: (form) => {
            this.add(form.newTask);
          }
        }
      ]
    });

    await alert.present();
  }

  async add(newTask: String) {
    if (newTask.trim().length < 1) {
        const toast = await this.toastCtrl.create({
          message: "Informe o que deseja fazer!",
          duration: 2000,
          position : 'top',
          color: 'danger' 
        });
        toast.present();
        return
    }

    let task = {name : newTask, done: false};
    console.log(task)
    this.tasks.push(task);
    this.updateLocalStorage();
  }

  remove(task: any){
    //var index = this.tasks.indexOf(value); // Passando o objeto (task) pelo html e pegando o index
    // if (i !== -1) {
    //   this.tasks.splice(i, 1);
    // }

    // Passando o objeto (task) pelo html e filtrando os que não são a mesmas task, criando um novo array e atribuindo ao this.tasks
    // filter() return new Array
    // this.tasks = this.tasks.filter(taskArray =>{
    //   return taskArray != task;
    // });
  
    this.tasks = this.tasks.filter(taskArray => taskArray != task);

    this.updateLocalStorage();
  }

  async showEdit(value : any) {
    const alert = await this.alertCtrl.create({
      header: 'Editar',
      inputs: [
        {
          name: 'editTask',
          type: 'text',
          placeholder: 'o que deseja fazer',
          value: value.name
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log("cancelar")
          }
        },
        {
          text: 'Editar',
          role: 'add',
          cssClass: 'secondary',
          handler: (form) => {
            this.edit(value , form.editTask);
          }
        }
      ]
    });

    await alert.present();
  }

  async edit(oldTask: any,editTask: String) {
    if (editTask.trim().length < 1) {
        const toast = await this.toastCtrl.create({
          message: "Informe o que deseja fazer!",
          duration: 2000,
          position : 'top',
          color: 'danger' 
        });
        toast.present();
        return
    }

    var newFilter = this.tasks.filter(task =>{
      if (task == oldTask){
        task.name = editTask;
      }
      return task;
    });
     
    this.tasks = newFilter;
    this.updateLocalStorage();
  }

  // atualizaCheck(value :any){
  //    if (value.done == true){
  //     value.done = false
  //     console.log(value.done)
  //   }else{
  //     value.done = true
  //     console.log(value.done)
  //   } 
  //   this.updateLocalStorage();
  // }

  async openActions(task){
      const actionSheet = await this.actionCtrl.create({
        header: 'O que deseja fazer?',
        buttons: [{
          text: task.done ? 'Desmarcar' : 'Marcar',
          icon: task.done ? 'radio-button-off' : 'checkmark-circle',
          handler: () => {
            task.done = !task.done;
            this.updateLocalStorage();
          }
        }, {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }]
      });
      await actionSheet.present();
  
      const { role, data } = await actionSheet.onDidDismiss();
      console.log('onDidDismiss resolved with role and data', role, data);
    }
}
