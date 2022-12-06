import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ResolveStart } from '@angular/router';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';
import { Usuario } from '../interfaces/User';
@Component({
  selector: 'app-page-user',
  templateUrl: './page-user.component.html',
  styleUrls: ['./page-user.component.css']
})
export class PageUserComponent implements OnInit {

  constructor(private idRoute: ActivatedRoute, private authService: AuthService) { }

  profileID: number = 0;
  userData: Usuario[]=[];
  haveRols: any[]=[];

  getDataUser(){
    this.profileID = Number(this.idRoute.snapshot.paramMap.get('id'))
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


  ngOnInit(): void {
    this.getDataUser();
  }

}
