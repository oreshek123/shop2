import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ValidationErrors, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { BehaviorSubject, Subscription, Observable, forkJoin } from 'rxjs';
import { take, debounceTime, delay, switchMap, map, distinctUntilChanged, tap } from 'rxjs/operators';
import { Product } from '../../_models/product';
import {ProductService} from '../../_services/product.service';

export const successMessage = "Выполнено успешно";

@Component({
  templateUrl: './product.dialog.html'
})
export class ProductDialog implements OnInit {

  description: string;
  dialogForm: FormGroup;
  loading$ = new BehaviorSubject<boolean>(false);
  loadCompleted$ = new BehaviorSubject<boolean>(false);

  product: Product;

  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) { formData }: any,
    private dialogRef: MatDialogRef<ProductDialog>,
    public dialog: MatDialog,
    private service: ProductService) {
    this.product = formData;
  }

  ngOnInit() {
    this.description = "Product";

    this.loadCompleted$.next(true);
    this.dialogForm = this.formBuilder.group({
      id: [0, [Validators.required]],
      name: [this.product ? this.product.name : null, [Validators.required]],
      price: [this.product ? this.product.price : 0, [Validators.required]],
      description: [this.product ? this.product.description : null, [Validators.required]],
      serialNumber: [this.product ? this.product.serialNumber : null, [Validators.required]],
    });

  }

  close() {
    this.dialogRef.close();
  }

  save() {
    if (this.dialogForm.valid) {
      this.loading$.next(true);
      this.service.addProduct(this.dialogForm.value).subscribe(res => {
        if (res > 0) {
          this.service.showSnackBar(successMessage, "green");
          this.dialogForm.get("id").setValue(res);
          this.dialogRef.close(this.dialogForm.value);
        } else if (typeof res === "string") {
          this.service.showSnackBar(`Ошибка: ${res}`, "error");
        } else
          this.service.showSnackBar(`Ошибка: не удалось сохранить данные`, "error");
        this.loading$.next(false);
      });
    }
  }
}
