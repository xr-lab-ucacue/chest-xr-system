import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from "@angular/common/http";

import { Observable } from "rxjs";
import { take, switchMap } from "rxjs/operators";
import { AuthService } from "src/app/services/auth.service";

//  @Injectable()
// export class TokenInterceptor implements HttpInterceptor {
//   constructor(private authService: AuthService) {}

//   intercept(
//     req: HttpRequest<any>,
//     next: HttpHandler
//   )
//   : Observable<HttpEvent<any>> {
//     return this.authService.token.pipe(
//       take(1),
//       switchMap((token) => {
//         if (token != null) {
//           const authReq = req.clone({
//             headers: req.headers.set("Authorization", "Bearer " + token),
//           });
//           return next.handle(authReq);
//         }
//         return next.handle(req);
//       })
//     );
//   }
//  }
