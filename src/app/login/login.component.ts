import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router) { }

  typePassword: string = "password"
  eyePassword: string = "bi bi-eye-slash"
  eyeColor: string = "color: black;"

  email:string = '';
  password:string = '';

  ngOnInit(): void {
  }

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

  go(){
    this.router.navigateByUrl('/modelo1')
  }

}
