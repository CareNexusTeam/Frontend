import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar'; // Adjust path if needed
import { HeaderComponent } from '../header/header';   // Adjust path if needed
import { FooterComponent } from '../footer/footer';   // Adjust path if needed

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    SidebarComponent,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.css']
})
export class MainLayoutComponent {}