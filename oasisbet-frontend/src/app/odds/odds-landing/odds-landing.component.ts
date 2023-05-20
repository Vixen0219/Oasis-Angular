import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { SharedVarService } from 'src/app/services/shared-var.service';
import { BetEvent } from 'src/app/model/bet-event.model';
import { H2HEventOdds } from 'src/app/model/h2h-event-odds.model';
import { Subscription, forkJoin } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { take } from 'rxjs/operators';
import { H2HBetSelection } from 'src/app/model/h2h-bet-selection.model';
import { BetSlip } from 'src/app/model/bet-slip.model';

@Component({
  selector: 'app-odds-landing',
  templateUrl: './odds-landing.component.html',
  styleUrls: ['./odds-landing.component.css']
})
export class OddsLandingComponent implements OnInit {

  public subscriptions: Subscription = new Subscription();

  compType: string = this.sharedVar.API_SOURCE_COMP_TYPE_EPL;
  competitionTypeHdr: string;
  public events : BetEvent[];
  public eventDates: string[];
  public eventsMap: Map<string, BetEvent[]> = new Map();

  @Output() betEventClicked = new EventEmitter<BetSlip[]>();
  public selectedBets : BetSlip[] = new Array();

  public responseMsg: string = '';

  constructor(public sharedVar: SharedVarService,
    public apiService: ApiService) {
    this.competitionTypeHdr = this.sharedVar.COMP_HEADER_EPL;
  }

  ngOnInit(): void {
    this.subscriptions.add(
        this.apiService.retrieveOdds(this.compType).subscribe((resp: any) => {
          this.events = resp.betEvent;

          //initiliase H2HBetSelection object and save to all events
          this.events.map(event => {
            const initBetSelection = new H2HBetSelection();
            event.betSelection = initBetSelection;
          });

          //convert json response from String to Date format
          this.events.map(event => event.startTime = new Date(event.startTime));

          //save unique event dates from all events retrieved
          this.eventDates = Array.from(new Set(this.events.map(event => {
            return event.startTime.toDateString();
          })));

          //save into a event map with unique event dates after retrival of events -> (Date string, BetEvents[])
          this.eventDates.forEach(dateString => {
            const eventsDetails = this.events.filter(event => event.startTime.toDateString() === dateString);
            this.eventsMap.set(dateString, eventsDetails);
          });
        } ,
          error => {
          console.log(error);
          this.sharedVar.changeException(error);
        }
      )
    );

    //get response success message after creating user
    this.subscriptions.add(
        this.sharedVar.responseSource.pipe(take(1))
        .subscribe(resp => {
          if(resp){
            this.responseMsg = resp.resultMessage;
            resp.resultMessage = "";
          }
        }
      )
    )

  }

  readCompType(competitionName: string){
    this.compType = competitionName;
    this.competitionTypeHdr = this.sharedVar.retrieveCompHdr(this.compType);
    this.ngOnInit();
  }

  selectBetSelection(event: BetEvent, selection: number){
    let addingBetSelection = false;
    let odds: number = 0;
    if(selection === 1){
      event.betSelection.homeSelected = !event.betSelection.homeSelected;
      addingBetSelection = event.betSelection.homeSelected;
      odds = event.h2hEventOdds.homeOdds;
    } else if(selection === 2){
      event.betSelection.drawSelected = !event.betSelection.drawSelected;
      addingBetSelection = event.betSelection.drawSelected;
      odds = event.h2hEventOdds.drawOdds;
    } else {
      event.betSelection.awaySelected = !event.betSelection.awaySelected;
      addingBetSelection = event.betSelection.awaySelected;
      odds = event.h2hEventOdds.awayOdds;
    }

    let betSlip = new BetSlip();
    betSlip.eventId = event.eventId;
    betSlip.eventDesc = event.eventDesc;
    betSlip.betType = 1;
    betSlip.betSelection = selection;
    betSlip.betSelectionName = "Chelsea";
    betSlip.odds = odds;

    if(addingBetSelection){
      this.selectedBets.push(betSlip);
      this.selectedBets = [...this.selectedBets];
    } else {
      this.selectedBets = this.selectedBets.filter(e => !(e.eventId === betSlip.eventId && e.betSelection === betSlip.betSelection));
    }
    this.betEventClicked.emit(this.selectedBets);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}
