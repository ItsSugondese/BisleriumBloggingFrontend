import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { OrderCommonVariable } from '@shared/helper/inherit/order/order-common-variable';
import { Subscription } from 'rxjs';
import { PaginatedData } from 'src/app/constant/data/pagination/pagination.model';
import { defaultPaginationNavigator } from 'src/app/shared/model/pagination/pagination.model';
import { ManageFoodsService } from '../../manage-food-body/manage-foods/manage-foods-service/manage-foods.service';
import { onlineOrder } from './online-orders-service/model/online-order-interface';
import { onlineOrderPagination } from './online-orders-service/model/online-orders-payload.model';
import { OnlineOrdersService } from './online-orders-service/online-orders.service';
import { AutoCompleteCompleteEvent, AutoCompleteOnSelectEvent, AutoCompleteUnselectEvent } from 'primeng/autocomplete';
import { FoodMenuPagination } from '../../manage-food-body/manage-foods/manage-foods-service/model/food-menu.payload';
import { foodMenu } from '../../manage-food-body/manage-foods/manage-foods-service/model/food-menu.model';
import { foodOrderPayload, onlineOrderPayload } from 'src/app/payload.interface';
import { DatePipe } from '@angular/common';
import { orderedFood } from '../order.model';
import { ManageOrdersNavbarService } from '../manage-orders-navbar/manage-orders-navbar-service/manage-orders-navbar.service';
declare var $: any;

@Component({
  selector: 'app-online-orders',
  templateUrl: './online-orders.component.html',
  styleUrls: ['./online-orders.component.scss']
})
export class OnlineOrdersComponent extends OrderCommonVariable implements OnInit, OnDestroy, OnChanges {

  @Input() searchedText : string | undefined
  isChange : boolean = false
  addingOrder: boolean = false;
  editOrderPopUp: boolean = false
  paginatedData !: PaginatedData<onlineOrder>
  paginationNavigator: defaultPaginationNavigator = {
    currentPage: 1,
    row: 1,
  }
  selectedOrder !: onlineOrder
  paginationJson !: onlineOrderPagination
  fromTime = new Date();
  getOrderSubscriable$ !: Subscription
  foodMenuFetch$ !: Subscription
  addFoodMenu$ !: Subscription
  makeOnsite$ !: Subscription
  getFoodPicture$ !: Subscription
  deleteOrderFood$ !: Subscription
  imageDataMap: { [key: number]: string } = {};
  foodImageDataMap: { [key: number]: string } = {};
  foodMenuPagination: FoodMenuPagination = {
    page: 1,
    row: 10,
    filter: true,
  }
  
  items: any[] | undefined;
  
  selectedItem !: {
    name: string,
    photo: string
  } | null;

  selectedFood !: {
    id: number | null,
    name: string,
    price: number
  } | null

  suggestions !: any[];
  quantity: number = 0


