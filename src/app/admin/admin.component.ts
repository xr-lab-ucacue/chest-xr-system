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

  // changeColorRol(rol:string){
  //   if (rol == "ROLE_ADMIN") {
  //     return this.backgroundColorRol = "background-color: rgb(161, 59, 192);"
  //   } else if (rol == "ROLE_USER") {
  //     return this.backgroundColorRol = "background-color: rgb(245, 172, 37);"
  //   } else {
  //     return this.backgroundColorRol = "background-color: grey;"
  //   }
  // }

  constructor(private _liveAnnouncer: LiveAnnouncer, private usersService: AuthService) {}

  displayedColumns: string [] = ['id','cedula', 'email', 'nombre', 'apellido', 'telefono', 'direccion', 'estado', 'tokenEstado', 'roles']

  dataUsers: any[] = [];
  rolesUser: any[] = [];

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

        res.filter( e => {
          console.log("E:> ",e.roles);
          e.roles.forEach( (i:any) => {
          console.log("i:> ",i.nombre);
            // if(e.roles.length > 1){
            //   this.dataUsers.push(e.roles = i.nombre);
            //   this.dataUsers.push(e.roles = i.nombre);
            // }
            this.dataUsers.push(e.roles = i.nombre);
          });
        });

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

}

