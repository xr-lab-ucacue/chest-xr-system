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

  displayedColumns: string [] = ['id','cedula', 'email', 'nombre', 'apellido', 'telefono', 'direccion', 'estado', 'roles']
  // displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];

  dataUsers: any[] = [];
  rolesUser: any[] = [];

  dataSource = new MatTableDataSource<any>(this.dataUsers);
  // dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  clickedRows = new Set<Usuario>();

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
    this.getUsers()
  }

  getUsers(){
    this.usersService.getUserRegisters().subscribe(
      (req) => {
        // req.forEach((item: any) => {
        //   this.dataUsers.push(item)
        // });

        req.filter( e => {
          console.log("Roles: ", e.roles);
        });


        this.dataUsers = req

        this.dataSource = new MatTableDataSource<any>(this.dataUsers);
        this.dataSource.paginator = this.paginator
        this.dataSource.sort = this.sort;
      }, (res) => {
        console.log(res);
      }, () => {
        console.log("EXITO");
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
    return this.backgroundFilter = (event.target as HTMLInputElement).value;
  }
}