  constructor(public onlineOrdersService: OnlineOrdersService, private foodService: ManageFoodsService,
    private datePipe: DatePipe, private orderService: ManageOrdersNavbarService) {
    super()
  }
  
  
 
  
  ngOnInit(): void {
    this.getPaginatedData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.searchedText) {
        if (!this.paginationJson) {
          this.paginationJson = {
            row: this.selectedRow,
            page: 1,
            minDifference : this.orderService.timeDifference,
          }
        }
        this.paginationJson.name = changes.searchedText.currentValue;
        this.getPaginatedData();
      
    }
  }
    


  search(event: AutoCompleteCompleteEvent) {
    this.foodMenuPagination.name = event.query
    this.getFoodMenu()
  }
  
  selected(event: AutoCompleteOnSelectEvent) {
    this.selectedFood = {
      id: event.value.id,
      name: event.value.name,
      price: event.value.price
    }
    // this.selectedFoodId = event.value.id
  }

  checkValue(event: KeyboardEvent) {
    if (this.selectedFood != null && this.selectedFood!.id != null) {
      if (this.selectedItem!.name = this.selectedFood.name) {
        this.selectedFood!.id = null
      }
    }
  }

  unSelect() {
    this.selectedFood!.id = null
  }


  deleteOrderFood(orderedFood: orderedFood){
    this.deleteOrderFood$ = this.onlineOrdersService.deleteOrderFoodById(orderedFood.id).subscribe(
      (res) => {
        this.isChange = true
        
        const index = this.selectedOrder.orderFoodDetails.indexOf(orderedFood);
            if (index > -1) {
                this.selectedOrder.orderFoodDetails.splice(index, 1);
            }
      
      }
    )

  }

  makeOnsite(id: number){
    this.makeOnsite$ = this.onlineOrdersService.makeOnsite(id).subscribe(
      (res) => {
        this.getPaginatedData()
        this.makeOnsite$.unsubscribe()
      }
    )
  }

  dialogHide(){
    this.addingOrder = false
    if(this.isChange){
      this.getPaginatedData()
    }
    this.setToZero()
  }
  selectedOrderTypeToFilter(event: string | null) {
    // this.onlineOrdersService.selectedOption = event!
    // this.paginationJson.onsiteOrderFilter = event!;

    this.getPaginatedData()
  }


  typedOrderToFilter(event: string) {
    if(event.trim() != ''){
      this.paginationJson.name = event
    }else{
      this.paginationJson.name = undefined
    }
    this.getPaginatedData()
  }


  onTableDataChange(event: any) {
    this.paginationNavigator.currentPage = event
    this.getPaginatedData();

  }



  addFood(){
    let foodList : foodOrderPayload[] = [] 
    foodList.push({
      foodId: this.selectedFood!.id!,
      quantity: this.quantity,
      id : null
    })
    
    let totalPrice = this.selectedOrder.totalPrice + this.selectedFood!.price
  
    let orderPayload : onlineOrderPayload = {
      id: this.selectedOrder.id,
      arrivalTime : this.convertTimeTo24HourFormat(this.selectedOrder.arrivalTime),
      foodOrderList : foodList,
      removeFoodId : [],
      totalPrice : totalPrice
    }
    this.addFoodMenu$ = this.onlineOrdersService.postOnlineOrder(orderPayload).subscribe(
      (response) => {
          this.selectedOrder.orderFoodDetails = response.data.orderFoodDetails
          this.isChange = true
        
      }
    )
    this.setToZero()
  }



  getPaginatedData() {
    this.getOrderSubscriable$ = this.onlineOrdersService.getData(
      this.paginationJson).subscribe(
        (response) => {
          this.paginatedData = response.data
          this.paginatedData.content.forEach((order) => {
            order.orderFoodDetails.forEach((foodDetails) => {

              if (foodDetails.photoId) {
                this.getFoodPicture$ = this.foodService.getFoodPicture(foodDetails.photoId).subscribe((imageBlob: Blob) => {


                  this.createImageFromBlob(imageBlob, foodDetails.photoId)
                    .then((imageData) => {
                      this.imageDataMap[foodDetails.photoId] = imageData;

                    })
                    .catch((error) => {
                      console.log("error when trying to access")
                    });
                });
              }
            }

            )
          });
        }
      )

      this.isChange = false
  }

  getFoodMenu() {

    // this.foodMenuFetch$ = this.foodService.getBlogPaginated(this.foodMenuPagination).subscribe(
    //   (response) => {
    //     let foodMenuPaginated: PaginatedData<foodMenu> = response.data;

    //     let menu = foodMenuPaginated.content
    //     for (let i = 0; i < menu.length; i++) {
    //       if (menu[i].photoId) {
    //         this.getFoodPicture$ = this.foodService.getFoodPicture(menu[i].photoId).subscribe((imageBlob: Blob) => {


    //           this.createImageFromBlob(imageBlob, menu[i].photoId)
    //             .then((imageData) => {
    //               this.foodImageDataMap[menu[i].photoId] = imageData;
    //               if (i == menu.length - 1) {
    //                 this.suggestions = response.data.content.map((item: foodMenu) => ({
    //                   name: item.name,
    //                   photo: this.foodImageDataMap[item.photoId],
    //                   id: item.id,
    //                   price: item.cost
    //                 }));
    //               }

    //             })
    //             .catch((error) => {
    //               console.log("error when trying to access")
    //             });
    //         });
    //       } else {
    //         if (i == menu.length - 1) {
    //           this.suggestions = response.data.content.map((item: foodMenu) => ({
    //             name: item.name,
    //             photo: this.foodImageDataMap[item.photoId],
    //             id: item.id
    //           }));
    //         }
    //       }

    //     }
    //   }
    // )
  }

  convertTimeTo24HourFormat(time: string): string {
    const parsedTime = new Date('01/01/2000 ' + time);
    
    // Use DatePipe to format the Date object into 24-hour format
    return this.datePipe.transform(parsedTime, 'HH:mm')!;
  }

  setToZero(){
    this.quantity = 0
    if(this.selectedItem != null){
      this.selectedItem.name = ''
    }
    this.selectedItem = null
    this.addingOrder = false
    this.selectedFood = null
  }

  ngOnDestroy(): void {
    if (this.getOrderSubscriable$) {
      this.getOrderSubscriable$.unsubscribe();
    }
    if (this.getFoodPicture$) {
      this.getFoodPicture$.unsubscribe()
    }
    if(this.addFoodMenu$){
      this.addFoodMenu$.unsubscribe()
    }
    if(this.makeOnsite$){
      this.makeOnsite$.unsubscribe()
    }
  }
}
