import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';

@Component({
  imports: [RouterModule],
  selector: 'app-login-layout',
  styleUrl: './login-layout.css',
  templateUrl: './login-layout.html',
})
export class LoginLayout implements OnInit {
  constructor(private _title:Title) {}

  ngOnInit(): void {
    this._title.setTitle('Login');
  }

}
