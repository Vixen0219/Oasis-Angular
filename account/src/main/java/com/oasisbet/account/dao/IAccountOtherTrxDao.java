package com.oasisbet.account.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.oasisbet.account.view.AccountBetTrxView;

@Repository
public interface IAccountOtherTrxDao extends JpaRepository<AccountBetTrxView, Long> {

}
