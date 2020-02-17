import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RegisterComponent } from './login/register.dialog/register.component';
import { AppComponent } from './app.component';
import { appRoutingModule } from './app.routing';
import { UserHomeComponent } from './home/user.home.component';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './_helpers/material.module';
import { TextMaskModule } from 'angular2-text-mask';
import { UserService } from './_services/user.service';
import { ProductDialog } from './products/dialog/product.dialog';
import { ProductService } from './_services/product.service';
import { CartComponent } from './cart/cart.component';

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    appRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    TextMaskModule
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    UserHomeComponent,
    ProductDialog,
    CartComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    UserService,
    ProductService
  ],
  bootstrap: [AppComponent],
  entryComponents: [RegisterComponent, ProductDialog]
})
export class AppModule { }
