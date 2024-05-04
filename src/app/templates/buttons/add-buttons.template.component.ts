import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';


@Component({
  selector: 'add-button-template',
  template: `
 <div
          class="flex ml-5 hover:cursor-pointer bg-customPrimary items-center text-white rounded-lg pr-2 pl-1 py-1.5 text-base"
          (click)=" clicked.emit()">
          <mat-icon class="mr-1">add</mat-icon>
          <button class="">{{text}}</button>
        </div>
  `,
  styles: [
],
})
export class AddButtonComponent{

  @Input() text !: string
  @Output() clicked : EventEmitter<void> = new EventEmitter<void>()

    constructor() { }
  
    
}
