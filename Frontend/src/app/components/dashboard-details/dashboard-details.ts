import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Destinations } from '../../models/destinations';
import { CommonModule, DatePipe } from '@angular/common';
import { Globe, LucideAngularModule } from 'lucide-angular';
import { Title } from '@angular/platform-browser';
import { Events } from '../../services/events';

@Component({
  imports: [CommonModule, DatePipe, LucideAngularModule],
  selector: 'app-dashboard-details',
  styleUrl: './dashboard-details.css',
  templateUrl: './dashboard-details.html',
})
export class DashboardDetails implements OnInit {
  Destinations: Destinations[] = [];
  eventsService = inject(Events);
  cdr = inject(ChangeDetectorRef);

  readonly globe = Globe;

  ngOnInit(): void {
    this.GetAllDestinations();
  }

  GetAllDestinations(): void {
    this.eventsService.GetAllDestinationsForUser().subscribe({
      next: (response) => {
        console.log("Hello");
        if (response) {
          this.Destinations = response.destinationList;
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log("Hello");
        console.log(err);
      }
    })
  }
}
