import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product } from "../_models/product";
import { MatSnackBar } from '@angular/material';

@Injectable({ providedIn: 'root' })
export class ProductService {
  baseUrl: string;

  constructor(
    protected http: HttpClient,
    public snackBar: MatSnackBar) {
  }

  getAll() {
    return this.http.get<Product[]>(`${environment.apiUrl}/api/product`);
  }

  getCart() {
    return this.http.get<any>(`${environment.apiUrl}/api/cart`);
  }


  addProduct(form: any): Observable<number | string> {
    const uri = environment.apiUrl + "/api/product";
    return new Observable(
      observer => {
        this.http.post(uri, form)
          .subscribe((response: number) => {
              observer.next(response);
            },
            error => {
              console.log(error);
              observer.next(error.error);
            },
            () => { observer.complete(); }
          );
      });
  }

  deleteEntity(item) {
    this.http.delete(environment.apiUrl + "/api/product", item);
  }

  buy(product) {
    const uri = environment.apiUrl + "/api/cart";
    return new Observable(
      observer => {
        this.http.post(uri, product)
          .subscribe((response: number) => {
              observer.next(response);
            },
            error => {
              console.log(error);
              observer.next(error.error);
            },
            () => { observer.complete(); }
          );
      });
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
}
