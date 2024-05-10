import {Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { Router } from '@angular/router';

/**
 * @title Card with multiple sections
 */
@Component({
  selector: 'Login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css'],
  standalone: true,
  imports: [MatCardModule, MatButtonModule],
})
export class LoginComponent {
  constructor( private AUTH:AuthService, private router:Router ){}
signin(){
  this.AUTH.doGoogleLogin().then(()=>{
    this.router.navigate(['/members'])
  })
}
logout(){
  this.AUTH.doLogout().then(() => {
    this.router.navigate(['/login']); 
  })
}
  
}
