package com.oasisbet.result.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.math.BigInteger;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;

import com.oasisbet.result.TestBaseSetup;
import com.oasisbet.result.fixture.ResultFixture;
import com.oasisbet.result.model.ResultApiResponse;
import com.oasisbet.result.model.ResultEvent;
import com.oasisbet.result.model.ResultEventMapping;
import com.oasisbet.result.model.Score;

@ExtendWith(MockitoExtension.class)
class TestResultService extends TestBaseSetup {

	@Autowired
	private ResultService resultService;

	@Test
	void testRetrieveBetEventByCompTypeCountIs3() {
		List<ResultEventMapping> results = resultService.retrieveCompletedResults();
		assertEquals(3, results.size());
	}

	@Test
	void testDetermineOutcomeHomeWin() {
		String result = resultService.determineOutcome("3", "2");
		assertEquals("01", result);
	}

	@Test
	void testDetermineOutcomeDrawWin() {
		String result = resultService.determineOutcome("2", "2");
		assertEquals("02", result);
	}

	@Test
	void testDetermineOutcomeAwayWin() {
		String result = resultService.determineOutcome("1", "2");
		assertEquals("03", result);
	}

	@Test
	void testValidateUpdateResultFlagScoreNotEmptyFail() {
		ResultEventMapping mockResultEvent = new ResultEventMapping();
		mockResultEvent.setApiEventId("a085aa8beb661722ad957e5d8c15f798");
		mockResultEvent.setCompleted(false);
		mockResultEvent.setCompType("soccer_epl");
		mockResultEvent.setEventId(BigInteger.valueOf(1000001L));
		mockResultEvent.setLastUpdatedDt(null);
		mockResultEvent.setOutcome(null);
		mockResultEvent.setScore("2-1");
		boolean result = resultService.validateUpdateResultFlag(mockResultEvent);
		assertEquals(false, result);
	}

	@Test
	void testValidateUpdateResultFlagOutcomeNotEmptyFail() {
		ResultEventMapping mockResultEvent = new ResultEventMapping();
		mockResultEvent.setApiEventId("a085aa8beb661722ad957e5d8c15f798");
		mockResultEvent.setCompleted(false);
		mockResultEvent.setCompType("soccer_epl");
		mockResultEvent.setEventId(BigInteger.valueOf(1000001L));
		mockResultEvent.setLastUpdatedDt(new Date());
		mockResultEvent.setOutcome("03");
		mockResultEvent.setScore(null);
		boolean result = resultService.validateUpdateResultFlag(mockResultEvent);
		assertEquals(false, result);
	}

	@Test
	void testValidateUpdateResultFlagSuccess() {
		ResultEventMapping mockResultEvent = new ResultEventMapping();
		mockResultEvent.setApiEventId("a085aa8beb661722ad957e5d8c15f798");
		mockResultEvent.setCompleted(false);
		mockResultEvent.setCompType("soccer_epl");
		mockResultEvent.setEventId(BigInteger.valueOf(1000001L));
		mockResultEvent.setLastUpdatedDt(null);
		mockResultEvent.setOutcome(null);
		mockResultEvent.setScore(null);
		boolean result = resultService.validateUpdateResultFlag(mockResultEvent);
		assertEquals(true, result);
	}

	@Test
	void testProcessMappingSuccess() throws ParseException {
		ResultApiResponse[] apiInputParams = ResultFixture.mockEplResultApiResponseArray();

		List<ResultEvent> expectedResponse = ResultFixture.createMappedSuccessEplResultApiResponse();

		List<ResultEvent> result = resultService.processMapping(apiInputParams);

		ResultEvent expectedResponse1 = expectedResponse.get(0);
		ResultEvent expectedResponse2 = expectedResponse.get(1);
		ResultEvent expectedResponse3 = expectedResponse.get(2);

		ResultEvent resultEvent1 = result.get(0);
		ResultEvent resultEvent2 = result.get(1);
		ResultEvent resultEvent3 = result.get(2);

		assertEquals(expectedResponse1.getHomeTeam(), resultEvent1.getHomeTeam());
		assertEquals(expectedResponse1.getAwayTeam(), resultEvent1.getAwayTeam());
		assertEquals(expectedResponse1.getEventDesc(), resultEvent1.getEventDesc());
		assertEquals(expectedResponse1.getStartTime(), resultEvent1.getStartTime());
		assertEquals(expectedResponse1.getScore(), resultEvent1.getScore());
		assertEquals(expectedResponse1.getCompetition(), resultEvent1.getCompetition());

		assertEquals(expectedResponse2.getHomeTeam(), resultEvent2.getHomeTeam());
		assertEquals(expectedResponse2.getAwayTeam(), resultEvent2.getAwayTeam());
		assertEquals(expectedResponse2.getEventDesc(), resultEvent2.getEventDesc());
		assertEquals(expectedResponse2.getStartTime(), resultEvent2.getStartTime());
		assertEquals(expectedResponse2.getScore(), resultEvent2.getScore());
		assertEquals(expectedResponse2.getCompetition(), resultEvent2.getCompetition());

		assertEquals(expectedResponse3.getHomeTeam(), resultEvent3.getHomeTeam());
		assertEquals(expectedResponse3.getAwayTeam(), resultEvent3.getAwayTeam());
		assertEquals(expectedResponse3.getEventDesc(), resultEvent3.getEventDesc());
		assertEquals(expectedResponse3.getStartTime(), resultEvent3.getStartTime());
		assertEquals(expectedResponse3.getScore(), resultEvent3.getScore());
		assertEquals(expectedResponse3.getCompetition(), resultEvent3.getCompetition());
	}

