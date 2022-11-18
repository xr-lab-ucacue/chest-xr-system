//import { swal } from 'sweetalert2';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(["/login"]);
      return false;
    }

    let role = next.data["role"] as string;
    if (this.authService.hasRole(role)) {
      return true;
    }

    // swal.fire(
    //   "Acceso denegado",
    //   `Hola ${this.authService.usuario.email}  no tienes acceso a este recurso!`,
    //   "warning"
    // );
    console.log("Acceso denegado")
    this.router.navigate(["/login"]);
    return false;
  }

}
