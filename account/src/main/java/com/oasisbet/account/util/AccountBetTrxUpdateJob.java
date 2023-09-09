package com.oasisbet.account.util;

import java.util.List;

import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.oasisbet.account.model.ResultEventMapping;
import com.oasisbet.account.service.AccountService;
import com.oasisbet.account.view.AccountBetTrxView;

@Service
public class AccountBetTrxUpdateJob implements Job {

	@Autowired
	private AccountService accountService;

	@Override
	public void execute(JobExecutionContext context) throws JobExecutionException {
		Logger log = LoggerFactory.getLogger(AccountBetTrxUpdateJob.class);

		log.info("executing AccountBetTrxUpdateJob...");

		try {
			List<AccountBetTrxView> unsettledBetTrxList = accountService.retrieveNotSettledBetTrx();
			if (unsettledBetTrxList.size() > 0) {
				List<ResultEventMapping> results = accountService.retrieveCompletedResults();
			}

		} catch (Exception e) {
			log.error("error retrieving completed result events from Result Microservice", e);
		}

	}

}