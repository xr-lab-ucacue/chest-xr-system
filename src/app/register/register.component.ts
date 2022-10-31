import { Usuario } from './../interfaces/User';
import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../services/usuario.service';
import { empty } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private serviceUsuario: UsuarioService) { }

  section: number = 1;
  progressBar: string = "width: 8%;"
  btnProgress1: string = "position-absolute top-0 start-0 translate-middle btn btn-sm btn-secondary rounded-pill"
  btnProgress2: string = "position-absolute top-0 start-50 translate-middle btn btn-sm btn-secondary rounded-pill"
  btnProgress3: string = "position-absolute top-0 start-100 translate-middle btn btn-sm btn-secondary rounded-pill"

  usuario: Usuario = new Usuario();
  usuarioSave: Usuario[] = [];

  progress1(){
    this.btnProgress1 = 'position-absolute top-0 start-0 translate-middle btn btn-sm btn-secondary rounded-pill'
    this.btnProgress2 = 'position-absolute top-0 start-50 translate-middle btn btn-sm btn-secondary rounded-pill'
    this.section = 1; 
    this.progressBar = 'width: 8%;'
    return
  }
  progress2(){
    if (this.usuario.nombre === undefined || this.usuario.apellido === undefined) {
      alert('Rellena primero este form')
      console.log("IF--nombre: ", this.usuario.nombre);
      console.log("IF--apellido: ", this.usuario.apellido);
    } else if(this.usuario.nombre.length === 0 || this.usuario.apellido.length === 0 || this.usuario.nombre.trim().length === 0 || this.usuario.apellido.trim().length === 0) {
      alert('Rellena primero este form')
      console.log("Else-IF--nombre: ", this.usuario.nombre);
      console.log("Else-IF--apellido: ", this.usuario.apellido);
    } else {
      console.log("nombre: ", this.usuario.nombre);
      console.log("apellido: ", this.usuario.apellido);
      this.btnProgress1 = 'position-absolute top-0 start-0 translate-middle btn btn-sm btn-success rounded-pill'
      this.btnProgress2 = 'position-absolute top-0 start-50 translate-middle btn btn-sm btn-secondary rounded-pill'
      this.section = 2;
      this.progressBar = 'width: 50%;'
    }
    return
  }
  progress3(){
    if (this.usuario.cedula === undefined && this.usuario.direccion === undefined && this.usuario.direccion === undefined) {
      alert('Rellena primero este form')
    } else {
      this.btnProgress2 = 'position-absolute top-0 start-50 translate-middle btn btn-sm btn-success rounded-pill'
      this.progressBar = 'width: 100%;'
      this.section = 3;
    }
    return
  }

  guardarUser() {
      this.serviceUsuario.registerUser(this.usuario).subscribe(
        () => {
          this.usuarioSave.push(this.usuario)
          this.usuario = new Usuario()
        }, (err) => {
          console.log('Error: ',err);
          console.log("Mensaje del Servidor: " + this.usuario.mensaje)
        }, async () => {
          alert(this.usuario.mensaje)
      })
  }



  ngOnInit(): void {
  }

}
