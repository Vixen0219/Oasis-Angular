import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AccountModel } from 'src/app/model/account.model';
import { ResponseModel } from 'src/app/model/response.model';
import { UpdateAccountModel } from 'src/app/model/update-account.model';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ReactiveFormService } from 'src/app/services/reactive-form.service';
import { SharedMethodsService } from 'src/app/services/shared-methods.service';
import { SharedVarService } from 'src/app/services/shared-var.service';
@Component({
  selector: 'app-deposits',
  templateUrl: './deposits.component.html',
  styleUrls: ['./deposits.component.css']
})
export class DepositsComponent implements OnInit {

  private subscriptions: Subscription = new Subscription();

  public depositControl: FormControl;
  public accountModelInput: AccountModel;
  @Output() onSelectTrxMenu: EventEmitter<string>;
  
  constructor(
    private sharedVar: SharedVarService, 
    private sharedMethods: SharedMethodsService, 
    public reactiveFormService: ReactiveFormService, 
    private authService: AuthService, 
    private apiService: ApiService,
    private router: Router) 
  { 
    this.onSelectTrxMenu = new EventEmitter<string>();
  }

  ngOnInit(): void {
    this.accountModelInput = this.authService.getRetrievedAccDetails();
    this.depositControl = this.reactiveFormService.initializeDepositFormControl();
  }

  navToTrxHistMenu(){
    this.onSelectTrxMenu.emit(this.sharedVar.NAV_MENU_SELECT_TRX_HIST);
  }

  fieldIsInvalid(field: AbstractControl): boolean {
    return this.reactiveFormService.fieldIsInvalid(field);
  }

  onCancelDeposit(){
    this.depositControl.setValue(null);
  }

  onConfirmDeposit(){
    if(this.depositControl.valid){
      console.log("deposit amount success!");
      const depositAmount: number = parseFloat(this.depositControl.value);
      let accountModel: AccountModel = new AccountModel();
      accountModel = this.authService.getRetrievedAccDetails();
      accountModel.depositAmt = depositAmount;
      this.sharedVar.updateAccountModel.account = accountModel;
      this.subscriptions.add(
        this.apiService.updateAccDetails().subscribe( (resp: ResponseModel) => {
          if (resp.statusCode != 0) {
            // this.errorMsg = resp.resultMessage;
            // resp.resultMessage = "";
          } else {
            //his.sharedVar.changeResponse(resp);
            this.navToAccOverView();
          }
        } ,
          error => {
          this.sharedVar.changeException(error);
        })
      );
    } else{
      console.log("deposit amount failed!");
      this.reactiveFormService.displayValidationErrors(this.depositControl);
    }
  }

  navToAccOverView() {
    this.router.navigate(['account']);
  }
}
