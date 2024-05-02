import { Component, OnDestroy, OnInit } from '@angular/core';
import { Table, TableAddPayload } from './table-management-service/model/table.model';
import { ResponseData } from 'src/app/constant/data/response-data.model';
import { Observable, Subscription } from 'rxjs';
import { TableService } from './table-management-service/table.service';
import { CommonVariable } from '@shared/helper/inherit/common-variable';

@Component({
  selector: 'app-table-management',
  templateUrl: './table-management.component.html',
  styleUrls: ['./table-management.component.scss']
})
export class TableManagementComponent extends CommonVariable implements OnInit, OnDestroy {

  visible : boolean = false;
  qrVisible : boolean = false;
  deleteVisible : boolean = false;
  // tablesSubscription$ !: Observable<ResponseData<Table[]>>
  tableData !: Table[]
  tablesSubscription$ !: Subscription
  tableQrSubscription$ !: Subscription
  tableDeleteSubscription$ !: Subscription
  tableAddSubscription$ !: Subscription
  selectedTable !: Table
  imageData !: string | null
  tableNumberField !: number | null

  constructor(public tableService: TableService){
    super()
  }

  ngOnInit(): void {
    this.fetchTable()
  }
  
  fetchTable(){
    this.tablesSubscription$ = this.tableService.getAllTables().subscribe(
      (res) => {
        this.tableData = res.data
      }
    );
  }

  selectingTable(item: Table){
    this.selectedTable = item; 
    this.qrVisible = true

    this.tableQrSubscription$ = this.tableService.getQr(item.id).subscribe((imageBlob: Blob) => {


      this.createImageFromBlob(imageBlob, item.id)
       .then((imageData) => {
        this.imageData = imageData;
        
    })
    .catch((error) => {
        console.log("error when trying to access")
    });
    });
  }

  addTable(){
    let payload : TableAddPayload = {
      tableNumber: this.tableNumberField!
    }
    this.tableAddSubscription$ = this.tableService.addTable(payload).subscribe(
      (res) => {
        this.tableAddSubscription$.unsubscribe()
        this.fetchTable()
        this.visible = false;
      }
    )
  }

  deleteTable(id : number){
    this.tableDeleteSubscription$ = this.tableService.deleteTable(id).subscribe(
      (res) => {
        this.tableDeleteSubscription$.unsubscribe()
        this.deleteVisible = false;
      this.fetchTable()
      }
    )
  }

  downloadImage(dataString: string, table: Table) {
    // Convert Base64 string to Blob
    let splitString: string[] = dataString.split(',', 2); 
    let secondHalf: string = splitString.length > 1 ? splitString[1] : '';

    const byteCharacters = atob(secondHalf);
    const byteNumbers = new Array(byteCharacters.length);



    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/png' });

    // Create object URL
    const url = URL.createObjectURL(blob);

    // Create anchor element
    const a = document.createElement('a');
    a.href = url;
    a.download = `Table_Number_${this.selectedTable.tableNumber}.png`; 

    // Trigger download
    a.click();

    // Clean up
    URL.revokeObjectURL(url);
  }

  ngOnDestroy(): void {
      if(this.tablesSubscription$){
        this.tablesSubscription$.unsubscribe()
      }
  }


}
