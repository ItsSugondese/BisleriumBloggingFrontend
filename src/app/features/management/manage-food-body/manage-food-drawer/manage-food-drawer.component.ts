import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ManageFoodsService } from '../manage-foods/manage-foods-service/manage-foods.service';
import { Subscription } from 'rxjs';
import { FoodMenuWithImageData, foodMenu } from '../manage-foods/manage-foods-service/model/food-menu.model';
import { UserService } from '@shared/service/user-service/user.service';
import { CommonVariable } from '@shared/helper/inherit/common-variable';

@Component({
  selector: 'app-manage-food-drawer',
  templateUrl: './manage-food-drawer.component.html',
  styleUrls: ['./manage-food-drawer.component.scss']
})
export class ManageFoodDrawerComponent extends CommonVariable implements OnInit, OnDestroy {

  @Input() isOpenDrawer : boolean = false;
  @Output() onOpeningDrawer : EventEmitter<boolean> = new EventEmitter();
  
  editFoodIndex = 1
  feedbackIndex = 2
  selectedNavbar !: number
  navItem = 
    {[this.editFoodIndex]: "Food Details", [this.feedbackIndex]: "Feedback"}
    selectedFoodMenuSubscribable$ !: Subscription
  selectedFoodMenu !: FoodMenuWithImageData | null
  userRole !: string

    constructor(private foodService: ManageFoodsService, private userService: UserService){
      super()
    }

    ngOnInit(): void {
      this.userRole = this.userService.getSingleRole()!

      if(this.userRole == 'STAFF'){
        this.selectedNavbar =   this.feedbackIndex;
      }else{
        this.selectedNavbar = this.editFoodIndex;
      }

      this.selectedFoodMenuSubscribable$ = this.foodService.getSelectedFoodMenu().subscribe(
      (item) => {
        this.selectedFoodMenu = item == null? null :   item
      }
    )
  }

  onToggleDrawer(data: boolean){
    this.isOpenDrawer = data
    this.onOpeningDrawer.emit(data)
  }

  toggleDrawer(isOopen: boolean) {
    this.onOpeningDrawer.emit(isOopen)
  }
  
  isClicked(index: string){
    this.selectedNavbar = Number(index);
  }

  ngOnDestroy(): void {
    if(this.selectedFoodMenuSubscribable$){
      this.selectedFoodMenuSubscribable$.unsubscribe()
    }
  }
}
