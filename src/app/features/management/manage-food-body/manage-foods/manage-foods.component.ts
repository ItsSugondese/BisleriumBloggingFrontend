import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '@shared/service/user-service/user.service';
import { Subscription } from 'rxjs';
import { CommonVariable } from 'src/app/shared/helper/inherit/common-variable';
import { EnumService } from 'src/app/shared/service/enum-service/enum.service';
import { SidenavService } from 'src/app/shared/ui/nav/sidenav/sidenav-service/sidenav.service';
import { SnackbarService } from 'src/app/templates/snackbar/snackbar-service/snackbar.service';
import { AddFoodService } from '../manage-food-drawer/add-food/add-food-service/add-food.service';
import { ManageFoodsService } from './manage-foods-service/manage-foods.service';
import { FoodMenuWithImageData, foodMenu } from './manage-foods-service/model/food-menu.model';
import { FoodMenuPagination } from './manage-foods-service/model/food-menu.payload';




@Component({
  selector: 'app-manage-foods',
  templateUrl: './manage-foods.component.html',
  styleUrls: ['./manage-foods.component.scss']
})
export class ManageFoodsComponent extends CommonVariable implements OnInit, OnDestroy {

  @Output() onOpeningDrawer : EventEmitter<boolean> = new EventEmitter();

  open : boolean = false;


  mapValues: { [key: string]: boolean | null } = {
    'All': null,
    'Available': true,
    'Not Available': false
  };

  
  
  searchData!: string;
  navbarCollapse$ !: Subscription;
  collapsed !: boolean;

  foodMenuFetch$ !: Subscription;
  foodMenu : foodMenu[] = [];
  getFoodPicture$ !: Subscription;
  toggleAvailableToday$ !: Subscription;
  imageDataMap: { [key: number]: string } = {};
  
  foodMenuPagination : FoodMenuPagination = {
    page: 1,
    row: 10,
  }

  
  selectedFoodMenuType : string | null = "ALL"

  constructor(public foodService : ManageFoodsService,
    private formBuilder : FormBuilder, private router: Router,
    private sideNavService: SidenavService, private enumService: EnumService,
    private addFoodService: AddFoodService, private snackService: SnackbarService,
    public userService: UserService
    ) {
      super()
    }

    
  ngOnInit(): void {
    this.addFoodService.setIsSaved(false)
    
    this.navbarCollapse$ =  this.sideNavService.getCollapsed().subscribe((collapsed) => {
      this.collapsed = collapsed;
    });
    
    this.addFoodService.getIsSaved().subscribe(
      (result) => {
        this.getFoodMenu()
      }
      )
      this.getFoodMenu()
    }
    
    
    


    handleCheckboxChange(item: foodMenu, index: number, event: any){ 
    const isChecked = event.target.checked;
    console.log(isChecked)
    this.toggleAvailableToday$ = this.foodService.toggleFoodMenu({
      foodId: item.id,
      status: isChecked
    }, index).subscribe(
      (response: any) => {
          this.foodMenu[index].isAvailableToday = isChecked
        this.toggleAvailableToday$.unsubscribe()
      }
    )  
  }

  selectedFromFoodFilter(event: string | null){
    this.selectedFoodMenuType = event
    this.getFoodMenu()
  }
  
  
  typedFoodToFilter(event: string){
    if(event.trim() != ''){
      this.foodMenuPagination.name = event
    }else{
      this.foodMenuPagination.name = undefined
    }
    this.getFoodMenu()
  }
  
  
  toggleFormToEdit(item : foodMenu | null){
    let val !: FoodMenuWithImageData | null;
    
    if(item == null){
      val = null
    }else {
      val = {
        foodMenu: item,
        image: this.imageDataMap[item.photoId]
      }
    }
      this.foodService.sendSelectedFoodMenu(val)
    }
    
    onInputChange(val: boolean | null){
      this.foodMenuPagination.filter = val
      this.getFoodMenu()
    }
  
  

    toggleDrawer(isOopen : boolean){
      this.onOpeningDrawer.emit(isOopen)
    }


   getFoodMenu(){
    
  //   if(this.selectedFoodMenuType == 'ALL'){
  //     this.foodMenuPagination.foodType = undefined
  //   }else{
  //   this.foodMenuPagination.foodType = this.selectedFoodMenuType
  // }
    
  //   this.foodMenuFetch$ = this.foodService.getFoodMenuPaginated(this.foodMenuPagination).subscribe(
  //     (response ) => {
        
  //       this.foodMenu = response.data.content;

  //       this.foodMenu.forEach((menu) => {
  //         if(menu.photoId){
  //           this.getFoodPicture$ = this.foodService.getFoodPicture(menu.photoId).subscribe((imageBlob: Blob) => {


  //           this.createImageFromBlob(imageBlob, menu.photoId)
  //            .then((imageData) => {
  //             this.imageDataMap[menu.photoId] = imageData;
              
  //         })
  //         .catch((error) => {
  //             console.log("error when trying to access")
  //         });
  //         });
  //       }
  //       }); 
  //     }
  //   )
  }


  ngOnDestroy(): void {
    if(this.foodMenuFetch$){
      this.foodMenuFetch$.unsubscribe();
    }
    if(this.getFoodPicture$){
      this.getFoodPicture$.unsubscribe();
    }
    if(this.navbarCollapse$){
      this.navbarCollapse$.unsubscribe();
    }
    if(this.toggleAvailableToday$){
      this.toggleAvailableToday$.unsubscribe()
    }
  }
}
