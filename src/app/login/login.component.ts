import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { ILogin } from '../interfaces/Login';  
import { AuthService } from '../../app/Services/auth.service' 
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; 
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = ''; // Déclaration de la propriété 'username'
  password: string = ''; // Déclaration de la propriété 'password'

  constructor(private formBuilder : FormBuilder,  
    private router : Router,  
    private authService : AuthService ) { }
    model: ILogin = { userid: "doula", password: "doula" }  

    loginForm!: FormGroup;  
    message!: string;  
    returnUrl: string  = '/patients';  

    ngOnInit() {  
      this.loginForm = this.formBuilder.group({  
        userid: ['', Validators.required],  
        password: ['', Validators.required]  
      });  
      this.returnUrl = '/patients';  
      this.authService.logout();  
    }  

   

  onSubmit(): void {
      if (this.username == this.model.userid && this.password == this.model.password) {  
        console.log("Login successful");  
        //this.authService.authLogin(this.model);  
        localStorage.setItem('isLoggedIn', "true");  
        localStorage.setItem('token', this.model.userid);  
        this.router.navigate([this.returnUrl]);  
      }  
      else {  
        this.message = "Please check your userid and password";  
      }  
    
  }

  
}
