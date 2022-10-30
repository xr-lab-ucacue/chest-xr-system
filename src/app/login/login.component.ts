import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router) { }

  password: string = "password"
  eyePassword: string = "bi bi-eye-slash"
  eyeColor: string = "color: black;"

  ngOnInit(): void {
  }

  showPassword(){
    if (this.password === 'password') {
      this.password = 'text'
      this.eyePassword = 'bi bi-eye'
      this.eyeColor = 'color: rgb(115, 154, 225);'
    } else {
      this.password = 'password'
      this.eyePassword = 'bi bi-eye-slash'
      this.eyeColor = 'color: #262626;'

    }
    return
  }

  go(){
    this.router.navigateByUrl('/modelo1')
  }

}
