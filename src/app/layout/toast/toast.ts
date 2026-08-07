import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="(toastService.toast$ | async)?.show"
      class="toast-notification"
      [ngClass]="{
        'toast-success': (toastService.toast$ | async)?.type === 'success',
        'toast-error': (toastService.toast$ | async)?.type === 'error',
        'toast-info': (toastService.toast$ | async)?.type === 'info'
      }">

      <div
        class="toast-badge"
        [ngClass]="{
          'badge-success': (toastService.toast$ | async)?.type === 'success',
          'badge-error': (toastService.toast$ | async)?.type === 'error',
          'badge-info': (toastService.toast$ | async)?.type === 'info'
        }">
        <span *ngIf="(toastService.toast$ | async)?.type === 'success'">✓</span>
        <span *ngIf="(toastService.toast$ | async)?.type === 'error'">✕</span>
        <span *ngIf="(toastService.toast$ | async)?.type === 'info'">ℹ</span>
      </div>

      <div class="toast-content">
        <h4 class="toast-title">{{ (toastService.toast$ | async)?.title }}</h4>
        <p class="toast-message">{{ (toastService.toast$ | async)?.message }}</p>
      </div>

      <button type="button" (click)="toastService.closeToast()" class="toast-close-btn">
        &times;
      </button>

      <div class="toast-progress-bar"></div>
    </div>
  `,
  styles: [`
    .toast-notification {
      position: fixed;
      top: 5rem;
      right: 1.5rem;
      z-index: 99999;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      width: 20rem;
      max-width: 100%;
      padding: 1rem;
      border-radius: 0.75rem;
      background-color: #ffffff;
      border: 1px solid #e2e8f0;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      transition: all 0.3s ease;
      overflow: hidden;
    }

    .toast-success { border-color: #a7f3d0; }
    .toast-error   { border-color: #fecdd3; }
    .toast-info    { border-color: #bfdbfe; }

    .toast-badge {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      width: 2rem;
      height: 2rem;
      border-radius: 9999px;
      font-size: 0.875rem;
      font-weight: 700;
    }

    .badge-success { background-color: #d1fae5; color: #047857; }
    .badge-error   { background-color: #ffe4e6; color: #be123c; }
    .badge-info    { background-color: #dbeafe; color: #1e3a8a; }

    .toast-content {
      flex: 1;
      min-width: 0;
    }

    .toast-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .toast-message {
      font-size: 0.75rem;
      color: #64748b;
      margin-top: 0.125rem;
      margin-bottom: 0;
      line-height: 1.625;
      display: -webkit-box;
      line-clamp: 2;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .toast-close-btn {
      color: #94a3b8;
      padding: 0.25rem;
      border-radius: 0.5rem;
      border: none;
      background: transparent;
      cursor: pointer;
      flex-shrink: 0;
    }

    .toast-close-btn:hover {
      color: #475569;
      background-color: #f1f5f9;
    }

    .toast-progress-bar {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 3px;
      width: 100%;
      animation: shrinkToastProgress 3.5s linear forwards;
    }

    .toast-success .toast-progress-bar { background-color: #10b981; }
    .toast-error   .toast-progress-bar { background-color: #f43f5e; }
    .toast-info    .toast-progress-bar { background-color: #3b82f6; }

    @keyframes shrinkToastProgress {
      0% {
        width: 100%;
      }
      100% {
        width: 0%;
      }
    }
  `]
})
export class ToastComponent {
  toastService = inject(ToastService);
}
