import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastState {
  show: boolean;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new BehaviorSubject<ToastState>({
    show: false,
    type: 'success',
    title: '',
    message: ''
  });

  toast$ = this.toastSubject.asObservable();
  private timeoutId: any = null;

  constructor(private ngZone: NgZone) {}

  showToast(type: 'success' | 'error' | 'info', title: string, message: string): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    this.ngZone.run(() => {
      this.toastSubject.next({
        show: true,
        type,
        title,
        message
      });
    });

    this.timeoutId = setTimeout(() => {
      this.closeToast();
    }, 3500);
  }

  closeToast(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    this.ngZone.run(() => {
      const current = this.toastSubject.value;
      this.toastSubject.next({
        ...current,
        show: false
      });
    });
  }
}
