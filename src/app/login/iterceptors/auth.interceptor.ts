import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from "@angular/common/http";


import { Observable, throwError } from "rxjs";
//import swal from "sweetalert2";
import { catchError, map } from "rxjs/operators";
import { AuthService } from "src/app/services/auth.service";
//import { Router } from "@angular/router";


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  isLoading = false;
  imagenurl: string="../../assets/procesando.gif";
  loaderToShow: any;
  constructor(
    private authService: AuthService
   // private navigate: NavController,

  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
   // this.present();

    return next.handle(req).pipe(map((event: HttpEvent<any>) => {
      //this.dismiss();
      return event;
    }),
      catchError((e) => {
        if (e.status == 401) {
          //if (this.authService.isAuthenticated()) {
           // this.authService.logout();
            //this.cart_service.VaciarCarritoCompras();
          //}

          //  this.router.navigate(["/"]);
          //this.navigate.navigateBack("login");
        }
        if (e.status == 200) {
        }
        if (e.status == 423) {
          //console.log("fuera de sesion");
          //this.authService.logout();
          //this.navigate.navigateBack("login");
        }
        if (e.status == 500) {
          /*swal.fire(
            "Error en Los Datos",
            `Verifique`  + e.error.mensaje ,
            "warning"
          );*/
          //console.log(e);
        }
        if (e.status == 401) {
          console.log(e);
        }

        if (e.status == 403) {
          alert(e);
          /*swal.fire(
            "Acceso denegado",
            `Hola ${this.authService.usuario.email} no tienes acceso a este recurso!`,
            "warning"
          );*/
          // alert("ERRO 403");
          //this.router.navigate(["/"]);
          //this.navigate.navigateBack("login");
        }
        return throwError(e);
      })
    );
  }
  public loader: any;
  async present() {
    //this.loader = await this.loadingController.create({
     // cssClass: "my-custom-class",
      //message: 'Procesando...',
      //duration: 1000,
    //});
    //await this.loader.present();
  }

  async dismiss() {
    //let topLoader = await this.loadingController.getTop();
    //while (topLoader) {
     // if (!(await topLoader.dismiss())) {
        // throw new Error('Could not dismiss the topmost loader. Aborting...');
      //  break;
      //}
      //topLoader = await this.loadingController.getTop();
    //}
  }

   // );
  //}
 // public loader: any;
}
