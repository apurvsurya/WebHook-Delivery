import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Users } from '../../../services/user/users';
import { CreateUserInput, UserLogin } from '../../../models/users';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  imports: [FormsModule, CommonModule,RouterLink],
  selector: 'app-registeraccount',
  styleUrl: './registeraccount.css',
  templateUrl: './registeraccount.html',
})
export class Registeraccount implements OnInit {
  name = '';
  email = '';
  password = '';
  organization = '';
  confirmPassword = '';

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private _title: Title, private _service: Users, private router: Router, private cdr: ChangeDetectorRef) { }


  ngOnInit(): void {
    this._title.setTitle("Register New Account")
  }

  RedirectToLogin(): void {
    this.router.navigate(['/login']);
  }

  RegisterAccount(): void {

    if (!this.name || !this.email || !this.password || !this.organization) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    if (!this.VerifyConfirmPassword()) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const submitBody: CreateUserInput = {
      email: this.email,
      name: this.name,
      organization: this.organization,
      password: this.password
    };

    this._service.RegisterAccount(submitBody).subscribe({

      next: (response) => {

        this.isLoading = false;

        this.cdr.detectChanges();
        if (response.message === "User Created") {

          this.successMessage = "Account created successfully! Welcome aboard.";
          this.cdr.detectChanges();
          setTimeout(() => {
            this.RedirectToDashBoard();
          }, 2000);

        } else {
          this.errorMessage = "Unable to create your account.";
        }
      },

      error: (err) => {
        console.log('API error callback executed');

        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Registration failed';

        console.log('Loading:', this.isLoading);
        console.log('Error:', this.errorMessage);
        this.cdr.detectChanges();

      }
    });
  }

  VerifyConfirmPassword(): boolean {
    return this.confirmPassword === this.password;
  }

  RedirectToDashBoard(): void {

    this.isLoading = true;

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

        this.errorMessage = "Account created, but automatic login failed.";
      },

      error: (err) => {

        this.isLoading = false;

        console.error(err);

        this.errorMessage = "Account created, but automatic login failed.";
        this.cdr.detectChanges();
        setTimeout(() => {
          this.RedirectToLogin();
        }, 2000);
      }
    });
  }
}
