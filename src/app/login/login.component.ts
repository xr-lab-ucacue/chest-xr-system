import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Usuario } from '../interfaces/User';
// import { UserService } from '../../core/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

// De mi HTML>>>>>>>>
typePassword: string = "password"
eyePassword: string = "bi bi-eye-slash"
eyeColor: string = "color: black;"
showPassword(){
  if (this.typePassword === 'password') {
    this.typePassword = 'text'
    this.eyePassword = 'bi bi-eye'
    this.eyeColor = 'color: rgb(115, 154, 225);'
  } else {
    this.typePassword = 'password'
    this.eyePassword = 'bi bi-eye-slash'
    this.eyeColor = 'color: #262626;'

  }
  return
}
// <<<<<<<<<<<<

usuario: Usuario = new Usuario();

constructor(private _route: Router, private authService: AuthService) {}

  login(){
    this.authService.login(this.usuario).subscribe( (resp) => {
      // console.log('Respuesta: ',resp);
      this.usuario.password=btoa(this.usuario.password);
      this.authService.guardarUsuario(resp.access_token);
      this.authService.guardarToken(resp.access_token);
    }, (err) => {
      if (err.status == 401) {
        Swal.fire('Error', 'Usuario no existe!!', 'error');
      }
      if (err.status == 400) {
        Swal.fire('Error Login', 'Usuario o clave incorrectas!', 'error');
      }
      if (err.status == 0) {
        Swal.fire('Servicio', 'No esta Disponible', 'error');
      }
    }, () => {
      Swal.fire('Bienvenido', ':)', 'success');
    })
  }


  /* recuperar_password(event: Event) {
    event.preventDefault();
    if (this.form_recuperar.valid) {
      this.restablece = true;
      this._userService.restablecer_pass(this.form_recuperar.value.email,this.form_recuperar.value.cedula ).subscribe(
        (res) => {
          this.restablece = false;
          $('#exampleModal').modal('hide');
          alert(
            'Contraseña Restablecida Correctamente, revise su Correo Electrónico.'
          );
        },
        (errro) => {
          alert("Datos Incorrectos, Verifique");
          this.restablece = false;
          $('#exampleModal').modal('hide');
        }
      );
    }
  }
 */


  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this._route.navigateByUrl('/modelo1');
    } else {
      this._route.navigateByUrl('#');
    }
  }
}
