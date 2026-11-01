import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Users } from '../../../services/user/users';
import { UserLogin } from '../../../models/users';
import { Router } from '@angular/router';

@Component({
  imports: [FormsModule, CommonModule],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login implements OnInit {

  constructor(private _title: Title, private _service: Users,private cdr:ChangeDetectorRef,private router:Router) { }

  email: string = "";
  password: string = "";

  isLoading:boolean=false;
  errorMessage:string="";


  ngOnInit(): void {
    this._title.setTitle("Sign In");
  }

  onLoginClick():void{
    if(!this.email || !this.password){
      return;
    }
    const submitBody: UserLogin = {
       email: this.email,
       password: this.password
     };
       this._service.LoginAccount(submitBody).subscribe({

      next: (response) => {

        this.isLoading = false;
        this.cdr.detectChanges();

        if (response.message === "Login successful") {

          sessionStorage.setItem('accesstoken', response.token);
          this._service.setCurrentUser(response.data);
          this.router.navigate(['/app/dashboard']);
          return;
        }

        this.errorMessage = response.message;
      },

      error: (err) => {

        this.isLoading = false;

        console.error(err);

        this.errorMessage = err.error.message;
        this.cdr.detectChanges();
        setTimeout(() => {
        }, 2000);
      }
    });
  }

}
