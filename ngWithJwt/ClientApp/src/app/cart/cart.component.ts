import { first } from 'rxjs/operators';
import { Product } from '../_models/product';
import { ProductService } from '../_services/product.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ProductDialog } from '../products/dialog/product.dialog';
import { BehaviorSubject, Observable, forkJoin } from "rxjs";

@Component({
  selector: 'cart-component',
  templateUrl: 'cart.component.html',
})
export class CartComponent implements OnInit {
  cartItems: any[];
  total: any;
  loading$ = new BehaviorSubject<boolean>(false);

  constructor(private service: ProductService) {}
  ngOnInit() {
    this.getCart();
  }

  getCart() {
    this.loading$.next(true);
    this.service.getCart().subscribe(res => {
      this.cartItems = res.cart;
      this.total = res.total;

      this.loading$.next(false);

    });
  }


}

