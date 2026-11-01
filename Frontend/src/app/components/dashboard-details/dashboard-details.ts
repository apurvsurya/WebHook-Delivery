import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Destinations } from '../../models/destinations';
import { CommonModule, DatePipe } from '@angular/common';
import { Globe, LucideAngularModule } from 'lucide-angular';
import { Title } from '@angular/platform-browser';
import { Events } from '../../services/events';
import { Eventsdetails, EventsDTO } from '../../models/events';
import { Activity, Webhook } from 'lucide-angular';
import { BaseChartDirective } from 'ng2-charts';
import {
  Chart,
  ChartConfiguration,
  ChartData,
  registerables
} from 'chart.js';

Chart.register(...registerables);

@Component({
  imports: [CommonModule, DatePipe, LucideAngularModule, BaseChartDirective],
  selector: 'app-dashboard-details',
  styleUrl: './dashboard-details.css',
  templateUrl: './dashboard-details.html',
})
export class DashboardDetails implements OnInit {
  Destinations: Destinations[] = [];
  eventsService = inject(Events);
  cdr = inject(ChangeDetectorRef);

  readonly globe = Globe;

  readonly activity = Activity;
  readonly webhook = Webhook;

  LatestEvents: Eventsdetails[] = [];

  EventStats =
    {
      "total": 1284,
      "succeeded": 1156,
      "failed": 128
    }

  //Charts
  public jobChartData: ChartData<'line'> = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Succeeded',
        data: [120, 150, 135, 180, 160, 210, 195],
        borderColor: '#A78BFA',
        backgroundColor: '#A78BFA20',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Failed',
        data: [12, 8, 15, 10, 18, 9, 11],
        borderColor: '#F87171',
        backgroundColor: '#F8717120',
        tension: 0.4
      },
      {
        label: 'Pending',
        data: [20, 15, 18, 12, 25, 16, 10],
        borderColor: '#FBBF24',
        backgroundColor: '#FBBF2420',
        tension: 0.4
      }
    ]
  };

  public jobChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#A1A1B5',
          usePointStyle: true
        }
      }
    },
    scales: {
      x: {
        ticks: { color: '#9292A5' },
        grid: { color: '#252536' }
      },
      y: {
        beginAtZero: true,
        ticks: { color: '#9292A5' },
        grid: { color: '#252536' }
      }
    }
  };

  ngOnInit(): void {
    this.GetAllDestinations();
    this.GetAllEvents();
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
        this.cdr.detectChanges();
      }
    })
  }

  getEventStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'succeeded':
      case 'delivered':
      case 'completed':
        return 'bg-emerald-500/10 text-emerald-400';

      case 'pending':
      case 'processing':
      case 'retrying':
        return 'bg-amber-500/10 text-amber-400';

      case 'failed':
      case 'dead':
        return 'bg-red-500/10 text-red-400';

      default:
        return 'bg-slate-500/10 text-slate-400';
    }
  }

  GetAllEvents(): void {
    this.eventsService.GetAllEvents().subscribe({
      next: (response) => {
        console.log("Hello");
        if (response) {
          this.LatestEvents = response.data;
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log("Hello");
        console.log(err);
        this.cdr.detectChanges();
      }
    })
  }
}
