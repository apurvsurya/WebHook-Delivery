import { Component, computed, inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Users } from '../../services/user/users';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { LoginDTO, UserDTO } from '../../models/users';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Linkedin, Instagram } from 'lucide-angular';
@Component({
  imports: [CommonModule, LucideAngularModule, RouterOutlet,RouterLink],
  selector: 'app-dashboard-layout',
  styleUrl: './dashboard-layout.css',
  templateUrl: './dashboard-layout.html',
})
export class DashboardLayout implements OnInit {
  navItems = [
    { label: 'Dashboard', icon: '⌂', route: '/app/dashboard' },
    { label: 'Destinations', icon: '▣', route: '/app/destinations' },
    { label: 'Events', icon: '⌁', route: '/app/events' },
    { label: 'Deliveries', icon: '▤', route: '/app/deliveries' },
    { label: 'Dead Letter Queue', icon: '▢', route: '/app/dead-letter-queue' },
    { label: 'API Keys', icon: '⚿', route: '/app/api-keys' },
    { label: 'Settings', icon: '⚙', route: '/app/settings' }
  ];

  private _service = inject(Users);

  readonly Linkedin = Linkedin;
  readonly Instagram = Instagram;

  constructor(private _title: Title, private router: Router) { }

  currentUser = this._service.currentUser;

  userInitials = computed(() => {
    const name = this.currentUser()?.name ?? '';

    return name
      .split(' ')
      .filter(Boolean)
      .map(part => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  });


  ngOnInit(): void {
    this._title.setTitle("Webhook delivery Dashboard");
    const token = sessionStorage.getItem('accesstoken');
    if (!token || !this.currentUser()?.email) {
      this.router.navigate(['/login']);
    }
  }

}
