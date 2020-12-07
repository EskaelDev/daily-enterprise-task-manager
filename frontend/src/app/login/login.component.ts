import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    form!: FormGroup;
    public loginInvalid!: boolean;
    private formSubmitAttempt!: boolean;
    private returnUrl!: string;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService
    ) 
    {}

    async ngOnInit() {
        this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';

        this.form = this.fb.group({
            email: ['', Validators.email],
            password: ['', Validators.required]
        });
        
        if (this.authService.currentUserValue) {
            await this.router.navigate([this.returnUrl]);
        }
    }

    async onSubmit() {
        this.loginInvalid = false;
        this.formSubmitAttempt = false;
        if (this.form.valid) {
                const email = this.form.get('email')!.value;
                const password = this.form.get('password')!.value;
                await this.authService.login(email, password).pipe(first())
                .subscribe(
                    data => {
                        this.router.navigate([this.returnUrl]);
                    },
                    error => {
                        // this.alertService.error(error);
                        // this.loading = false;
                        this.loginInvalid = true;
                    });
        } else {
            this.formSubmitAttempt = true;
        }
    }
}
