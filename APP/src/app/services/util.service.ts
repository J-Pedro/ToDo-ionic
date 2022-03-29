import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  public loading: HTMLIonLoadingElement

  constructor(private toastCtrl : ToastController, private loadCtrl: LoadingController) { }

  async showToast(message : string, duration : number = 2000){
    const toast = await this.toastCtrl.create({
      message: message,
      duration: duration,
      cssClass: 'animated bounceInRight',
      position : 'middle',
      color: 'danger' 
    });
    toast.present();
  }

  async showLoading(message: string = "processando"){
    let loading = await this.loadCtrl.create({message: message})
    this.loading = loading;

    this.loading.present();
  }

  hideLoading(){
    console.log(this.loading);
    if(this.loading != undefined && this.loading != null){
      this.loading.dismiss();
    }
  }

}
