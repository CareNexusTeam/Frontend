import { Component } from '@angular/core';

import { SidebarComponent } from '../sidebar/sidebar';
import { HeaderComponent } from '../header/header';
import { FooterComponent } from '../footer/footer';



@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    SidebarComponent,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './main-layout.html'
})
export class MainLayoutComponent {}
