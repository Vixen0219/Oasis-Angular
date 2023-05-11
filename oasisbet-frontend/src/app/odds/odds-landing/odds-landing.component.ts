import { Component, OnInit, ViewChild } from '@angular/core';
import { OddsSideNavComponent } from '../odds-side-nav/odds-side-nav.component';
import { SharedVarService } from 'src/app/services/shared-var.service';
import { BetEvent } from 'src/app/model/bet-event.model';
import { H2HEventOdds } from 'src/app/model/h2h-event-odds.model';
import { Subscription, forkJoin } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { take } from 'rxjs/operators';

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

  public responseMsg: string = '';

  constructor(public sharedVar: SharedVarService,
    public apiService: ApiService) {
    this.competitionTypeHdr = this.sharedVar.COMP_HEADER_EPL;
  }

  ngOnInit(): void {
    this.subscriptions.add(
        this.apiService.retrieveOdds(this.compType).subscribe((resp: any) => {
          this.events = resp.betEvent;

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

}
