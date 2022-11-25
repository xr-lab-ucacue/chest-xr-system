import { Usuario } from './../interfaces/User';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import Swal from "sweetalert2"

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(private usersService: AuthService) {}

  usuario: Usuario = new Usuario();
  dataUsers: any[] = [];
  allUsers: number = 0;

  // elemntos de paginacion
  p: number = 1;
  itemsPage: number = 6;
  // filtro
  searchText: any;

  getUsers(){
    this.usersService.getUserRegisters().subscribe(
      (res: Usuario[]) => {

        res.forEach((e: Usuario) => {
          console.log("Roles-ForEach: ", e.roles)
          e.roles!.forEach((i: any) => {
            console.log(i.nombre);
            this.dataUsers.push(i.nombre);
          });
        })

      this.dataUsers = res
      this.allUsers = res.length
      }, (err) => {
        console.log(err);
      }, () => {
        // console.log("EXITO");
      }
    )
  }

  async updateUser(usuario:Usuario){

    const { value: formValues } = await Swal.fire({
      title: 'Editar Usuario',
      html:
      `
      <!-- Email -->
      <label class="form-label">Email:</label>
      <input
        type="text"
        class="form-control"
        id="swal-email"
      />

      <!-- Nombre -->
      <label class="form-label">Nombre:</label>
      <input
        type="text"
        class="form-control"
        id="swal-nombre"
      />

      <!-- Apellido -->
      <label class="form-label">Apellido:</label>
      <input
        type="text"
        class="form-control"
        id="swal-apellido"
      />

      <!-- Telefono -->
      <label class="form-label">Telefono:</label>
      <input
        type="text"
        class="form-control"
        id="swal-telefono"
      />

      <!-- Direccion -->
      <label class="form-label">Direccion:</label>
      <input
        type="text"
        class="form-control"
        id="swal-direccion"
      />

      <!-- Estado -->
      <label for="rol" class="form-label mb-2 mt-2">Estado</label>
      <select class="form-select" id="swal-estado">
        <option value="false" disabled selected hidden>
          Selecione el Rol
        </option>
        <option value="true">True</option>
        <option value="false">False</option>
      </select>
      `,
      focusConfirm: true,
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        cancelButtonColor: "#d33",
        didOpen: () => {
          (<HTMLInputElement>document.getElementById('swal-email')!).value = usuario.email,
          (<HTMLInputElement>document.getElementById('swal-nombre')!).value = usuario.apellido,
          (<HTMLInputElement>document.getElementById('swal-apellido')!).value = usuario.nombre,
          (<HTMLInputElement>document.getElementById('swal-telefono')!).value = usuario.telefono,
          (<HTMLInputElement>document.getElementById('swal-direccion')!).value = usuario.direccion,
          (<HTMLInputElement>document.getElementById('swal-estado')!).value = usuario.estado as any
        },
      preConfirm: () => {
        const UpdateUsuario:Usuario = {
          email: (<HTMLInputElement>document.getElementById('swal-email')!).value,
          nombre: (<HTMLInputElement>document.getElementById('swal-nombre')!).value,
          apellido: (<HTMLInputElement>document.getElementById('swal-apellido')!).value,
          telefono: (<HTMLInputElement>document.getElementById('swal-telefono')!).value,
          direccion: (<HTMLInputElement>document.getElementById('swal-direccion')!).value,
          estado: (<HTMLInputElement>document.getElementById('swal-estado')!).value as any,
        };
        this.usersService.aupdateUser(UpdateUsuario).subscribe(
            (resp: any) => {
              // console.log("Respuesta: ",resp);
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
    if (formValues) {
      Swal.fire(JSON.stringify(formValues))
    }
  }

  ngOnInit(): void {
    this.getUsers();
  }

}

