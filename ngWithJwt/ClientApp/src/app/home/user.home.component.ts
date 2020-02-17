import { HomeComponent } from "../home/home.component";
import { Component} from '@angular/core';

@Component({
  selector:  'user-home-component',
  templateUrl: 'user.home.component.html',
})
export class UserHomeComponent extends  HomeComponent {


  buy(product) {
    this.productService.buy(product).subscribe(() => {
      this.productService.showSnackBar("Product added to product card!", "green");
    });
  }
}
