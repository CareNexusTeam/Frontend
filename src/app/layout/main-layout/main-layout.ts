import { Component } from '@angular/core';

import { HeaderComponent }
from '../header/header';

import { SidebarComponent }
from '../sidebar/sidebar';

import { FooterComponent }
from '../footer/footer';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    HeaderComponent,
    SidebarComponent,
    FooterComponent
  ],
  templateUrl: './main-layout.html'
})
export class MainLayoutComponent {}