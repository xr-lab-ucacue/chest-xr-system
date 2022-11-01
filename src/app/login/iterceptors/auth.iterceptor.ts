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
//import { Router } from "@angular/router";


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  isLoading = false;
  imagenurl: string="../../assets/procesando.gif";
  loaderToShow: any;
  constructor(
   // private authService: AuthService,
   // private navigate: NavController,

  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
   // this.present();

    return next.handle(req).pipe(
      map((event: HttpEvent<any>) => {
        //this.dismiss();
        return event;
      })

    );
  }
  public loader: any;
}
