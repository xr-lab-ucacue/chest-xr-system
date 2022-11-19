import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private router: Router, private authService: AuthService) { }

  userNombre: string = "";
  userApellido: string = "";
  userEmail: string = "";

  ngOnInit(): void {
    try{
      let payload = this.authService.obtenerDatosToken(this.authService.tokencito!);
      const lastName = payload.apellido.charAt(0).toUpperCase() + payload.apellido.slice(1)
      const name = payload.nombre.charAt(0).toUpperCase() + payload.nombre.slice(1)
      const email= payload.user_name
      return this.userApellido = lastName, this.userNombre = name, this.userEmail = email
    } catch(e) {
      console.log(e);
    }
  }

  goLogin(){
    this.router.navigateByUrl("/login")
  }
  goRegister(){
    this.router.navigate(["/register"])
  }

  logout(){
    this.userApellido = ""
    this.userNombre = ""
    this.userEmail = ""
    this.authService.logout()
    this.router.navigateByUrl("/login")
  }

}
