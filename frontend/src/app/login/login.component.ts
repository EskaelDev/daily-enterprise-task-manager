import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { first } from 'rxjs/operators';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    form: FormGroup;
    loading = false;
    submitted = false;
    private returnUrl: string;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService,
        private alertService: AlertService
    ) 
    {}

    async ngOnInit() {
        this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';

        this.form = this.fb.group({
            email: ['', [Validators.email, Validators.required]],
            password: ['', Validators.required]
        });
        
        if (this.authService.currentUserValue) {
            await this.router.navigate([this.returnUrl]);
        }
    }

    get f() { return this.form.controls; }

    async onSubmit() {
        this.submitted = true;
        // reset alerts on submit
        this.alertService.clear();

        if (this.form.valid) {
            this.loading = true;
            const email = this.form.get('email')!.value;
            const password = this.form.get('password')!.value;
            this.authService.login(email, password).pipe(first())
                .subscribe(
                    data => {
                        this.router.navigate([this.returnUrl]);
                    },
                    error => {
                        this.alertService.error("errrror");
                        this.loading = false;
                    });
        }
    }
}
