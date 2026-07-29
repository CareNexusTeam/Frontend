import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer
      class="border-t bg-white py-4 text-center text-sm text-gray-500">
      © 2026 CareNexus Healthcare System
    </footer>
  `
})
export class FooterComponent {}