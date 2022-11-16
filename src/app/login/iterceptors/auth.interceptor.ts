import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from "@angular/common/http";

import { Observable, throwError } from "rxjs";
import swal from "sweetalert2";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((e) => {
        if (e.status == 401) {
          //this.authService.loginAutomatico();
          console.log(e);
         // alert("ERRO 401");
          if (this.authService.isAuthenticated()) {
            this.authService.logout();
          //  localStorage.removeItem('tipo_productos');
            localStorage.clear();
          }
          this.router.navigate(["/"]);
        }
        if(e.status == 200){
          this.router.navigate(["/radiology"]);
        }
        if(e.status == 423){
         // alert("");

          this.authService.logout();

        }
        if(e.status == 500){
          swal.fire(
            "Información, Error",
            'Estamos trabajando en ello ' ,
            "warning"
          );
          //console.log(e);


        }

        if (e.status == 403) {
          swal.fire(
            "Acceso denegado",
            `Hola ${this.authService.usuario.email} no tienes acceso a este recurso!`,
            "warning"
          );
         // alert("ERRO 403");
          this.router.navigate(["/"]);
        }
        return throwError(e);
      })
    );
  }
}
