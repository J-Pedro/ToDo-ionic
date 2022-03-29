import { Component } from '@angular/core';
import { ActionSheetController, AlertController, LoadingController, ToastController } from '@ionic/angular';
import { TouchSequence } from 'selenium-webdriver';
import { TodoService } from '../services/todo.service';
import { UtilService } from '../services/util.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  tasks : any[] = [];
  selected : any[] = [];
  processando : boolean = false;
  constructor(private alertCtrl: AlertController,
              private utilService: UtilService, 
              private actionCtrl: ActionSheetController,
              private todoService: TodoService,
              private loadCtrl: LoadingController) {

    // let taskJson = localStorage.getItem('taskDb')
    // if (taskJson != null){
    //   this.tasks = JSON.parse(taskJson);
    // }


    this.loadTasks();
   }


 async loadTasks(){
   this.processando = true;
    let loading = await this.loadCtrl.create({message: "Carregando Lista"})
    
    loading.present();
    this.todoService.list()
    .then(async (response: any[]) =>{
      this.tasks = response;
      this.processando = false;
      loading.dismiss();
    })
    .catch(async (erro)=>{
      console.log(erro)
      this.utilService.showToast("Operação falhou");
      this.processando = false;
      loading.dismiss();
    });
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

  async add(newTask: string) {
    if (newTask.trim().length < 1) {
      this.utilService.showToast("Informe o que deseja fazer");
        return;
    }

    let task = {nome : newTask, done: false};
    console.log(task)
    this.tasks.push(task);

    this.utilService.showLoading();
    this.todoService.add(task.nome)
    .then(async (response) =>{
      console.log(response)
      this.utilService.hideLoading();
      this.utilService.showToast("Operação realizada com sucesso");   
      this.loadTasks()
    })

    .catch(async (erro)=>{
      console.log(erro)
      this.utilService.hideLoading();
      this.utilService.showToast("Operação falhou");
    });
    
   // this.updateLocalStorage();
  }

  async remove(task: any){
    //var index = this.tasks.indexOf(value); // Passando o objeto (task) pelo html e pegando o index
    // if (i !== -1) {
    //   this.tasks.splice(i, 1);
    // }

    // Passando o objeto (task) pelo html e filtrando os que não são a mesmas task, criando um novo array e atribuindo ao this.tasks
    // filter() return new Array
    // this.tasks = this.tasks.filter(taskArray =>{
    //   return taskArray != task;
    // });
  
   // this.tasks = this.tasks.filter(taskArray => taskArray != task);

   const alert = await this.alertCtrl.create({
    header: 'Atenção!',
    message: "Tem certeza que deseja excluir?",
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
        text: 'Ok',
        cssClass: 'secondary',
        handler: () => {
          this.todoService.delete(task.id)
          .then(async (response) =>{
           console.log(response)
           this.utilService.showToast("Operação realizada com sucesso");      
           this.loadTasks()
         })
         .catch(async (erro)=>{
           console.log(erro)
           this.utilService.showToast("Operação falhou");
         });
        }
      }
    ]
  });

  await alert.present();

   // this.updateLocalStorage();
  }

  async showEdit(oldTask : any) {
    const alert = await this.alertCtrl.create({
      header: 'Editar',
      inputs: [
        {
          name: 'editNome',
          type: 'text',
          placeholder: 'o que deseja fazer',
          value: oldTask.nome
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
            this.edit(oldTask , form.editNome);
          }
        }
      ]
    });

    await alert.present();
  }

  async edit(oldTask: any,editNome: String) {
    if (editNome.trim().length < 1) {
      this.utilService.showToast("Informe o que deseja fazer");
        return
    }

    var newTasks = this.tasks.filter(task =>{
      if (task == oldTask){
        task.nome = editNome;
        this.todoService.update(task)
        .then(async (response) =>{
          console.log(response)
          this.utilService.showToast("Operação realizada com sucesso!");  
          this.loadTasks()   
        })
        .catch(async (erro)=>{
          console.log(erro)
          this.utilService.showToast("Operação falhou!");  
        });
      }
      return task;
    });
     
    //this.tasks = newTasks;
    //this.updateLocalStorage();
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

            this.todoService.update(task)
            .then(async (response) =>{
              console.log(response)
              this.utilService.showToast("Operação realizada com sucesso!");    
            })
        
            .catch(async (erro)=>{
              console.log(erro)
              this.utilService.showToast("Operação Falhou!");  
            });
           // this.updateLocalStorage();
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
