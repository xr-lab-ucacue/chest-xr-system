import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';
import { Usuario } from '../interfaces/User';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private idRoute: ActivatedRoute, private authService: AuthService) { }

  profileID: number = 52;
  userData: Usuario[]=[];
  haveRols: any[]=[];
  usuario: Usuario = new Usuario();

  getDataUser(){
    // this.profileID = Number(this.idRoute.snapshot.paramMap.get('id'))
    this.authService.getUser(this.profileID).subscribe(
      (resp) => {
        let {roles, ...todo} = resp

        roles!.forEach((item: any) => {
          this.haveRols.push(item.nombre)
        });

        this.userData.push({...todo});
      }, (err) => {
        console.log("ERROR: ", err)
        if (err.status == 0) {
          Swal.fire('Servicio', 'No esta Disponible', 'error');
        }
      }, () => {}
    );
  }

    update(data:Usuario){
      Swal.fire({
        title: 'Seguro quieres editar el perfil?',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
      }).then((result) => {
        if (result.isConfirmed) {
          const UpdateUsuario:Usuario = {
            email: data.email,
            nombre: data.nombre,
            apellido: data.apellido,
            telefono: data.telefono,
            direccion: data.direccion,
            estado: data.estado
          };
          this.authService.aupdateUser(UpdateUsuario).subscribe(
            (resp: any) => {
              const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.addEventListener('mouseenter', Swal.stopTimer)
                  toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
              })
              Toast.fire({
                icon: 'success',
                title: `${resp.mensaje}`
              })
            }, (err) => {
              console.log("Error: ",err);
              const errorServidor = err.error.mensaje;
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `${errorServidor}`,
              })
          })
        }
      })

    }


  ngOnInit(): void {
    this.getDataUser();
  }

}
