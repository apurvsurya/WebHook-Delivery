import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { APIKeys } from '../../models/users';
import { CommonModule } from '@angular/common';
import { AlertTriangle, CheckIcon, CopyIcon, Key, KeyRoundIcon, LucideAngularModule, Plus, PlusIcon } from 'lucide-angular';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Users } from '../../services/user/users';

@Component({
  imports: [CommonModule, LucideAngularModule, FormsModule],
  selector: 'app-createapikeys',
  styleUrl: './createapikeys.css',
  templateUrl: './createapikeys.html',
  standalone:true
})
export class Createapikeys implements OnInit {
  apiKeys: APIKeys[] = [];

  readonly icon = PlusIcon;
  readonly keyRound = Key;
  readonly checkCiricle = CheckIcon;
  readonly copy = CopyIcon;
  readonly alertTriangle = AlertTriangle;

  keyName = '';
  isGenerating = false;
  generatedKey = '';

  errorMessage = "";

  constructor(private title: Title, private auth: Users, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.title.setTitle("Manage API Keys");
    this.cdr.detectChanges();
  }

  GenerateAPIKey(): void {
    this.isGenerating = true;
    this.auth.GenerateAPIKey(this.keyName).subscribe({
      next: (response) => {
        if (response.message === "API KEY Generated!") {
          this.isGenerating = false;
          this.generatedKey = response.rawKey;
          this.cdr.detectChanges();
          return;
        }
        this.errorMessage = response.message;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isGenerating = false;
        this.errorMessage = err.error.message;
        this.cdr.detectChanges();
      }
    })
  }

  async CopyApiKey(){
    await navigator.clipboard.writeText(this.generatedKey);
  }


}
