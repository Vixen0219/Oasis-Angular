package com.oasisbet.result.util;

import java.util.ArrayList;
import java.util.List;

import com.oasisbet.result.model.ResultApiResponse;
import com.oasisbet.result.model.Score;

public class MockData {

	public static ResultApiResponse[] mockEplResultApiResponseArray() {

		ResultApiResponse[] array = new ResultApiResponse[3];

		ResultApiResponse mockResponse1 = new ResultApiResponse();
		ResultApiResponse mockResponse2 = new ResultApiResponse();
		ResultApiResponse mockResponse3 = new ResultApiResponse();

		List<Score> scoreList1 = new ArrayList<>();
		Score mockHomeScore1 = new Score();
		mockHomeScore1.setName("Tottenham Hotspur");
		mockHomeScore1.setScore("4");
		scoreList1.add(mockHomeScore1);
		Score mockAwayScore1 = new Score();
		mockAwayScore1.setName("Leicester City");
		mockAwayScore1.setScore("1");
		scoreList1.add(mockAwayScore1);

		mockResponse1.setId("a085aa8beb661722ad957e5d8c15f798");
		mockResponse1.setSport_key("soccer_epl");
		mockResponse1.setSport_title("EPL");
		mockResponse1.setCommence_time("2023-04-28T18:45:00Z");
		mockResponse1.setHome_team("Tottenham Hotspur");
		mockResponse1.setAway_team("Leicester City");
		mockResponse1.setCompleted(true);
		mockResponse1.setLast_update("2023-04-29T18:45:00Z");
		mockResponse1.setScores(scoreList1);

		List<Score> scoreList2 = new ArrayList<>();
		Score mockHomeScore2 = new Score();
		mockHomeScore2.setName("Arsenal");
		mockHomeScore2.setScore("4");
		scoreList2.add(mockHomeScore1);
		Score mockAwayScore2 = new Score();
		mockAwayScore2.setName("Sheffield United");
		mockAwayScore2.setScore("0");
		scoreList2.add(mockAwayScore2);

		mockResponse2.setId("f7d5d5a141e21df15f23b5e306340bed");
		mockResponse2.setSport_key("soccer_epl");
		mockResponse2.setSport_title("EPL");
		mockResponse2.setCommence_time("2023-04-29T18:45:00Z");
		mockResponse2.setHome_team("Arsenal");
		mockResponse2.setAway_team("Sheffield United");
		mockResponse2.setCompleted(true);
		mockResponse2.setLast_update("2023-04-30T18:45:00Z");
		mockResponse2.setScores(scoreList2);

		List<Score> scoreList3 = new ArrayList<>();
		Score mockHomeScore3 = new Score();
		mockHomeScore3.setName("Newcastle United");
		mockHomeScore3.setScore("1");
		scoreList3.add(mockHomeScore3);
		Score mockAwayScore3 = new Score();
		mockAwayScore3.setName("Manchester United");
		mockAwayScore3.setScore("1");
		scoreList3.add(mockAwayScore3);

		mockResponse3.setId("66ca5a121b5ddc4763cf1708222be377");
		mockResponse3.setSport_key("soccer_epl");
		mockResponse3.setSport_title("EPL");
		mockResponse3.setCommence_time("2023-04-30T19:45:00Z");
		mockResponse3.setHome_team("Newcastle United");
		mockResponse3.setAway_team("Manchester United");
		mockResponse3.setCompleted(true);
		mockResponse3.setLast_update("2023-04-30T22:45:00Z");
		mockResponse3.setScores(scoreList3);

		array[0] = mockResponse1;
		array[1] = mockResponse2;
		array[2] = mockResponse3;

		return array;
	}

}
