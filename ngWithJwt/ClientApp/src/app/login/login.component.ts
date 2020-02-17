import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { AuthenticationService } from '@app/_services';
import { RegisterComponent} from './register.dialog/register.component';

@Component({ templateUrl: 'login.component.html' })
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    error = '';

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
      private router: Router,
        public dialog: MatDialog,
        private authenticationService: AuthenticationService
    ) { 
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) { 
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        this.authenticationService.login(this.f.username.value, this.f.password.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.router.navigate([this.returnUrl]);
                },
                error => {
                    this.error = error;
                    this.loading = false;
                });
    }


    register() {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {  };
      dialogConfig.minWidth = 700;
      dialogConfig.disableClose = true;
      const dialogRef = this.dialog.open(RegisterComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(
        data => {
         
        });
      dialogRef.backdropClick().subscribe(() => {
        if (!dialogRef.componentInstance.dialogForm.dirty) {
          dialogRef.close();
        }
      });
    }

    clearMessages(): void {
      this.error = "";
    }
}
