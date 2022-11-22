import Swal  from 'sweetalert2';
import { Usuario } from './../interfaces/User';
import { Component, OnInit } from '@angular/core';
import {AfterViewInit, ViewChild} from '@angular/core';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {MatPaginator} from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements AfterViewInit {

  constructor(private _liveAnnouncer: LiveAnnouncer, private usersService: AuthService) {}

  displayedColumns: string [] = ['id','cedula', 'email', 'nombre', 'apellido', 'telefono', 'direccion', 'estado', 'tokenEstado', 'roles', 'edit']

  dataUsers: any[] = [];
  rolesUser: any[] = [];
  usuario: Usuario = new Usuario();

  dataSource = new MatTableDataSource<any>(this.dataUsers);

  clickedRows = new Set<Usuario>();

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.getUsers()
  }

  getUsers(){
    this.usersService.getUserRegisters().subscribe(
      (res: Usuario[]) => {
        // req.forEach((item: any) => {
        //   this.dataUsers.push(item)
        // });

        // res.filter( e => {
        //   console.log("E:> ",e.roles);
        //   e.roles.filter( (i:any) => {
        //   console.log("i:> ",i.nombre);
        //     this.dataUsers.push(e.roles = i.nombre);
        //   });
        // });

        res.forEach((e:Usuario) => {
          console.log("Roles-ForEach: ", e.roles)
          e.roles.forEach((i:any) => {
            // console.log("x2F>: ",e.roles[0] = i.nombre, e.roles[1])
            console.log("x2F>: ", e.roles[i] = i.nombre)
            this.dataUsers.push(e.roles[0] = i.nombre);
          });
        })

      this.dataUsers = res

        this.dataSource = new MatTableDataSource<any>(this.dataUsers);
        this.dataSource.paginator = this.paginator
        this.dataSource.sort = this.sort;
      }, (err) => {
        console.log(err);
      }, () => {
        // console.log("EXITO");
      }
    )
  }

  //Anunciador de Sort (Ingles)
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
      console.log("if: ", this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`));

    } else {
      this._liveAnnouncer.announce('Sorting cleared');
      console.log( "else: ", this._liveAnnouncer.announce('Sorting cleared'));
    }
  }

  backgroundFilter:string = "";
  //Filtro para el paginador
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    return this.backgroundFilter = (event.target as HTMLInputElement).value
  }

  async updateUser(){
    const { value: formValues } = await Swal.fire({
      title: 'Editar Usuario',
      html:
      `
      <!-- Email -->
      <label class="form-label">Email:</label>
      <input
        type="text"
        class="form-control"
        id="swal-input1"
      />

      <!-- Nombre -->
      <label class="form-label">Nombre:</label>
      <input
        type="text"
        class="form-control"
        id="swal-input2"
      />

      <!-- Apellido -->
      <label class="form-label">Apellido:</label>
      <input
        type="text"
        class="form-control"
        id="swal-input3"
      />

      <!-- Telefono -->
      <label class="form-label">Telefono:</label>
      <input
        type="text"
        class="form-control"
        id="swal-input4"
      />

      <!-- Direccion -->
      <label class="form-label">Direccion:</label>
      <input
        type="text"
        class="form-control"
        id="swal-input5"
      />

      <!-- Estado -->
      <label class="form-label">Estado:</label>
      <input
        type="text"
        class="form-control"
        id="swal-input6"
      />

      <br>
      <hr>
      <input id="swal-input1" class="swal2-input">
      `,

      focusConfirm: false,
      preConfirm: () => {
        return [
          // (document.getElementById(elementId) as HTMLInputElement).value
          (<HTMLInputElement>document.getElementById('swal-input1')!).value ,

          (<HTMLInputElement>document.getElementById('swal-input2')!).value,
          (<HTMLInputElement>document.getElementById('swal-input3')!).value,
          (<HTMLInputElement>document.getElementById('swal-input4')!).value,
          (<HTMLInputElement>document.getElementById('swal-input5')!).value,
          (<HTMLInputElement>document.getElementById('swal-input6')!).value,
        ]
      }
    })

    if (formValues) {
      Swal.fire(JSON.stringify(formValues))
    }

    /* this.usersService.aupdateUser(this.usuario).subscribe(
      (resp) => {

      }, (err) => {

      }, () => {
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
          title: 'Usuario Actualizado'
        })
      }) */
  }
}

