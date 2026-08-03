import { Component } from '@angular/core';

import { HeaderComponent }
from '../header/header';

import { SidebarComponent }
from '../sidebar/sidebar';

import { FooterComponent }
from '../footer/footer';
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    RouterOutlet
],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayoutComponent {}