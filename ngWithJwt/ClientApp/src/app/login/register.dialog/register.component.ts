import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ValidationErrors, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { BehaviorSubject, Subscription, Observable, forkJoin } from 'rxjs';
import { take, debounceTime, delay, switchMap, map, distinctUntilChanged, tap } from 'rxjs/operators';
import emailMask from 'text-mask-addons/dist/emailMask';
import { User } from '../../_models/user';
import { UserService } from '../../_services/user.service';

export const userNamePattern = "^[0-9a-zA-Z_.@-]*$";
export const emailPattern = "^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
export const onlyLettersPattern = "^[A-Za-zА-Яа-яЁё\\s]+$";
export const simplePhonePattern = "\\d{5,12}";
export const successMessage = "Выполнено успешно";

@Component({
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {

  description: string;
  dialogForm: FormGroup;
  loading$ = new BehaviorSubject<boolean>(false);
  userNameloading$ = new BehaviorSubject<boolean>(false);
  loadCompleted$ = new BehaviorSubject<boolean>(false);

  user: User;

  mailMask = emailMask;

  private changePasswordSubscription: Subscription;

  passwordValidators = [Validators.required];
  newPasswordValidators = [Validators.required, Validators.minLength(8), this.passwordValidator, this.comparePasswordValidator];
  confirmedValidators = [Validators.required, Validators.minLength(8), this.passwordValidator, this.comparePasswordValidator];
  passwordTooltip = "Пароль должен содержать латинские буквы, быть не менее 8 символов в длину, содержать хотя бы одну цифру, одну заглавную букву и один спец. символ";

  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) { formData }: any,
    private dialogRef: MatDialogRef<RegisterComponent>,
    private service: UserService,
    public dialog: MatDialog,

    public snackBar: MatSnackBar) {
    this.user = formData;
  }

  ngOnInit() {
    this.description = "Registration";

    this.loadCompleted$.next(true);
    this.dialogForm = this.formBuilder.group({
      id: [0, [Validators.required]],
      userName: [
        null,
        [Validators.required, Validators.pattern(userNamePattern)],
        [this.userNameValidation.bind(this)]
      ],
      email: [null, [Validators.required, Validators.pattern(emailPattern)]],
      givenName: [null, [Validators.required, Validators.pattern(onlyLettersPattern)]],
      familyName: [null, [Validators.required, Validators.pattern(onlyLettersPattern)]],
      phoneNumber: [null, [Validators.pattern(simplePhonePattern)]],
      password: ["", [Validators.required]],
      confirmedPassword: ["", [Validators.required]],
      isChangePassword: [true]
    },
      this.passwordMatchValidator);



    this.togglePasswordValidators(this.dialogForm.get("isChangePassword").value);

  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password').value === form.get('confirmedPassword').value
      ? null
      : { 'mismatch': true };
  }

  userNameValidation(control: FormControl): Observable<ValidationErrors> {
    this.userNameloading$.next(false);
    return new Observable<ValidationErrors>(observer => {
      if (!control.valueChanges) {
        observer.next(null);
        observer.complete();
      }
      else {
        this.userNameloading$.next(true);
        control.valueChanges.pipe(
          delay(1000),
          debounceTime(1000),
          distinctUntilChanged(),
          take(1),
          switchMap(() => this.service.isUsernameUnique(this.dialogForm.value)),
          map(response => {
            this.userNameloading$.next(false);
            if (!response)
              observer.next({
                userNameError: 'Пользователь с таким логином уже существует'
              });
            else
              observer.next(null);
            observer.complete();
          })
        ).subscribe(() => observer.complete());
      }
    });
  }

  close() {
    this.dialogRef.close();
  }

  public showSnackBar(message: string, cssClass?: string, action?: string, duration?: number) {
    if (!duration)
      duration = 4000;
    this.snackBar.open(message,
      action,
      {
        duration: duration,
        panelClass: cssClass
      });
  }

  save() {
    if (this.dialogForm.valid) {
      this.loading$.next(true);
      this.service.addUser(this.dialogForm.value).subscribe(res => {
        if (res > 0) {
          this.showSnackBar(successMessage, "green");
          this.dialogForm.get("id").setValue(res);
          this.dialogRef.close(this.dialogForm.value);
        } else if (typeof res === "string") {
          this.showSnackBar(`Ошибка: ${res}`, "error");
        } else
          this.showSnackBar(`Ошибка: не удалось сохранить данные`, "error");
        this.loading$.next(false);
      });
    }
  }

  private togglePasswordValidators(wantToChangePasswords: boolean): void {
    const newPassword = this.dialogForm.get('password');
    const confirmedPassword = this.dialogForm.get('confirmedPassword');

    if (wantToChangePasswords) {
      newPassword.setValidators(this.newPasswordValidators);
      confirmedPassword.setValidators(this.confirmedValidators);
    } else {
      newPassword.setValue(null);
      newPassword.clearValidators();
      confirmedPassword.setValue(null);
      confirmedPassword.clearValidators();
    }

    this.dialogForm.updateValueAndValidity();
  }

  /** Валидатор пароля */
  private passwordValidator(control: FormControl): ValidationErrors {
    const value = control.value;
    /** Проверка на содержание спец. символов */
    const hasSpecSymbols = /[!@#$%^&*)(_\-+=<>?{}]/.test(value);
    /** Проверка на содержание цифр */
    const hasNumber = /[0-9]/.test(value);
    /** Проверка на содержание заглавных букв */
    const hasCapitalLetter = /[A-Z]/.test(value);
    /** Проверка на содержание прописных букв */
    const hasLowercaseLetter = /[a-z]/.test(value);
    /** Проверка на минимальную длину пароля */
    const isLengthValid = value ? value.length > 7 : false;

    /** Общая проверка */
    const passwordValid = hasSpecSymbols && hasNumber && hasCapitalLetter && hasLowercaseLetter && isLengthValid;

    let dataForm = control.parent;
    const newValue = dataForm.get("password");
    const confirmedValue = dataForm.get("confirmedPassword");
    var isInvalidNewVal = false;
    var isInvalidConfVal = false;

    if (newValue.value && confirmedValue.value && newValue.value === confirmedValue.value) {
      if (newValue.errors || confirmedValue.errors) {

        if (newValue.hasError("invalidPassword")) {
          isInvalidNewVal = true;
        }
        if (confirmedValue.hasError("invalidPassword")) {
          isInvalidConfVal = true;
        }
        newValue.setErrors(null);
        confirmedValue.setErrors(null);

        if (isInvalidNewVal) {
          newValue.setErrors({ invalidPassword: 'Пароль не является надежным [?]' });
        }
        if (isInvalidConfVal) {
          confirmedValue.setErrors({ invalidPassword: 'Пароль не является надежным [?]' });
        }

      }
    }

    if (value && !passwordValid) {
      return { invalidPassword: 'Пароль не является надежным [?]' };
    }
    return null;
  }

  private comparePasswordValidator(control: FormControl): ValidationErrors {
    let dataForm = control.parent;
    if (!dataForm) return null;

    const newValue = dataForm.get("password").value;
    const confirmedValue = dataForm.get("confirmedPassword").value;
    if (newValue && confirmedValue && newValue !== confirmedValue) {
      return { invalidComparisonPassword: 'Пароли должны совпадать' }
    } else
      return null;
  }

  normalizeUserPhone(value: string) {
    value = value.replace(/\D+/g, '');
    this.dialogForm.get("phoneNumber").setValue(value);
  }

  onFocusOut(span: any, input: HTMLInputElement) {
    if (!input.value) {
      span.style.visibility = "hidden";
    }
  }

  onPhoneInput(span: any, input: HTMLInputElement) {
    span.style.visibility = "visible";
    if (input.value == "") {
      span.style.visibility = "hidden";
    }
  }
}
