import { NgFor, NgIf } from '@angular/common';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  signal,
  ViewChildren,
  WritableSignal,
} from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { interval, Subject, takeUntil } from 'rxjs';
import { errorSweetAlert, successSweetAlert } from '../../data/sweet-alerts';
import { OtpModel, SuccesResponseModel } from '../../models/user';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-otp-verification',
  standalone: true,
  imports: [NgFor, NgxMaskDirective, NgxMaskPipe, NgIf],
  templateUrl: './otp-verification.component.html',
  styleUrl: './otp-verification.component.scss',
  providers: [provideNgxMask()],
})
export class OtpVerificationComponent implements OnDestroy, OnInit {
  protected loading: WritableSignal<boolean> = signal(false);
  private unsubscribe$ = new Subject<void>();
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;
  private otpCode: string = '';
  protected attempts: number = 0;
  protected maxAttempts: number = 3;
  protected countdown: number = 60;
  @Output() data!: OtpModel

  constructor(
    private ngbModal: NgbModal,
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.startCountdown();
  }

  private startCountdown(): void {
    interval(1000)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        if (this.countdown > 0) {
          this.countdown--;
        } else {
          this.closeModal();
        }
      });
  }

  onKeyUp(event: KeyboardEvent, index: number): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (value && index < 5) {
      this.otpInputs.toArray()[index + 1].nativeElement.focus();
    } else if (!value && index > 0) {
      this.otpInputs.toArray()[index - 1].nativeElement.focus();
    }

    this.checkIfAllFilled();
  }

  checkIfAllFilled(): void {
    this.otpCode = this.otpInputs
      .toArray()
      .map((input) => input.nativeElement.value)
      .join('');

    if (this.otpCode.length === 6) {
      this.submitOtp();
    }
  }

  private submitOtp(): void {
    this.loading.set(true);
    this.disableOrResetOtpInputs(true);
    let data = { otp: this.otpCode, email: this.data.email, type: this.data.type }
    this.authService.otp(data)
      .pipe(
        takeUntil(this.unsubscribe$),
      ).subscribe({
        next: (res) => {
          this.processSuccessfulResponse(res)
        },
        error: (e) => this.handleError()
      });
  }

  private processSuccessfulResponse(res: SuccesResponseModel): void {
    this.closeModal();
    this.loading.set(false);
    if (this.data.type === 'login' && res.token) {
      this.userService.setAuthToken(res.token);
      this.handleSuccess();
    } else {
      this.userService.isOtpCode.set(this.otpCode);
      this.router.navigate(['/reset-password']);
    }
  }


  private handleSuccess(): void {
    successSweetAlert('Hoş geldiniz.').finally(() => {
      this.router.navigate(['/home']);
    });
  }

  private handleError(): void {
    this.disableOrResetOtpInputs(false);
    this.attempts++;
    if (this.attempts >= this.maxAttempts) {
      this.showMaxAttemptsError();
    } else {
      this.error();
    }
  }

  private error(): void {
    this.loading.set(false);
    errorSweetAlert('Geçersiz OTP. Lütfen tekrar deneyin.', 1000)
  }

  private showMaxAttemptsError(): void {
    this.closeModal();
    errorSweetAlert('Maksimum giriş denemesi aşıldı. Lütfen tekrar deneyin.', 2000)
  }

  private disableOrResetOtpInputs(disable: boolean): void {
    this.otpInputs.map((input) => {
      input.nativeElement.disabled = disable;
      if (!disable) input.nativeElement.value = '';
    });
    if (!disable) this.otpInputs.first.nativeElement.focus();
  }

  onPaste(event: ClipboardEvent): void {
    const clipboardData = event.clipboardData?.getData('text');
    if (clipboardData) {
      const otpArray = clipboardData
        .split('')
        .filter((char) => !isNaN(Number(char)))
        .slice(0, 6);

      otpArray.map((char, index) => {
        const input = this.otpInputs.toArray()[index].nativeElement;
        input.value = char;
        if (index < 5) {
          this.otpInputs.toArray()[index + 1].nativeElement.focus();
        }
      });
      event.preventDefault();
      this.checkIfAllFilled();
    }
  }

  private closeModal(): void {
    this.ngbModal.dismissAll();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
