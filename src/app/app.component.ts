import { Component, OnInit, Input } from '@angular/core';
import { Product } from './product';
import { ProductService } from './productservice';
import { ConfirmationService, SelectItem } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [
    `
        :host ::ng-deep .p-dialog .product-image {
            width: 150px;
            margin: 0 auto 2rem auto;
            display: block;
        }
    `,
  ],
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  statuses: SelectItem[];
  loading: Boolean;
  currentUserId: String;
  isRowEditable: Boolean = false;
  isButtonDisabled: Boolean = true;
  products: any[];
  clonedUsers: {
    // @ts-ignore
    [s: string]: User;
  } = {};
  programOptions: any[];

  constructor(
    private productService: ProductService,
    private messageService: MessageService,
    private confirmation: ConfirmationService
  ) {}

  ngOnInit() {
    this.currentUserId = sessionStorage.getItem('userId');
    this.getTableData();
  }

  getTableData() {
    this.loading = true;
    this.productService.getProducts().then((data) => {
        console.log(data)
      this.products = data;
      this.loading = false;
      this.isRowEditable = false;
      this.isButtonDisabled = false;
    });
  }

  clear(table: Table) {
    table.clear();
    table.reset();
    table.filters = {};
    table.reset();
  }

  newRow() {
    return {
      id: 0,
      name: '',
    };
  }

  newRowAdd(table: Table) {
    this.isRowEditable = true;
    this.clear(table);
  }

  show(summary: String, details: String, severity: string) {
    this.messageService.add({
      severity,
      summary: summary + '!',
      detail: details + '',
    });
  }

  onRowEditInit(coverpageinfo: any) {
    const id: any = coverpageinfo.id;
    this.clonedUsers[id] = { ...coverpageinfo };
    this.isRowEditable = true;
  }

  onRowEditCancel(coverpageinfo: any, index: number, table: Table) {
    if (coverpageinfo.id > 0) {
    } else {
      table.value.splice(index, 1);
    }

    this.isRowEditable = false;
  }

  onRowEditSave(user: any, table: Table) {
    this.isRowEditable = false;
  }

  private onRowDeleteInit(event: Event, id: any, cdsid: string) {
    this.products = this.products.filter((x) => x.id !== id);
    /* this.confirmation.confirm({
      target: event.target,
      message:
        'Are you sure that you want to delete user with cdsid  ' +
        cdsid.toUpperCase() +
        ' ?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.userService
          .delete(id)
          .pipe(first())
          .subscribe(() => {
            this.users = this.users.filter((x) => x.userAccessId !== id);
            this.loading = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'User Deleted Successfully',
            });
            this.isRowEditable = false;
          });
      },
      reject: () => {
         
      },
    }); */
  }
}
