import { first } from 'rxjs/operators';
import { Product } from '../_models/product';
import { ProductService } from '../_services/product.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatDialogConfig } from '@angular/material';
import {ProductDialog} from '../products/dialog/product.dialog';

@Component({
  styleUrls: ['home.component.css'],
  templateUrl: 'home.component.html',
})
export class HomeComponent implements OnInit {
  displayedColumns: string[] = ['select','name', 'price', 'serialNumber', 'description'];
  dataSource: MatTableDataSource<Product>;
  loading = false;
  selection = new SelectionModel<Product>(true, []);
  products: any[];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(public  productService: ProductService, public dialog: MatDialog) {
   
  }

  ngOnInit() {
    this.loading = true;
    this.productService.getAll().pipe(first()).subscribe(products => {
      this.dataSource = new MatTableDataSource(products);
      this.products = products;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.loading = false;
    });
   
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  protected addNewModal() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      formData: {  }
    };
    dialogConfig.minWidth = 700;
    dialogConfig.disableClose = true;
    const dialogRef = this.dialog.open(ProductDialog, dialogConfig);
    dialogRef.afterClosed().subscribe(
      data => {
        if (data) {
          let product = data as Product;
          this.dataSource.data.push(product);
          this.refreshTable();
          this.loadDataPage();
        }
      });
    dialogRef.backdropClick().subscribe(() => {
      if (!dialogRef.componentInstance.dialogForm.dirty) {
        dialogRef.close();
      }
    });
  }

  refreshTable() {
    if (this.dataSource.paginator) {
      if (this.dataSource.paginator.hasNextPage()) {
        this.dataSource.paginator.nextPage();
        this.dataSource.paginator.previousPage();
      } else if (this.dataSource.paginator.hasPreviousPage()) {
        this.dataSource.paginator.previousPage();
        this.dataSource.paginator.nextPage();
      }
    } else {
      this.dataSource.filter =  "";
      this.selection.clear();
    }
  }

  loadDataPage() {
    this.productService.getAll().subscribe((data: any) => {
            this.dataSource.data = data;
    });
  }


  deleteSelectedModal() {
    this.selection.selected.forEach(row =>
      this.productService.deleteEntity(row));

    this.selection.selected.forEach(row => {
      let foundIndex = this.dataSource.data.findIndex((x => x.id === row.id) as any);
      this.dataSource.data.splice(foundIndex, 1);
    });
    this.refreshTable();
  }
}
