import React, { useEffect, useState } from "react";
import './OddsBetSlip.css';
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";

export default function OddsBetSlip({onBetSlipUpdate}){
    const dispatch = useDispatch();

    const betEvents = useSelector((state: any) => state.betSlip);
    const reducerAction = useSelector((state: any) => state.action);
    const [responseMsg, setResponseMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [betSlipSelections, setBetSlipSelections] = useState([]) as any;
    const [showSingles, setShowSingles] = useState(true);
    const [totalStake, setTotalStake] = useState(0);
    const [placeBetStatus, setPlaceBetStatus] = useState('I'); // I -> Init, C -> Confirm, D -> Done

    console.log("betEvents: ", betEvents);
    console.log("reducerAction: ", reducerAction);

    const BET_STATUS_FLAG = true;

    useEffect(() => {
        setBetSlipSelections(() => {
            if (reducerAction === 'ADD') {
                setResponseMsg('');
                setErrorMsg('');
                setPlaceBetStatus('I');
            }
            return betEvents;
        });
    }, [betEvents, reducerAction]);

    function handleClickSingles(): void {
        setShowSingles(prevState => !prevState);
    }

    function handleOnDelete(betEvent): void {
        let updateBetEvents = [...betSlipSelections];
        updateBetEvents = updateBetEvents.filter(e => !(e.eventId === betEvent.eventId && e.betSelection === betEvent.betSelection));
        onBetSlipUpdate(betEvent);
        dispatch({type: 'REMOVE_BET_SELECTION', payload: updateBetEvents});
    }

    function handleChangeBetAmount(betEvent, event){
        const regex = /^(?!0\d*$)\d{1,4}(?:\.\d{0,2})?$/;
        let amount = event.target.value;
        if(!regex.test(amount)){
            betEvent.betAmount = null;
            betEvent.potentialPayout = 0;
        } else {
            amount = +amount;
            betEvent.betAmount = amount;
            const odds = +betEvent.odds;
            betEvent.potentialPayout = +(odds * amount).toFixed(2);
        }
        
        let updatedTotalStake = 0;
        const updatedBetSlip = betSlipSelections.map(betSelection => {
            updatedTotalStake += betSelection.betAmount;
            if(betSelection.eventId === betEvent.eventId && betSelection.betSelection === betEvent.betSelection){
                return betEvent;
            }
            return betSelection;
        });
        setBetSlipSelections(updatedBetSlip);
        setTotalStake(updatedTotalStake);
    }

    function handleClickPlaceBet(): void {
        const betSelectionsWithNoAmt = betSlipSelections.filter(e => e.betAmount === 0 || e.potentialPayout === 0);
        let updateBetEvents = [...betSlipSelections];
        betSelectionsWithNoAmt.forEach(removeSelection => {
            updateBetEvents = updateBetEvents.filter(e => !(e.eventId === removeSelection.eventId && e.betSelection === removeSelection.betSelection));
            onBetSlipUpdate(removeSelection);
            dispatch({type: 'REMOVE_BET_SELECTION', payload: updateBetEvents});
        });
        setPlaceBetStatus("C");
    }

    function handleClickDecline(): void {
        setPlaceBetStatus("I");
    }

    function handleClickConfirmBet(): void {
        dispatch({type: 'CLEAR_BET_SELECTION'});
        setPlaceBetStatus("D");
        if(BET_STATUS_FLAG){
            setResponseMsg("Bet successfully placed!");
        } else {
            setErrorMsg("There is an error with the process");
        }
        
    }

    return (
        betSlipSelections.length > 0 && 
        <div className="bet-slip">
            <h2 className="bet-slip-header">Bet Slip</h2>
            {responseMsg && <div className="alert alert-success"><b>Success: </b>{responseMsg}</div>}
            {errorMsg && <div className="alert alert-danger"><b>Fail: </b>{errorMsg}</div>}
            <div className="header-panel">
                <h3 className="panel-header" onClick={handleClickSingles}>Singles
                    <span className="dropdown-icon">
                        <FontAwesomeIcon icon={faAngleDown} />
                    </span>
                </h3>
                <br />
                {showSingles && 
                    <div className="selections">
                        <div className="bet-slip-container">
                            <div className="container">
                                {betSlipSelections.map(betEvent => {
                                    return (
                                        <div key={betEvent.eventId + '_' + betEvent.betSelection}>
                                            <div className="row">
                                                <div className="col-md-10">
                                                    <p className="event-description">{betEvent.eventDesc}</p>
                                                </div>
                                                {placeBetStatus !== 'D' &&  
                                                    <div className="col-md-2" onClick={() => handleOnDelete(betEvent)}>
                                                        <p className="delete-icon">&#10005;</p>
                                                    </div>
                                                }
                                            </div>
                                            <div className="row">
                                                <p className="bet-type">1X2</p>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-8">
                                                    <p className="bet-selection">{betEvent.betSelectionName} @ {betEvent.odds}</p>
                                                </div>    
                                                <div className="col-md-4">
                                                    {placeBetStatus === 'I' && 
                                                        <span className="bet-amount-input">
                                                            $<input type="text" maxLength={7} inputMode="numeric"
                                                                value={betEvent.betAmount !== null ? betEvent.betAmount : ''}
                                                                onChange={(event) => handleChangeBetAmount(betEvent, event)}/>
                                                        </span>
                                                    }
                                                    {placeBetStatus !== 'I' && betEvent.potentialPayout !== 0 &&
                                                        <span className="pull-right" style={{float: 'right'}}>
                                                            $  {betEvent.betAmount}
                                                        </span>
                                                    }
                                                </div>    
                                            </div>
                                            <hr />
                                            <div className="row">
                                                <p className="potential-payout-text">Potential Payout: ${betEvent.potentialPayout.toFixed(2)}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                                
                            </div>
                            <br/>
                        </div>
                    </div>
                }

                <div className="total-stake-panel">
                    <span className="total-stake-section">Total Stake: ${totalStake}</span>
                </div>
                {placeBetStatus === 'I' && 
                    <button className="btn btn-success btn-place-bet" type="button" onClick={handleClickPlaceBet}>
                        Place Bet
                    </button>
                }
                {placeBetStatus === 'C' && 
                    <div className="row">
                        <div className="col-md-6 d-flex justify-content-center">
                            <button className="btn btn-success btn-decline" type="button" onClick={handleClickDecline}>
                                Decline
                            </button>
                        </div>
                        <div className="col-md-6 d-flex justify-content-center">
                            <button className="btn btn-success btn-confirm" type="button" onClick={handleClickConfirmBet}>
                                Confirm
                            </button>
                        </div>
                    </div>
                }
                
            </div>
        </div>
    );
}