	@Test
	void testProcessMappingHomeAndAwaySwappedSuccess() throws ParseException {
		ResultApiResponse[] apiInputParams = ResultFixture.mockEplResultApiResponseArrayHomeAndAwayScoreSwapped();

		List<ResultEvent> expectedResponse = ResultFixture.createMappedSuccessEplResultApiResponse();

		List<ResultEvent> result = resultService.processMapping(apiInputParams);

		ResultEvent expectedResponse1 = expectedResponse.get(0);
		ResultEvent expectedResponse2 = expectedResponse.get(1);
		ResultEvent expectedResponse3 = expectedResponse.get(2);

		ResultEvent resultEvent1 = result.get(0);
		ResultEvent resultEvent2 = result.get(1);
		ResultEvent resultEvent3 = result.get(2);

		assertEquals(expectedResponse1.getHomeTeam(), resultEvent1.getHomeTeam());
		assertEquals(expectedResponse1.getAwayTeam(), resultEvent1.getAwayTeam());
		assertEquals(expectedResponse1.getEventDesc(), resultEvent1.getEventDesc());
		assertEquals(expectedResponse1.getStartTime(), resultEvent1.getStartTime());
		assertEquals(expectedResponse1.getScore(), resultEvent1.getScore());
		assertEquals(expectedResponse1.getCompetition(), resultEvent1.getCompetition());

		assertEquals(expectedResponse2.getHomeTeam(), resultEvent2.getHomeTeam());
		assertEquals(expectedResponse2.getAwayTeam(), resultEvent2.getAwayTeam());
		assertEquals(expectedResponse2.getEventDesc(), resultEvent2.getEventDesc());
		assertEquals(expectedResponse2.getStartTime(), resultEvent2.getStartTime());
		assertEquals(expectedResponse2.getScore(), resultEvent2.getScore());
		assertEquals(expectedResponse2.getCompetition(), resultEvent2.getCompetition());

		assertEquals(expectedResponse3.getHomeTeam(), resultEvent3.getHomeTeam());
		assertEquals(expectedResponse3.getAwayTeam(), resultEvent3.getAwayTeam());
		assertEquals(expectedResponse3.getEventDesc(), resultEvent3.getEventDesc());
		assertEquals(expectedResponse3.getStartTime(), resultEvent3.getStartTime());
		assertEquals(expectedResponse3.getScore(), resultEvent3.getScore());
		assertEquals(expectedResponse3.getCompetition(), resultEvent3.getCompetition());
	}

	@Test
	void testProcessMappingHomeAndAwayDateFormatErrorFail() {
		ResultApiResponse[] apiInputParams = ResultFixture.mockEplResultApiResponseArrayWithDateFormatError();

		assertThrows(ParseException.class, () -> {
			resultService.processMapping(apiInputParams);
		});
	}

	@Test
	void testProcessMappingEventIdNotFoundNotAdded() throws ParseException {
		ResultApiResponse[] inputResult = new ResultApiResponse[1];

		ResultApiResponse mockResponse1 = new ResultApiResponse();

		List<Score> scoreList1 = new ArrayList<>();
		Score mockHomeScore1 = new Score();
		mockHomeScore1.setName("Crystal Palace");
		mockHomeScore1.setScore("2");
		scoreList1.add(mockHomeScore1);
		Score mockAwayScore1 = new Score();
		mockAwayScore1.setName("Burnley");
		mockAwayScore1.setScore("0");
		scoreList1.add(mockAwayScore1);

		mockResponse1.setId("abcdefg1234567890");
		mockResponse1.setSport_key("soccer_epl");
		mockResponse1.setSport_title("English Premier League");
		mockResponse1.setCommence_time("2023-04-28T18:45:00Z");
		mockResponse1.setHome_team("Crystal Palace");
		mockResponse1.setAway_team("Burnley");
		mockResponse1.setCompleted(true);
		mockResponse1.setLast_update("2023-04-29T18:45:00Z");
		mockResponse1.setScores(scoreList1);

		inputResult[0] = mockResponse1;

		List<ResultEvent> result = resultService.processMapping(inputResult);

		assertEquals(result.size(), 0);
	}

}
