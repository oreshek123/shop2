import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product } from "../_models/product";

@Injectable({ providedIn: 'root' })
export class UserService {
  baseUrl: string;

  constructor(
    protected http: HttpClient) {
  }

  isUsernameUnique(form: any): Observable<boolean | string> {
      const uri = environment.apiUrl + "/api/user/IsUniqueUserName";
      return new Observable(
        observer => {
          this.http.post(uri, form)
            .subscribe((response: boolean) => {
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

    addUser(form: any): Observable<number | string> {
      const uri = environment.apiUrl + "/api/user/Register";
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
}
