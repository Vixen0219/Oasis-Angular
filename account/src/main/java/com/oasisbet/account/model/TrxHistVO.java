package com.oasisbet.account.model;

import java.util.Date;

public class TrxHistVO {
	private Date dateTime;
	private String desc;
	private String type;
	private Double amount;
	private TrxBetDetailsVO trxBetDetails;

	public Date getDateTime() {
		return dateTime;
	}

	public void setDateTime(Date dateTime) {
		this.dateTime = dateTime;
	}

	public String getDesc() {
		return desc;
	}

	public void setDesc(String desc) {
		this.desc = desc;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public Double getAmount() {
		return amount;
	}

	public void setAmount(Double amount) {
		this.amount = amount;
	}

	public TrxBetDetailsVO getTrxBetDetails() {
		return trxBetDetails;
	}

	public void setTrxBetDetails(TrxBetDetailsVO trxBetDetails) {
		this.trxBetDetails = trxBetDetails;
	}

}
