// JSON 파싱 구현
//해당 샘플에 국한됨. JS를 이 서버가 아닌 다른 서버에서 로딩함
jsReplacer = ["/include/", "http://office.devzone.co.kr:8053/include/"];

//사용할 메인 스크립트 추가
AddScript("/include/js/Project/tw.js");
AddScript("/Include/js/Base/SimpleSocket.js");

function removePreviousGraph() {
  var verticalBarChartContent = document.getElementById(
    "verticalBarChartContent"
  );
  verticalBarChartContent.innerHTML = "&nbsp;";
  $("#verticalBarChartContent").append('<canvas id="chart"></canvas>');
}

var todayPowerSampleData = [
  0.0,
  0.0,
  0.0,
  0.0,
  0.0,
  0.0,
  0.5,
  61.78125,
  229.0313,
  348.1875,
  407.6875,
  650.0,
  543.4063,
  386.2188,
  507.375,
  449.8125,
  140.9063,
  2.5625,
  0.0,
  0.0,
  0.0,
  0.0,
  0.0,
  0.0
]; // 당일 발전량 샘플 데이터
var inverterSampleData = [
  0.0,
  0.0,
  0.0,
  0.0,
  0.0,
  0.0,
  0.0,
  0.0,
  0.1,
  12.36,
  45.8,
  69.64,
  81.54,
  130.0,
  0.0,
  0.0,
  0.0,
  0.0,
  0.0,
  0.0,
  0.0,
  0.0,
  0.0,
  0.0
]; // 인버터 샘플 데이터
var slopeIrradiationSampleDatas = [
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0.2,
  0.7,
  1.5,
  2.3,
  3.1,
  3.3,
  3.6,
  3.4,
  3.2,
  2.8,
  1.9,
  0.9,
  0.4,
  0.1,
  0
];
var horizontalIrradiationSampleDatas = [
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0.5,
  1.0,
  1.8,
  2.6,
  3.4,
  3.6,
  3.9,
  3.7,
  3.5,
  3.1,
  2.2,
  1.2,
  0.7,
  0.4,
  0,
  0
];
var solarCellTemperatureSampleDatas = [
  0.0,
  0.0,
  0.0,
  0.0,
  0.0,
  0.0,
  0.0,
  4.5,
  4.4,
  4.3,
  4.5,
  4.5,
  5.0,
  6.5,
  6.9,
  8.0,
  8.5,
  8.6,
  8.0,
  7.6,
  7.2,
  6.7,
  6.1,
  5.8,
  5.7,
  5.4,
  0.0
];
var atmosphericTemperatureSampleDatas = [
  0.0,
  0.0,
  0.0,
  0.0,
  0.0,
  0.0,
  0.0,
  0.5,
  0.4,
  0.3,
  0.5,
  0.5,
  1.0,
  2.5,
  2.9,
  4.0,
  4.5,
  4.6,
  4.0,
  3.6,
  3.2,
  2.7,
  2.1,
  1.8,
  1.7,
  1.4,
  0.0
];
var developmentTimeSampleDatas = [
  0.0,
  0.0,
  0.0,
  0.0,
  0.0,
  0.0,
  0.0,
  0.0,
  0.0,
  2.0,
  8.0,
  8.0,
  8.0,
  8.0,
  8.0,
  0.0,
  0.0,
  0.0,
  0.0,
  0.0,
  0.0,
  0.0,
  0.0
];

// 실시간 누적 데이터를 구한다.
function getRealTimeData(data) {
  var today = new Date();
  var currentHour = today.getHours(); // 현재 시간
  var results = new Array();
  var j = 0; // 실시간 누적 데이터의 인덱스
  // 실시간 누적 데이터를 구한다.
  for (let index = 0; index < data.length; index++) {
    if (index >= 4 && index <= currentHour) {
      results[j] = data[index];
      j++;
    }
  }

  return results;
}

// 일일 보고서 차트의 x축 라벨을 만든다.
function makeDayXLabel() {
  var result = new Array(); // 일일 보고서 차트의 x축 라벨
  var startHour = 5; // 시작 시간은 5시이다.
  var endHour = 20; // 종료 시간은 20시이다.
  var xLabelCount = endHour - startHour;

  // 일일 보고서 차트의 x축 라벨을 만든다.
  for (let index = 0; index <= xLabelCount; index++) {
    result[index] = startHour + ":00";
    startHour++;
  }

  return result;
}

// 경사 일사량과 수평 일사량 데이터가 있는 일일 차트를 그린다.
function drawIrradiationDayChart(
  yesterdayPowerData,
  inverter1Data,
  inverter2Data,
  inverter3Data,
  inverter4Data,
  inverter5Data,
  slopeIrradiationDatas,
  horizontalIrradiationDatas
) {
  // 온도 라디오 버튼의 상태를 수정한다.
  document.getElementById("temperature").checked = false;
  // 발전시간 라디오 버튼의 상태를 수정한다.
  document.getElementById("developmentTime").checked = false;

  // 그래프 그리기
  var oneYesterdayChartColor = "#ffcc33"; // 전일 전체 발전량 막대의 색상
  var oneTodayChartColor = "#00b0ff"; // 당일 전체 발전량 막대의 색상
  var inverter1DatumColor = "#B0DE09"; // 인버터 1 막대 그래프의 색상
  var inverter2DatumColor = "#04D215"; // 인버터 2 막대 그래프의 색상
  var inverter3DatumColor = "#10AAF8"; // 인버터 3 막대 그래프의 색상
  var inverter4DatumColor = "#1062FB"; // 인버터 4 막대 그래프의 색상
  var inverter5DatumColor = "#320EFA"; // 인버터 5 막대 그래프의 색상
  var inverter1DataChartColor = new Array(); // 인버터 1 막대 그래프들의 색상
  var inverter2DataChartColor = new Array(); // 인버터 2 막대 그래프들의 색상
  var inverter3DataChartColor = new Array(); // 인버터 1 막대 그래프들의 색상
  var inverter4DataChartColor = new Array(); // 인버터 2 막대 그래프들의 색상
  var inverter5DataChartColor = new Array(); // 인버터 1 막대 그래프들의 색상
  var startHour = 4; // 태양광 발전 시작 시간 : 4시
  var endHour = 20; // 태양광 종료 시간 : 20시
  var xValueCount = endHour - startHour; // 태양광 발전 시간, x 값의 개수

  // 인버터 1 ~ 5 막대 그래프의 색상을 구한다.
  for (let index = 0; index < xValueCount; index++) {
    inverter1DataChartColor[index] = inverter1DatumColor;
    inverter2DataChartColor[index] = inverter2DatumColor;
    inverter3DataChartColor[index] = inverter3DatumColor;
    inverter4DataChartColor[index] = inverter4DatumColor;
    inverter5DataChartColor[index] = inverter5DatumColor;
  }

  // 이전 그래프를 삭제한다.
  removePreviousGraph();

  // 막대 그래프를 만든다.
  var ctx = $("#chart").get(0);

  var todayOutput = new Array(); // 당일 발전량
  var yesterdayOutput = new Array(); // 전일 발전량

  var slopeIrradiationText = "경사 일사량(MJ/㎡)";
  var horizontalIrradiationText = "수평 일사량(MJ/㎡)";
  var irradiationText = "일사량(MJ/㎡)";
  var todayOutputText = "당일 전체 발전량(kWh)";
  var yesterdayOutputText = "전일 전체 발전량(kWh)";
  var todayOutputAreaText = "당일 전체 발전량(kWh) 영역";
  var yesterdayOutputAreaText = "전일 전체 발전량(kWh) 영역";
  var outputText = "전체 발전량(kWh)";
  var slopeIrradiationAreaText = "경사 일사량(kcal/㎡/day) 영역";
  var horizontalIrradiationAreaText = "수평 일사량(kcal/㎡/day) 영역";
  var inverter1DataText = "INV-1";
  var inverter2DataText = "INV-2";
  var inverter3DataText = "INV-3";
  var inverter4DataText = "INV-4";
  var inverter5DataText = "INV-5";

  // 영역 차트의 배경색 설정
  var firstLineChartColor = "#004D77";
  var secondLineChartColor = "#009688";
  var color = Chart.helpers.color;
  var firstLineChartBGColor = color(firstLineChartColor)
    .alpha(0.1)
    .rgbString();
  var secondLineChartBGColor = color(secondLineChartColor)
    .alpha(0.1)
    .rgbString();
  var yesterdayOutputChartBGColor = color(oneYesterdayChartColor)
    .alpha(0.1)
    .rgbString();
  var todayOutputChartBGColor = color(oneTodayChartColor)
    .alpha(0.1)
    .rgbString();

  // 일일 보고서 차트의 x축 라벨을 만든다.
  var labels = makeDayXLabel();

  // 차트에 표시할 데이터들을 구한다.
  var j = 0; // 차트에 표시할 전일 전체 발전량의 인덱스
  // 경사 일사량을 구한다.
  slopeIrradiationDatas = getRealTimeData(slopeIrradiationSampleDatas);
  // 수평 일사량을 구한다.
  horizontalIrradiationDatas = getRealTimeData(
    horizontalIrradiationSampleDatas
  );
  // 전일 전체 발전량을 구한다.
  yesterdayPowerData = getRealTimeData(todayPowerSampleData);
  // 현재 시간을 구한다.
  var today = new Date();
  var currentHour = today.getHours();
  // 당일 전체 발전량을 구한다.
  for (let index = 0; index < xValueCount; index++) {
    if (index >= 4 && index <= currentHour) {
      // 당일 전체 발전량을 구한다.
      var inverter1Datum = inverterSampleData[index];
      var inverter2Datum = inverterSampleData[index];
      var inverter3Datum = inverterSampleData[index];
      var inverter4Datum = inverterSampleData[index];
      var inverter5Datum = inverterSampleData[index];
      powerdatum =
        inverter1Datum +
        inverter2Datum +
        inverter3Datum +
        inverter4Datum +
        inverter5Datum;
      todayOutput[j] = powerdatum;
      j++;
    }
  }
  // INV-1을 구한다.
  inverter1Data = getRealTimeData(inverterSampleData);
  // INV-2을 구한다.
  inverter2Data = getRealTimeData(inverterSampleData);
  // INV-3을 구한다.
  inverter3Data = getRealTimeData(inverterSampleData);
  // INV-4을 구한다.
  inverter4Data = getRealTimeData(inverterSampleData);
  // INV-5을 구한다.
  inverter5Data = getRealTimeData(inverterSampleData);

  // 일일 보고서 일사량 차트의 옵션을 정한다.
  var chartOption = {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          // Changes this dataset to become a line
          type: "line",
          label: slopeIrradiationText,
          data: slopeIrradiationDatas,
          fill: false,
          yAxisID: "y-axis-2",
          borderColor: firstLineChartColor,
          backgroundColor: firstLineChartColor,
          pointBackgroundColor: firstLineChartColor,
          borderWidth: 0.5
        },
        {
          // Changes this dataset to become a line
          type: "line",
          label: horizontalIrradiationText,
          data: horizontalIrradiationDatas,
          fill: false,
          yAxisID: "y-axis-2",
          borderColor: secondLineChartColor,
          backgroundColor: secondLineChartColor,
          pointBackgroundColor: secondLineChartColor,
          borderWidth: 0.5
        },
        {
          // Changes this dataset to become a line
          type: "line",
          label: yesterdayOutputText,
          data: yesterdayPowerData,
          fill: false,
          yAxisID: "y-axis-1",
          borderColor: oneYesterdayChartColor,
          backgroundColor: oneYesterdayChartColor,
          pointBackgroundColor: oneYesterdayChartColor,
          borderWidth: 0.5
        },
        {
          // Changes this dataset to become a line
          type: "line",
          label: todayOutputText,
          data: todayOutput,
          fill: false,
          yAxisID: "y-axis-1",
          borderColor: oneTodayChartColor,
          backgroundColor: oneTodayChartColor,
          pointBackgroundColor: oneTodayChartColor,
          borderWidth: 0.5
        },
        {
          label: inverter1DataText,
          data: inverter1Data,
          fill: false,
          yAxisID: "y-axis-1",
          borderColor: inverter1DataChartColor,
          backgroundColor: inverter1DataChartColor,
          borderWidth: 1
        },
        {
          label: inverter2DataText,
          data: inverter2Data,
          fill: false,
          yAxisID: "y-axis-1",
          borderColor: inverter2DataChartColor,
          backgroundColor: inverter2DataChartColor,
          borderWidth: 1
        },
        {
          label: inverter3DataText,
          data: inverter3Data,
          fill: false,
          yAxisID: "y-axis-1",
          borderColor: inverter3DataChartColor,
          backgroundColor: inverter3DataChartColor,
          borderWidth: 1
        },
        {
          label: inverter4DataText,
          data: inverter4Data,
          fill: false,
          yAxisID: "y-axis-1",
          borderColor: inverter4DataChartColor,
          backgroundColor: inverter4DataChartColor,
          borderWidth: 1
        },
        {
          label: inverter5DataText,
          data: inverter5Data,
          fill: false,
          yAxisID: "y-axis-1",
          borderColor: inverter5DataChartColor,
          backgroundColor: inverter5DataChartColor,
          borderWidth: 1
        },
        {
          // Changes this dataset to become a line
          type: "line",
          label: yesterdayOutputAreaText,
          data: yesterdayOutput,
          fill: "start",
          yAxisID: "y-axis-1",
          borderColor: yesterdayOutputChartBGColor,
          backgroundColor: yesterdayOutputChartBGColor,
          pointBackgroundColor: yesterdayOutputChartBGColor,
          borderWidth: 0.5
        },
        {
          // Changes this dataset to become a line
          type: "line",
          label: todayOutputAreaText,
          data: todayOutput,
          fill: "start",
          yAxisID: "y-axis-1",
          borderColor: todayOutputChartBGColor,
          backgroundColor: todayOutputChartBGColor,
          pointBackgroundColor: todayOutputChartBGColor,
          borderWidth: 0.5
        }
      ]
    },
    options: {
      title: {
        display: false,
        text: "태양 전지 온도",
        fontSize: 12,
        position: "bottom"
      },
      scales: {
        yAxes: [
          {
            type: "linear",
            display: true,
            position: "left",
            id: "y-axis-1",
            scaleLabel: {
              display: true,
              labelString: outputText
            }
          },
          {
            type: "linear",
            display: true,
            position: "right",
            id: "y-axis-2",
            gridLines: {
              drawOnChartArea: false // only want the grid lines for one axis to show up
            },
            scaleLabel: {
              display: true,
              labelString: irradiationText
            }
          }
        ],
        xAxes: [
          {
            gridLines: {
              drawBorder: false,
              color: "white"
            }
          }
        ]
      },
      aspectRatio: 3
    }
  };

  var dayChart = new Chart(ctx, chartOption);
  return dayChart;
}

// 모듈 온도와 대기 온도 데이터가 있는 일일 차트를 그린다.
function drawTemperatureDayChart(
  yesterdayPowerData,
  inverter1Data,
  inverter2Data,
  inverter3Data,
  inverter4Data,
  inverter5Data,
  solarCellTemperatureDatas,
  atmosphericTemperatureDatas
) {
  // 온도 라디오 버튼의 상태를 수정한다.
  document.getElementById("irradiation").checked = false;
  // 발전시간 라디오 버튼의 상태를 수정한다.
  document.getElementById("developmentTime").checked = false;

  // 그래프 그리기
  var oneYesterdayChartColor = "#ffcc33"; // 전일 전체 발전량 막대의 색상
  var oneTodayChartColor = "#00b0ff"; // 당일 전체 발전량 막대의 색상
  var inverter1DatumColor = "#B0DE09"; // 인버터 1 막대 그래프의 색상
  var inverter2DatumColor = "#04D215"; // 인버터 2 막대 그래프의 색상
  var inverter3DatumColor = "#10AAF8"; // 인버터 3 막대 그래프의 색상
  var inverter4DatumColor = "#1062FB"; // 인버터 4 막대 그래프의 색상
  var inverter5DatumColor = "#320EFA"; // 인버터 5 막대 그래프의 색상
  var inverter1DataChartColor = new Array(); // 인버터 1 막대 그래프들의 색상
  var inverter2DataChartColor = new Array(); // 인버터 2 막대 그래프들의 색상
  var inverter3DataChartColor = new Array(); // 인버터 1 막대 그래프들의 색상
  var inverter4DataChartColor = new Array(); // 인버터 2 막대 그래프들의 색상
  var inverter5DataChartColor = new Array(); // 인버터 1 막대 그래프들의 색상
  var startHour = 4; // 태양광 발전 시작 시간 : 4시
  var endHour = 20; // 태양광 종료 시간 : 20시
  var xValueCount = endHour - startHour; // 태양광 발전 시간, x 값의 개수

  // 인버터 1 ~ 5 막대 그래프의 색상을 구한다.
  for (let index = 0; index < xValueCount; index++) {
    inverter1DataChartColor[index] = inverter1DatumColor;
    inverter2DataChartColor[index] = inverter2DatumColor;
    inverter3DataChartColor[index] = inverter3DatumColor;
    inverter4DataChartColor[index] = inverter4DatumColor;
    inverter5DataChartColor[index] = inverter5DatumColor;
  }

  // 이전 그래프를 삭제한다.
  removePreviousGraph();

  // 막대 그래프를 만든다.
  var ctx = $("#chart").get(0);

  var todayOutput = new Array(); // 당일 발전량
  var yesterdayOutput = new Array(); // 전일 발전량

  var solarCellTemperatureText = "모듈 온도(℃)";
  var atmosphericTemperatureText = "대기 온도(℃)";
  var temperatureText = "온도(℃)";
  var todayOutputText = "당일 발전량(kWh)";
  var yesterdayOutputText = "전일 발전량(kWh)";
  var todayOutputAreaText = "당일 전체 발전량(kWh) 영역";
  var yesterdayOutputAreaText = "전일 전체 발전량(kWh) 영역";
  var outputText = "전체 발전량(kWh)";
  var solarCellTemperatureAreaText = "모듈 온도(℃) 영역";
  var atmosphericTemperatureAreaText = "대기 온도(℃) 영역";
  var inverter1DataText = "INV-1";
  var inverter2DataText = "INV-2";
  var inverter3DataText = "INV-3";
  var inverter4DataText = "INV-4";
  var inverter5DataText = "INV-5";

  // 영역 차트의 배경색 설정
  var firstLineChartColor = "#004D77";
  var secondLineChartColor = "#009688";
  var color = Chart.helpers.color;
  var firstLineChartBGColor = color(firstLineChartColor)
    .alpha(0.1)
    .rgbString();
  var secondLineChartBGColor = color(secondLineChartColor)
    .alpha(0.1)
    .rgbString();
  var yesterdayOutputChartBGColor = color(oneYesterdayChartColor)
    .alpha(0.1)
    .rgbString();
  var todayOutputChartBGColor = color(oneTodayChartColor)
    .alpha(0.1)
    .rgbString();

  // 일일 보고서 차트의 x축 라벨을 만든다.
  var labels = makeDayXLabel();

  // 차트에 표시할 데이터들을 구한다.
  var j = 0; // 차트에 표시할 전일 전체 발전량의 인덱스
  // 모듈 온도를 구한다.
  solarCellTemperatureDatas = getRealTimeData(solarCellTemperatureSampleDatas);
  // 대기 온도를 구한다.
  atmosphericTemperatureDatas = getRealTimeData(
    atmosphericTemperatureSampleDatas
  );
  // 전일 전체 발전량을 구한다.
  yesterdayOutput = getRealTimeData(todayPowerSampleData);

  // 현재 시간을 구한다.
  var today = new Date();
  var currentHour = today.getHours();

  // 당일 전체 발전량을 구한다.
  for (let index = 0; index < xValueCount; index++) {
    if (index >= 4 && index <= currentHour) {
      // 당일 전체 발전량을 구한다.
      var inverter1Datum = inverterSampleData[index];
      var inverter2Datum = inverterSampleData[index];
      var inverter3Datum = inverterSampleData[index];
      var inverter4Datum = inverterSampleData[index];
      var inverter5Datum = inverterSampleData[index];
      powerdatum =
        inverter1Datum +
        inverter2Datum +
        inverter3Datum +
        inverter4Datum +
        inverter5Datum;
      todayOutput[j] = powerdatum;
      j++;
    }
  }
  // INV-1을 구한다.
  inverter1Data = getRealTimeData(inverterSampleData);
  // INV-2을 구한다.
  inverter2Data = getRealTimeData(inverterSampleData);
  // INV-3을 구한다.
  inverter3Data = getRealTimeData(inverterSampleData);
  // INV-4을 구한다.
  inverter4Data = getRealTimeData(inverterSampleData);
  // INV-5을 구한다.
  inverter5Data = getRealTimeData(inverterSampleData);

  // 일일 보고서 온도 차트의 옵션을 정한다.
  var chartOption = {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          // Changes this dataset to become a line
          type: "line",
          label: solarCellTemperatureText,
          data: solarCellTemperatureDatas,
          fill: false,
          yAxisID: "y-axis-2",
          borderColor: firstLineChartColor,
          backgroundColor: firstLineChartColor,
          pointBackgroundColor: firstLineChartColor,
          borderWidth: 0.5
        },
        {
          // Changes this dataset to become a line
          type: "line",
          label: atmosphericTemperatureText,
          data: atmosphericTemperatureDatas,
          fill: false,
          yAxisID: "y-axis-2",
          borderColor: secondLineChartColor,
          backgroundColor: secondLineChartColor,
          pointBackgroundColor: secondLineChartColor,
          borderWidth: 0.5
        },
        {
          // Changes this dataset to become a line
          type: "line",
          label: yesterdayOutputText,
          data: yesterdayOutput,
          fill: false,
          yAxisID: "y-axis-1",
          borderColor: oneYesterdayChartColor,
          backgroundColor: oneYesterdayChartColor,
          pointBackgroundColor: oneYesterdayChartColor,
          borderWidth: 0.5
        },
        {
          // Changes this dataset to become a line
          type: "line",
          label: todayOutputText,
          data: todayOutput,
          fill: false,
          yAxisID: "y-axis-1",
          borderColor: oneTodayChartColor,
          backgroundColor: oneTodayChartColor,
          pointBackgroundColor: oneTodayChartColor,
          borderWidth: 0.5
        },
        {
          label: inverter1DataText,
          data: inverter1Data,
          fill: false,
          yAxisID: "y-axis-1",
          borderColor: inverter1DataChartColor,
          backgroundColor: inverter1DataChartColor,
          borderWidth: 1
        },
        {
          label: inverter2DataText,
          data: inverter2Data,
          fill: false,
          yAxisID: "y-axis-1",
          borderColor: inverter2DataChartColor,
          backgroundColor: inverter2DataChartColor,
          borderWidth: 1
        },
        {
          label: inverter3DataText,
          data: inverter3Data,
          fill: false,
          yAxisID: "y-axis-1",
          borderColor: inverter3DataChartColor,
          backgroundColor: inverter3DataChartColor,
          borderWidth: 1
        },
        {
          label: inverter4DataText,
          data: inverter4Data,
          fill: false,
          yAxisID: "y-axis-1",
          borderColor: inverter4DataChartColor,
          backgroundColor: inverter4DataChartColor,
          borderWidth: 1
        },
        {
          label: inverter5DataText,
          data: inverter5Data,
          fill: false,
          yAxisID: "y-axis-1",
          borderColor: inverter5DataChartColor,
          backgroundColor: inverter5DataChartColor,
          borderWidth: 1
        },
        {
          // Changes this dataset to become a line
          type: "line",
          label: yesterdayOutputAreaText,
          data: yesterdayOutput,
          fill: "start",
          yAxisID: "y-axis-1",
          borderColor: yesterdayOutputChartBGColor,
          backgroundColor: yesterdayOutputChartBGColor,
          pointBackgroundColor: yesterdayOutputChartBGColor,
          borderWidth: 0.5
        },
        {
          // Changes this dataset to become a line
          type: "line",
          label: todayOutputAreaText,
          data: todayOutput,
          fill: "start",
          yAxisID: "y-axis-1",
          borderColor: todayOutputChartBGColor,
          backgroundColor: todayOutputChartBGColor,
          pointBackgroundColor: todayOutputChartBGColor,
          borderWidth: 0.5
        }
      ]
    },
    options: {
      title: {
        display: false,
        text: "태양 전지 온도",
        fontSize: 12,
        position: "bottom"
      },
      scales: {
        yAxes: [
          {
            type: "linear",
            display: true,
            position: "left",
            id: "y-axis-1",
            scaleLabel: {
              display: true,
              labelString: todayOutputText
            }
          },
          {
            type: "linear",
            display: true,
            position: "right",
            id: "y-axis-2",
            gridLines: {
              drawOnChartArea: false // only want the grid lines for one axis to show up
            },
            scaleLabel: {
              display: true,
              labelString: temperatureText
            }
          }
        ],
        xAxes: [
          {
            gridLines: {
              drawBorder: false,
              color: "white"
            }
          }
        ]
      },
      aspectRatio: 3
    }
  };

  var dayChart = new Chart(ctx, chartOption);
  return dayChart;
}

// 발전 시간 데이터가 있는 일일 차트를 그린다.
function drawDevelopmentTimeDayChart(
  yesterdayPowerData,
  inverter1Data,
  inverter2Data,
  inverter3Data,
  inverter4Data,
  inverter5Data,
  developmentTimeDatas
) {
  // 온도 라디오 버튼의 상태를 수정한다.
  document.getElementById("irradiation").checked = false;
  // 발전시간 라디오 버튼의 상태를 수정한다.
  document.getElementById("temperature").checked = false;

  // 그래프 그리기
  var oneYesterdayChartColor = "#ffcc33"; // 전일 전체 발전량 막대의 색상
  var oneTodayChartColor = "#00b0ff"; // 당일 전체 발전량 막대의 색상
  var inverter1DatumColor = "#B0DE09"; // 인버터 1 막대 그래프의 색상
  var inverter2DatumColor = "#04D215"; // 인버터 2 막대 그래프의 색상
  var inverter3DatumColor = "#10AAF8"; // 인버터 3 막대 그래프의 색상
  var inverter4DatumColor = "#1062FB"; // 인버터 4 막대 그래프의 색상
  var inverter5DatumColor = "#320EFA"; // 인버터 5 막대 그래프의 색상
  var inverter1DataChartColor = new Array(); // 인버터 1 막대 그래프들의 색상
  var inverter2DataChartColor = new Array(); // 인버터 2 막대 그래프들의 색상
  var inverter3DataChartColor = new Array(); // 인버터 1 막대 그래프들의 색상
  var inverter4DataChartColor = new Array(); // 인버터 2 막대 그래프들의 색상
  var inverter5DataChartColor = new Array(); // 인버터 1 막대 그래프들의 색상
  var startHour = 4; // 태양광 발전 시작 시간 : 4시
  var endHour = 20; // 태양광 종료 시간 : 20시
  var xValueCount = endHour - startHour; // 태양광 발전 시간, x 값의 개수

  // 인버터 1 ~ 5 막대 그래프의 색상을 구한다.
  for (let index = 0; index < xValueCount; index++) {
    inverter1DataChartColor[index] = inverter1DatumColor;
    inverter2DataChartColor[index] = inverter2DatumColor;
    inverter3DataChartColor[index] = inverter3DatumColor;
    inverter4DataChartColor[index] = inverter4DatumColor;
    inverter5DataChartColor[index] = inverter5DatumColor;
  }

  // 이전 그래프를 삭제한다.
  removePreviousGraph();

  // 막대 그래프를 만든다.
  var ctx = $("#chart").get(0);

  var todayOutput = new Array(); // 당일 발전량
  var yesterdayOutput = new Array(); // 전일 발전량
  var outputText = "전체 발전량(kWh)";
  var developmentTimeText = "발전시간(h)";
  var developmentTimeAreaText = "발전시간(h) 영역";
  var todayOutputText = "당일 발전량(kWh)";
  var yesterdayOutputText = "전일 발전량(kWh)";
  var todayOutputAreaText = "당일 전체 발전량(kWh) 영역";
  var yesterdayOutputAreaText = "전일 전체 발전량(kWh) 영역";
  var inverter1DataText = "INV-1";
  var inverter2DataText = "INV-2";
  var inverter3DataText = "INV-3";
  var inverter4DataText = "INV-4";
  var inverter5DataText = "INV-5";

  // 영역 차트의 배경색 설정
  var firstLineChartColor = "#004D77";
  var secondLineChartColor = "#009688";
  var color = Chart.helpers.color;
  var firstLineChartBGColor = color(firstLineChartColor)
    .alpha(0.1)
    .rgbString();
  var yesterdayOutputChartBGColor = color(oneYesterdayChartColor)
    .alpha(0.1)
    .rgbString();
  var todayOutputChartBGColor = color(oneTodayChartColor)
    .alpha(0.1)
    .rgbString();

  // 일일 보고서 차트의 x축 라벨을 만든다.
  var labels = makeDayXLabel();

  // 차트에 표시할 데이터들을 구한다.
  var j = 0; // 차트에 표시할 전일 전체 발전량의 인덱스
  // 발전 시간을 구한다.
  developmentTimeDatas = getRealTimeData(developmentTimeSampleDatas);
  // 전일 전체 발전량을 구한다.
  yesterdayOutput = getRealTimeData(todayPowerSampleData);

  // 현재 시간을 구한다.
  var today = new Date();
  var currentHour = today.getHours();
  var powerdatum = 0; // 발전량 데이터 한 개
  // 당일 전체 발전량을 구한다.
  for (let index = 0; index < xValueCount; index++) {
    if (index >= 4 && index <= currentHour) {
      // 당일 전체 발전량을 구한다.
      var inverter1Datum = inverterSampleData[index];
      var inverter2Datum = inverterSampleData[index];
      var inverter3Datum = inverterSampleData[index];
      var inverter4Datum = inverterSampleData[index];
      var inverter5Datum = inverterSampleData[index];
      powerdatum =
        inverter1Datum +
        inverter2Datum +
        inverter3Datum +
        inverter4Datum +
        inverter5Datum;
      todayOutput[j] = powerdatum;
      j++;
    }
  }
  // INV-1을 구한다.
  inverter1Data = getRealTimeData(inverterSampleData);
  // INV-2을 구한다.
  inverter2Data = getRealTimeData(inverterSampleData);
  // INV-3을 구한다.
  inverter3Data = getRealTimeData(inverterSampleData);
  // INV-4을 구한다.
  inverter4Data = getRealTimeData(inverterSampleData);
  // INV-5을 구한다.
  inverter5Data = getRealTimeData(inverterSampleData);

  // 일일 보고서 발전시간 차트의 옵션을 정한다.
  var chartOption = {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          // Changes this dataset to become a line
          type: "line",
          label: developmentTimeText,
          data: developmentTimeDatas,
          fill: false,
          yAxisID: "y-axis-2",
          borderColor: firstLineChartColor,
          backgroundColor: firstLineChartBGColor,
          pointBackgroundColor: firstLineChartColor,
          borderWidth: 0.5
        },
        {
          // Changes this dataset to become a line
          type: "line",
          label: yesterdayOutputText,
          data: yesterdayOutput,
          fill: false,
          yAxisID: "y-axis-1",
          borderColor: oneYesterdayChartColor,
          backgroundColor: oneYesterdayChartColor,
          pointBackgroundColor: oneYesterdayChartColor,
          borderWidth: 0.5
        },
        {
          // Changes this dataset to become a line
          type: "line",
          label: todayOutputText,
          data: todayOutput,
          fill: false,
          yAxisID: "y-axis-1",
          borderColor: oneTodayChartColor,
          backgroundColor: oneTodayChartColor,
          pointBackgroundColor: oneTodayChartColor,
          borderWidth: 0.5
        },
        {
          label: inverter1DataText,
          data: inverter1Data,
          fill: false,
          yAxisID: "y-axis-1",
          borderColor: inverter1DataChartColor,
          backgroundColor: inverter1DataChartColor,
          borderWidth: 1
        },
        {
          label: inverter2DataText,
          data: inverter2Data,
          fill: false,
          yAxisID: "y-axis-1",
          borderColor: inverter2DataChartColor,
          backgroundColor: inverter2DataChartColor,
          borderWidth: 1
        },
        {
          label: inverter3DataText,
          data: inverter3Data,
          fill: false,
          yAxisID: "y-axis-1",
          borderColor: inverter3DataChartColor,
          backgroundColor: inverter3DataChartColor,
          borderWidth: 1
        },
        {
          label: inverter4DataText,
          data: inverter4Data,
          fill: false,
          yAxisID: "y-axis-1",
          borderColor: inverter4DataChartColor,
          backgroundColor: inverter4DataChartColor,
          borderWidth: 1
        },
        {
          label: inverter5DataText,
          data: inverter5Data,
          fill: false,
          yAxisID: "y-axis-1",
          borderColor: inverter5DataChartColor,
          backgroundColor: inverter5DataChartColor,
          borderWidth: 1
        },
        {
          // Changes this dataset to become a line
          type: "line",
          label: yesterdayOutputAreaText,
          data: yesterdayOutput,
          fill: "start",
          yAxisID: "y-axis-1",
          borderColor: yesterdayOutputChartBGColor,
          backgroundColor: yesterdayOutputChartBGColor,
          pointBackgroundColor: yesterdayOutputChartBGColor,
          borderWidth: 0.5
        },
        {
          // Changes this dataset to become a line
          type: "line",
          label: todayOutputAreaText,
          data: todayOutput,
          fill: "start",
          yAxisID: "y-axis-1",
          borderColor: todayOutputChartBGColor,
          backgroundColor: todayOutputChartBGColor,
          pointBackgroundColor: todayOutputChartBGColor,
          borderWidth: 0.5
        }
      ]
    },
    options: {
      title: {
        display: false,
        text: "태양 전지 온도",
        fontSize: 12,
        position: "bottom"
      },
      scales: {
        yAxes: [
          {
            type: "linear",
            display: true,
            position: "left",
            id: "y-axis-1",
            scaleLabel: {
              display: true,
              labelString: outputText
            }
          },
          {
            type: "linear",
            display: true,
            position: "right",
            id: "y-axis-2",
            gridLines: {
              drawOnChartArea: false // only want the grid lines for one axis to show up
            },
            scaleLabel: {
              display: true,
              labelString: developmentTimeText
            }
          }
        ],
        xAxes: [
          {
            gridLines: {
              drawBorder: false,
              color: "white"
            }
          }
        ]
      },
      aspectRatio: 3
    }
  };

  var dayChart = new Chart(ctx, chartOption);
  return dayChart;
}

// 보고서 화면에 일일 차트를 그린다.
function DrawDayChart(periods) {
  var yesterdayPowerData = getYesterdayPowerData();
  var inverter1Data = new Array();
  var inverter2Data = new Array();
  var inverter3Data = new Array();
  var inverter4Data = new Array();
  var inverter5Data = new Array();
  var slopeIrradiationDatas = new Array();
  var horizontalIrradiationDatas = new Array();
  drawIrradiationDayChart(
    yesterdayPowerData,
    inverter1Data,
    inverter2Data,
    inverter3Data,
    inverter4Data,
    inverter5Data,
    slopeIrradiationDatas,
    horizontalIrradiationDatas
  );
}

// 라디오 버튼을 클릭하면 해당 데이터를 반영한 일일 차트로 갱신한다.
function addClickEventForDayChart() {
  // 일사량 라디오 버튼을 클릭하면 일사량 데이터를 출력한다.
  $("#irradiation").click(function() {
    // 일사량 데이터가 들어간 차트를 만든다.
    var yesterdayPowerData = getYesterdayPowerData();
    var inverter1Data = new Array();
    var inverter2Data = new Array();
    var inverter3Data = new Array();
    var inverter4Data = new Array();
    var inverter5Data = new Array();
    var slopeIrradiationDatas = new Array();
    var horizontalIrradiationDatas = new Array();
    drawIrradiationDayChart(
      yesterdayPowerData,
      inverter1Data,
      inverter2Data,
      inverter3Data,
      inverter4Data,
      inverter5Data,
      slopeIrradiationDatas,
      horizontalIrradiationDatas
    );
  });

  // 온도 라디오 버튼을 클릭하면 온도 데이터를 출력한다.
  $("#temperature").click(function() {
    // 온도 데이터가 들어간 차트를 만든다.
    var yesterdayPowerData = getYesterdayPowerData();
    var inverter1Data = new Array();
    var inverter2Data = new Array();
    var inverter3Data = new Array();
    var inverter4Data = new Array();
    var inverter5Data = new Array();
    var solarCellTemperatureDatas = new Array();
    var atmosphericTemperatureDatas = new Array();
    drawTemperatureDayChart(
      yesterdayPowerData,
      inverter1Data,
      inverter2Data,
      inverter3Data,
      inverter4Data,
      inverter5Data,
      solarCellTemperatureDatas,
      atmosphericTemperatureDatas
    );
  });

  // 발전시간 라디오 버튼을 클릭하면 온도 데이터를 출력한다.
  $("#developmentTime").click(function() {
    // 발전시간이 들어간 차트를 만든다.
    var yesterdayPowerData = getYesterdayPowerData();
    var inverter1Data = new Array();
    var inverter2Data = new Array();
    var inverter3Data = new Array();
    var inverter4Data = new Array();
    var inverter5Data = new Array();
    var developmentTimeDatas = new Array();
    drawDevelopmentTimeDayChart(
      yesterdayPowerData,
      inverter1Data,
      inverter2Data,
      inverter3Data,
      inverter4Data,
      inverter5Data,
      developmentTimeDatas
    );
  });
}

// 월간 보고서 차트의 x축 라벨을 만든다.
function makeMonthXLabel() {
  var labels = new Array(); // 월간 보고서 차트의 x축 라벨
  var maxDay = 31;
  for (let index = 0; index < maxDay; index++) {
    labels[index] = index + 1;
  }
  return labels;
}

var slopeIrradiationMonthSampleDatas = [
  1.91,
  0.69,
  1.45,
  2.17,
  2.31,
  2.01,
  1.08,
  2.22,
  1.44,
  2.08,
  1.64,
  2.21,
  2.34,
  0.87,
  2.48,
  2.49,
  2.46,
  2.32,
  2.23,
  1.96,
  0.93,
  2.52,
  2.34,
  2.3,
  2.48,
  2.54,
  2.17,
  0.9,
  2.14,
  1.93,
  1.39
]; // 경사 일사량 월간 샘플 데이터
var horizontalIrradiationMonthSampleDatas = [
  2.92,
  0.27,
  1.15,
  4.08,
  4.54,
  3.38,
  0.48,
  4.29,
  1.1,
  3.73,
  1.75,
  4.26,
  4.61,
  0.34,
  0,
  0,
  0,
  4.57,
  4.3,
  3.15,
  0.37,
  0,
  4.61,
  4.52,
  0,
  0,
  4.09,
  0.35,
  3.97,
  2.99,
  0.99
]; // 수평 일사량 월간 샘플 데이터

// 경사 일사량과 수평 일사량 데이터가 있는 월간 차트를 그린다.
function drawIrradiationMonthChart(
  inverter1Data,
  inverter2Data,
  inverter3Data,
  inverter4Data,
  inverter5Data,
  slopeIrradiationMonthSampleDatas,
  horizontalIrradiationMonthSampleDatas
) {
  // 온도 라디오 버튼의 상태를 수정한다.
  document.getElementById("temperature").checked = false;
  // 발전시간 라디오 버튼의 상태를 수정한다.
  document.getElementById("developmentTime").checked = false;

  // 그래프 그리기
  var gridColor = "#dedede";
  var oneMonthChartColor = "#00b0ff"; // 당월 전체 발전량 막대의 색상
  var inverter1DatumColor = "#FFC7D2"; // 인버터 1 막대 그래프의 색상
  var inverter2DatumColor = "#2E3192"; // 인버터 2 막대 그래프의 색상
  var inverter3DatumColor = "#FF5E00"; // 인버터 3 막대 그래프의 색상
  var inverter4DatumColor = "#9B3332"; // 인버터 4 막대 그래프의 색상
  var inverter5DatumColor = "#FA3563"; // 인버터 5 막대 그래프의 색상
  var inverter1DataChartColor = new Array(); // 인버터 1 막대 그래프들의 색상
  var inverter2DataChartColor = new Array(); // 인버터 2 막대 그래프들의 색상
  var inverter3DataChartColor = new Array(); // 인버터 1 막대 그래프들의 색상
  var inverter4DataChartColor = new Array(); // 인버터 2 막대 그래프들의 색상
  var inverter5DataChartColor = new Array(); // 인버터 1 막대 그래프들의 색상
  var xValueCount = 31; // x 값의 개수

  // 인버터 1 ~ 5 막대 그래프의 색상을 구한다.
  for (let index = 0; index < xValueCount; index++) {
    inverter1DataChartColor[index] = inverter1DatumColor;
    inverter2DataChartColor[index] = inverter2DatumColor;
    inverter3DataChartColor[index] = inverter3DatumColor;
    inverter4DataChartColor[index] = inverter4DatumColor;
    inverter5DataChartColor[index] = inverter5DatumColor;
  }

  // 이전 그래프를 삭제한다.
  removePreviousGraph();

  // 막대 그래프를 만든다.
  var ctx = $("#chart").get(0);

  var currentOutput = new Array(); // 당월 전체 발전량

  var slopeIrradiationText = "경사 일사량(MJ/㎡)";
  var horizontalIrradiationText = "수평 일사량(MJ/㎡)";
  var irradiationText = "일사량(MJ/㎡)";
  var outputText = "당월 전체 발전량(kWh)";
  var outputAreaText = "당일 전체 발전량(kWh) 영역";
  var slopeIrradiationAreaText = "경사 일사량(kcal/㎡/day) 영역";
  var horizontalIrradiationAreaText = "수평 일사량(kcal/㎡/day) 영역";
  var inverter1DataText = "INV-1";
  var inverter2DataText = "INV-2";
  var inverter3DataText = "INV-3";
  var inverter4DataText = "INV-4";
  var inverter5DataText = "INV-5";

  // 영역 차트의 배경색 설정
  var firstLineChartColor = "#004D77";
  var secondLineChartColor = "#009688";
  var color = Chart.helpers.color;
  var firstLineChartBGColor = color(firstLineChartColor)
    .alpha(0.1)
    .rgbString();
  var secondLineChartBGColor = color(secondLineChartColor)
    .alpha(0.1)
    .rgbString();
  var outputChartBGColor = color(oneMonthChartColor)
    .alpha(0.1)
    .rgbString();

  // 월간 보고서 차트의 x축 라벨을 만든다.
  var labels = makeMonthXLabel();

  // 차트에 표시할 데이터들을 구한다.
  var j = 0; // 차트에 표시할 전일 전체 발전량의 인덱스
  // 경사 일사량을 구한다.
  slopeIrradiationDatas = getMonthData(slopeIrradiationSampleDatas);
  // 수평 일사량을 구한다.
  horizontalIrradiationDatas = getMonthData(horizontalIrradiationSampleDatas);
  // 당일 전체 발전량을 구한다.
  for (let index = 0; index < inverterSampleData.length; index++) {
    if (index >= 4 && index <= currentHour) {
      // 당일 전체 발전량을 구한다.
      var inverter1Datum = inverterSampleData[index];
      var inverter2Datum = inverterSampleData[index];
      var inverter3Datum = inverterSampleData[index];
      var inverter4Datum = inverterSampleData[index];
      var inverter5Datum = inverterSampleData[index];
      powerdatum =
        inverter1Datum +
        inverter2Datum +
        inverter3Datum +
        inverter4Datum +
        inverter5Datum;
      todayOutput[j] = powerdatum;
      j++;
    }
  }
  // 일일 보고서 일사량 월간 차트의 옵션을 정한다.
  var chartOption = {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          // Changes this dataset to become a line
          type: "line",
          label: slopeIrradiationText,
          data: slopeIrradiationDatas,
          fill: false,
          yAxisID: "y-axis-2",
          borderColor: firstLineChartColor,
          backgroundColor: firstLineChartBGColor,
          pointBackgroundColor: firstLineChartColor,
          borderWidth: 0.5
        },
        {
          // Changes this dataset to become a line
          type: "line",
          label: horizontalIrradiationText,
          data: horizontalIrradiationDatas,
          fill: false,
          yAxisID: "y-axis-2",
          borderColor: secondLineChartColor,
          backgroundColor: secondLineChartBGColor,
          pointBackgroundColor: secondLineChartColor,
          borderWidth: 0.5
        },
        {
          label: outputText,
          data: currentOutput,
          fill: false,
          yAxisID: "y-axis-1",
          borderColor: todayGraphColor,
          backgroundColor: todayGraphColor,
          borderWidth: 1
        },
        {
          // Changes this dataset to become a line
          type: "line",
          label: slopeIrradiationAreaText,
          data: slopeIrradiationDatas,
          fill: "start",
          yAxisID: "y-axis-2",
          borderColor: firstLineChartColor,
          backgroundColor: firstLineChartBGColor,
          pointBackgroundColor: firstLineChartColor,
          borderWidth: 0.5
        },
        {
          // Changes this dataset to become a line
          type: "line",
          label: horizontalIrradiationAreaText,
          data: horizontalIrradiationDatas,
          fill: "start",
          yAxisID: "y-axis-2",
          borderColor: secondLineChartColor,
          backgroundColor: secondLineChartBGColor,
          pointBackgroundColor: secondLineChartColor,
          borderWidth: 0.5
        }
      ]
    },
    options: {
      title: {
        display: false,
        text: "태양 전지 온도",
        fontSize: 12,
        position: "bottom"
      },
      scales: {
        yAxes: [
          {
            type: "linear",
            display: true,
            position: "left",
            id: "y-axis-1",
            scaleLabel: {
              display: true,
              labelString: outputText
            }
          },
          {
            type: "linear",
            display: true,
            position: "right",
            id: "y-axis-2",
            gridLines: {
              drawOnChartArea: false // only want the grid lines for one axis to show up
            },
            scaleLabel: {
              display: true,
              labelString: irradiationText
            }
          }
        ],
        xAxes: [
          {
            barThickness: 30,
            gridLines: {
              drawBorder: false,
              color: "white"
            }
          }
        ]
      },
      aspectRatio: 4
    }
  };

  var monthChart = new Chart(ctx, chartOption);
  return monthChart;
}
// 모듈 온도와 대기 온도 데이터가 있는 월간 차트를 그린다.
function drawTemperatureMonthChart(
  inverter1Data,
  inverter2Data,
  inverter3Data,
  inverter4Data,
  inverter5Data,
  slopeIrradiationDatas,
  horizontalIrradiationDatas
) {
  // 그래프 그리기
  var gridColor = "#dedede";
  var oneTodayGraphColor = "#00b0ff"; // 당일 전체 발전량 막대의 색상
  var todayGraphColor = new Array(); // 당일 전체 발전량 막대 그래프의 색상
  var xValueCount = 31; // x 값의 개수

  // 전일 전체 발전량 막대 그래프와 당일 전체 발전량 막대 그래프의 색상을 구한다.
  for (let index = 0; index < xValueCount; index++) {
    todayGraphColor[index] = oneTodayGraphColor;
  }

  // 이전 그래프를 삭제한다.
  removePreviousGraph();

  // 막대 그래프를 만든다.
  var ctx = $("#chart").get(0);

  var currentOutput = new Array();

  var slopeIrradiationText = "경사 일사량(MJ/㎡)";
  var horizontalIrradiationText = "수평 일사량(MJ/㎡)";
  var irradiationText = "일사량(MJ/㎡)";
  var outputText = "전체 발전량(kWh)";
  var slopeIrradiationAreaText = "경사 일사량(kcal/㎡/day) 영역";
  var horizontalIrradiationAreaText = "수평 일사량(kcal/㎡/day) 영역";

  // 영역 차트의 배경색 설정
  var firstLineChartColor = "#004D77";
  var secondLineChartColor = "#009688";
  var thirdLineChartColor = "#00b0ff";
  var color = Chart.helpers.color;
  var firstLineChartBGColor = color(firstLineChartColor)
    .alpha(0.1)
    .rgbString();
  var secondLineChartBGColor = color(secondLineChartColor)
    .alpha(0.1)
    .rgbString();
  var labels = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
    "24",
    "25",
    "26",
    "27",
    "28",
    "29",
    "30",
    "31"
  ];
  var slopeIrradiationDatas = [
    1.91,
    0.69,
    1.45,
    2.17,
    2.31,
    2.01,
    1.08,
    2.22,
    1.44,
    2.08,
    1.64,
    2.21,
    2.34,
    0.87,
    2.48,
    2.49,
    2.46,
    2.32,
    2.23,
    1.96,
    0.93,
    2.52,
    2.34,
    2.3,
    2.48,
    2.54,
    2.17,
    0.9,
    2.14,
    1.93,
    1.39
  ];
  var horizontalIrradiationDatas = [
    2.92,
    0.27,
    1.15,
    4.08,
    4.54,
    3.38,
    0.48,
    4.29,
    1.1,
    3.73,
    1.75,
    4.26,
    4.61,
    0.34,
    0,
    0,
    0,
    4.57,
    4.3,
    3.15,
    0.37,
    0,
    4.61,
    4.52,
    0,
    0,
    4.09,
    0.35,
    3.97,
    2.99,
    0.99
  ];

  if (currentPowerData.length > 0) {
    currentOutput = currentPowerData;
  }

  // 첫 번째 차트의 옵션(영역 그래프 2개 + 막대 그래프 1개)을 정한다.
  var chartOption = {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          // Changes this dataset to become a line
          type: "line",
          label: slopeIrradiationText,
          data: slopeIrradiationDatas,
          fill: false,
          yAxisID: "y-axis-2",
          borderColor: firstLineChartColor,
          backgroundColor: firstLineChartBGColor,
          pointBackgroundColor: firstLineChartColor,
          borderWidth: 0.5
        },
        {
          // Changes this dataset to become a line
          type: "line",
          label: horizontalIrradiationText,
          data: horizontalIrradiationDatas,
          fill: false,
          yAxisID: "y-axis-2",
          borderColor: secondLineChartColor,
          backgroundColor: secondLineChartBGColor,
          pointBackgroundColor: secondLineChartColor,
          borderWidth: 0.5
        },
        {
          label: outputText,
          data: currentOutput,
          fill: false,
          yAxisID: "y-axis-1",
          borderColor: todayGraphColor,
          backgroundColor: todayGraphColor,
          borderWidth: 1
        },
        {
          // Changes this dataset to become a line
          type: "line",
          label: slopeIrradiationAreaText,
          data: slopeIrradiationDatas,
          fill: "start",
          yAxisID: "y-axis-2",
          borderColor: firstLineChartColor,
          backgroundColor: firstLineChartBGColor,
          pointBackgroundColor: firstLineChartColor,
          borderWidth: 0.5
        },
        {
          // Changes this dataset to become a line
          type: "line",
          label: horizontalIrradiationAreaText,
          data: horizontalIrradiationDatas,
          fill: "start",
          yAxisID: "y-axis-2",
          borderColor: secondLineChartColor,
          backgroundColor: secondLineChartBGColor,
          pointBackgroundColor: secondLineChartColor,
          borderWidth: 0.5
        }
      ]
    },
    options: {
      title: {
        display: false,
        text: "태양 전지 온도",
        fontSize: 12,
        position: "bottom"
      },
      scales: {
        yAxes: [
          {
            type: "linear",
            display: true,
            position: "left",
            id: "y-axis-1",
            scaleLabel: {
              display: true,
              labelString: outputText
            }
          },
          {
            type: "linear",
            display: true,
            position: "right",
            id: "y-axis-2",
            gridLines: {
              drawOnChartArea: false // only want the grid lines for one axis to show up
            },
            scaleLabel: {
              display: true,
              labelString: irradiationText
            }
          }
        ],
        xAxes: [
          {
            barThickness: 30,
            gridLines: {
              drawBorder: false,
              color: "white"
            }
          }
        ]
      },
      aspectRatio: 4
    }
  };

  var monthChart = new Chart(ctx, chartOption);
  return monthChart;
}
// 발전 시간 데이터가 있는 월간 차트를 그린다.
function drawDevelopmentTimeMonthChart(
  inverter1Data,
  inverter2Data,
  inverter3Data,
  inverter4Data,
  inverter5Data,
  slopeIrradiationDatas,
  horizontalIrradiationDatas
) {
  // 그래프 그리기
  var gridColor = "#dedede";
  var oneTodayGraphColor = "#00b0ff"; // 당일 전체 발전량 막대의 색상
  var todayGraphColor = new Array(); // 당일 전체 발전량 막대 그래프의 색상
  var xValueCount = 31; // x 값의 개수

  // 전일 전체 발전량 막대 그래프와 당일 전체 발전량 막대 그래프의 색상을 구한다.
  for (let index = 0; index < xValueCount; index++) {
    todayGraphColor[index] = oneTodayGraphColor;
  }

  // 이전 그래프를 삭제한다.
  removePreviousGraph();

  // 막대 그래프를 만든다.
  var ctx = $("#chart").get(0);

  var currentOutput = new Array();

  var slopeIrradiationText = "경사 일사량(MJ/㎡)";
  var horizontalIrradiationText = "수평 일사량(MJ/㎡)";
  var irradiationText = "일사량(MJ/㎡)";
  var outputText = "전체 발전량(kWh)";
  var slopeIrradiationAreaText = "경사 일사량(kcal/㎡/day) 영역";
  var horizontalIrradiationAreaText = "수평 일사량(kcal/㎡/day) 영역";

  // 영역 차트의 배경색 설정
  var firstLineChartColor = "#004D77";
  var secondLineChartColor = "#009688";
  var thirdLineChartColor = "#00b0ff";
  var color = Chart.helpers.color;
  var firstLineChartBGColor = color(firstLineChartColor)
    .alpha(0.1)
    .rgbString();
  var secondLineChartBGColor = color(secondLineChartColor)
    .alpha(0.1)
    .rgbString();
  var labels = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
    "24",
    "25",
    "26",
    "27",
    "28",
    "29",
    "30",
    "31"
  ];
  var slopeIrradiationDatas = [
    1.91,
    0.69,
    1.45,
    2.17,
    2.31,
    2.01,
    1.08,
    2.22,
    1.44,
    2.08,
    1.64,
    2.21,
    2.34,
    0.87,
    2.48,
    2.49,
    2.46,
    2.32,
    2.23,
    1.96,
    0.93,
    2.52,
    2.34,
    2.3,
    2.48,
    2.54,
    2.17,
    0.9,
    2.14,
    1.93,
    1.39
  ];
  var horizontalIrradiationDatas = [
    2.92,
    0.27,
    1.15,
    4.08,
    4.54,
    3.38,
    0.48,
    4.29,
    1.1,
    3.73,
    1.75,
    4.26,
    4.61,
    0.34,
    0,
    0,
    0,
    4.57,
    4.3,
    3.15,
    0.37,
    0,
    4.61,
    4.52,
    0,
    0,
    4.09,
    0.35,
    3.97,
    2.99,
    0.99
  ];

  if (currentPowerData.length > 0) {
    currentOutput = currentPowerData;
  }

  // 첫 번째 차트의 옵션(영역 그래프 2개 + 막대 그래프 1개)을 정한다.
  var chartOption = {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          // Changes this dataset to become a line
          type: "line",
          label: slopeIrradiationText,
          data: slopeIrradiationDatas,
          fill: false,
          yAxisID: "y-axis-2",
          borderColor: firstLineChartColor,
          backgroundColor: firstLineChartBGColor,
          pointBackgroundColor: firstLineChartColor,
          borderWidth: 0.5
        },
        {
          // Changes this dataset to become a line
          type: "line",
          label: horizontalIrradiationText,
          data: horizontalIrradiationDatas,
          fill: false,
          yAxisID: "y-axis-2",
          borderColor: secondLineChartColor,
          backgroundColor: secondLineChartBGColor,
          pointBackgroundColor: secondLineChartColor,
          borderWidth: 0.5
        },
        {
          label: outputText,
          data: currentOutput,
          fill: false,
          yAxisID: "y-axis-1",
          borderColor: todayGraphColor,
          backgroundColor: todayGraphColor,
          borderWidth: 1
        },
        {
          // Changes this dataset to become a line
          type: "line",
          label: slopeIrradiationAreaText,
          data: slopeIrradiationDatas,
          fill: "start",
          yAxisID: "y-axis-2",
          borderColor: firstLineChartColor,
          backgroundColor: firstLineChartBGColor,
          pointBackgroundColor: firstLineChartColor,
          borderWidth: 0.5
        },
        {
          // Changes this dataset to become a line
          type: "line",
          label: horizontalIrradiationAreaText,
          data: horizontalIrradiationDatas,
          fill: "start",
          yAxisID: "y-axis-2",
          borderColor: secondLineChartColor,
          backgroundColor: secondLineChartBGColor,
          pointBackgroundColor: secondLineChartColor,
          borderWidth: 0.5
        }
      ]
    },
    options: {
      title: {
        display: false,
        text: "태양 전지 온도",
        fontSize: 12,
        position: "bottom"
      },
      scales: {
        yAxes: [
          {
            type: "linear",
            display: true,
            position: "left",
            id: "y-axis-1",
            scaleLabel: {
              display: true,
              labelString: outputText
            }
          },
          {
            type: "linear",
            display: true,
            position: "right",
            id: "y-axis-2",
            gridLines: {
              drawOnChartArea: false // only want the grid lines for one axis to show up
            },
            scaleLabel: {
              display: true,
              labelString: irradiationText
            }
          }
        ],
        xAxes: [
          {
            barThickness: 30,
            gridLines: {
              drawBorder: false,
              color: "white"
            }
          }
        ]
      },
      aspectRatio: 4
    }
  };

  var monthChart = new Chart(ctx, chartOption);
  return monthChart;
}

// 라디오 버튼을 클릭하면 해당 데이터를 반영한 월간 차트로 갱신한다.
function addClickEventForMonthChart() {
  var inverter1Data = new Array();
  var inverter2Data = new Array();
  var inverter3Data = new Array();
  var inverter4Data = new Array();
  var inverter5Data = new Array();
  var slopeIrradiationDatas = new Array();
  var horizontalIrradiationDatas = new Array();
  var verticalBarChart = drawIrradiationMonthChart(
    monthPowerData,
    inverter1Data,
    inverter2Data,
    inverter3Data,
    inverter4Data,
    inverter5Data,
    slopeIrradiationDatas,
    horizontalIrradiationDatas
  );

  // 일사량 라디오 버튼을 클릭하면 일사량 데이터를 출력한다.
  $("#irradiation").click(function() {
    // 일사량 데이터가 들어간 차트를 만든다.
    var monthPowerData = getMonthPowerData();
    var inverter1Data = new Array();
    var inverter2Data = new Array();
    var inverter3Data = new Array();
    var inverter4Data = new Array();
    var inverter5Data = new Array();
    var slopeIrradiationDatas = new Array();
    var horizontalIrradiationDatas = new Array();
    var verticalBarChart = drawIrradiationMonthChart(
      monthPowerData,
      inverter1Data,
      inverter2Data,
      inverter3Data,
      inverter4Data,
      inverter5Data,
      slopeIrradiationDatas,
      horizontalIrradiationDatas
    );
  });

  // 온도 라디오 버튼을 클릭하면 온도 데이터를 출력한다.
  $("#temperature").click(function() {
    // 온도 데이터가 들어간 차트를 만든다.
    var monthPowerData = getMonthPowerData();
    var inverter1Data = new Array();
    var inverter2Data = new Array();
    var inverter3Data = new Array();
    var inverter4Data = new Array();
    var inverter5Data = new Array();
    var solarCellTemperatureDatas = new Array();
    var atmosphericTemperatureDatas = new Array();
    var verticalBarChart = drawTemperatureMonthChart(
      monthPowerData,
      inverter1Data,
      inverter2Data,
      inverter3Data,
      inverter4Data,
      inverter5Data,
      solarCellTemperatureDatas,
      atmosphericTemperatureDatas
    );
  });

  // 발전시간 라디오 버튼을 클릭하면 온도 데이터를 출력한다.
  $("#developmentTime").click(function() {
    // 발전시간이 들어간 차트를 만든다.
    var monthPowerData = getMonthPowerData();
    var inverter1Data = new Array();
    var inverter2Data = new Array();
    var inverter3Data = new Array();
    var inverter4Data = new Array();
    var inverter5Data = new Array();
    var developmentTimeDatas = new Array();
    var verticalBarChart = drawDevelopmentTimeMonthChart(
      monthPowerData,
      inverter1Data,
      inverter2Data,
      inverter3Data,
      inverter4Data,
      inverter5Data,
      developmentTimeDatas
    );
  });
}

// 월별 차트를 실행한다.
function runMonthChart(currentPowerData) {
  // 월별 차트를 만든다.
  var verticalBarChart = drawMonthChart(currentPowerData);

  // 라디오 버튼을 클릭하면 일사량 데이터를 출력한다.
  $("#irradiation").click(function() {
    var verticalBarChart = drawMonthChart(currentPowerData);
    handleClickMonthChart(this, verticalBarChart);
  });

  // 라디오 버튼을 클릭하면 온도 데이터를 출력한다.
  $("#temperature").click(function() {
    var verticalBarChart = drawMonthChart(currentPowerData);
    handleClickMonthChart(this, verticalBarChart);
  });
}

function drawYearChart(currentPowerData) {
  // 그래프 그리기
  var oneTodayGraphColor = "#00b0ff"; // 당일 전체 발전량 막대의 색상
  var todayGraphColor = new Array(); // 당일 전체 발전량 막대 그래프의 색상
  var xValueCount = 12; // x 값의 개수

  // 전일 전체 발전량 막대 그래프와 당일 전체 발전량 막대 그래프의 색상을 구한다.
  for (let index = 0; index < xValueCount; index++) {
    todayGraphColor[index] = oneTodayGraphColor;
  }

  // 이전 그래프를 삭제한다.
  removePreviousGraph();

  // 막대 그래프를 만든다.
  var ctx = $("#chart").get(0);

  var currentOutput = new Array();
  var outputText = "전체 발전량(kWh)";
  var slopeIrradiationText = "경사 일사량(MJ/㎡)";
  var horizontalIrradiationText = "수평 일사량(MJ/㎡)";
  var irradiationText = "일사량(MJ/㎡)";
  var slopeIrradiationAreaText = "경사 일사량(kcal/㎡/day) 영역";
  var horizontalIrradiationAreaText = "수평 일사량(kcal/㎡/day) 영역";

  // 영역 차트의 배경색 설정
  var firstLineChartColor = "#004D77";
  var secondLineChartColor = "#009688";
  var color = Chart.helpers.color;
  var firstLineChartBGColor = color(firstLineChartColor)
    .alpha(0.1)
    .rgbString();
  var secondLineChartBGColor = color(secondLineChartColor)
    .alpha(0.1)
    .rgbString();
  var labels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  var slopeIrradiationDatas = [
    4.62,
    5.13,
    5.26,
    5.04,
    5.55,
    5.32,
    5.85,
    5.36,
    4.79,
    4.82,
    4.61,
    3.96
  ];
  var horizontalIrradiationDatas = [
    2.02,
    2.78,
    3.52,
    4.38,
    4.73,
    4.43,
    3.3,
    3.59,
    3.56,
    3.08,
    2.07,
    1.75
  ];

  if (currentPowerData.length > 0) {
    currentOutput = currentPowerData;
  }

  // 첫 번째 차트의 옵션(영역 그래프 2개 + 막대 그래프 1개)을 정한다.
  var chartOption = {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          // Changes this dataset to become a line
          type: "line",
          label: slopeIrradiationText,
          data: slopeIrradiationDatas,
          fill: false,
          yAxisID: "y-axis-2",
          borderColor: firstLineChartColor,
          backgroundColor: firstLineChartBGColor,
          pointBackgroundColor: firstLineChartColor,
          borderWidth: 0.5
        },
        {
          // Changes this dataset to become a line
          type: "line",
          label: horizontalIrradiationText,
          data: horizontalIrradiationDatas,
          fill: false,
          yAxisID: "y-axis-2",
          borderColor: secondLineChartColor,
          backgroundColor: secondLineChartBGColor,
          pointBackgroundColor: secondLineChartColor,
          borderWidth: 0.5
        },
        {
          label: outputText,
          data: currentOutput,
          fill: false,
          yAxisID: "y-axis-1",
          borderColor: todayGraphColor,
          backgroundColor: todayGraphColor,
          borderWidth: 1
        },
        {
          // Changes this dataset to become a line
          type: "line",
          label: slopeIrradiationAreaText,
          data: slopeIrradiationDatas,
          fill: "start",
          yAxisID: "y-axis-2",
          borderColor: firstLineChartColor,
          backgroundColor: firstLineChartBGColor,
          pointBackgroundColor: firstLineChartColor,
          borderWidth: 0.5
        },
        {
          // Changes this dataset to become a line
          type: "line",
          label: horizontalIrradiationAreaText,
          data: horizontalIrradiationDatas,
          fill: "start",
          yAxisID: "y-axis-2",
          borderColor: secondLineChartColor,
          backgroundColor: secondLineChartBGColor,
          pointBackgroundColor: secondLineChartColor,
          borderWidth: 0.5
        }
      ]
    },
    options: {
      title: {
        display: false,
        text: "태양 전지 온도",
        fontSize: 12,
        position: "bottom"
      },
      scales: {
        yAxes: [
          {
            type: "linear",
            display: true,
            position: "left",
            id: "y-axis-1",
            scaleLabel: {
              display: true,
              labelString: outputText
            }
          },
          {
            type: "linear",
            display: true,
            position: "right",
            id: "y-axis-2",
            gridLines: {
              drawOnChartArea: false // only want the grid lines for one axis to show up
            },
            scaleLabel: {
              display: true,
              labelString: irradiationText
            }
          }
        ],
        xAxes: [
          {
            barThickness: 30,
            gridLines: {
              drawBorder: false,
              color: "white"
            }
          }
        ]
      },
      aspectRatio: 4
    }
  };

  var verticalBarChart = new Chart(ctx, chartOption);
  return verticalBarChart;
}

// 라디오 버튼을 클릭하면 해당 데이터를 반영한 연간 차트로 갱신한다.
function addClickEventForYearChart(myRadio, verticalBarChart) {
  var slopeIrradiationDatas = [
    4.62,
    5.13,
    5.26,
    5.04,
    5.55,
    5.32,
    5.85,
    5.36,
    4.79,
    4.82,
    4.61,
    3.96
  ];
  var horizontalIrradiationDatas = [
    2.02,
    2.78,
    3.52,
    4.38,
    4.73,
    4.43,
    3.3,
    3.59,
    3.56,
    3.08,
    2.07,
    1.75
  ];
  var solarCellTemperatureDatas = [
    -2.4,
    0.4,
    5.6,
    12.4,
    17.9,
    22.3,
    24.9,
    25.8,
    21.3,
    14.8,
    7.4,
    0.2
  ];
  var atmosphericTemperatureDatas = [
    -6.4,
    -4.4,
    1.6,
    8.4,
    13.9,
    18.3,
    20.9,
    21.8,
    17.3,
    10.8,
    3.4,
    -4.2
  ];
  var slopeIrradiationText = "경사 일사량(MJ/㎡)";
  var horizontalIrradiationText = "수평 일사량(MJ/㎡)";
  var atmosphericTemperatureText = "대기 온도(℃)";
  var solarCellTemperatureText = "모듈 온도(℃)";
  var irradiationText = "일사량(MJ/㎡)";
  var temperatureText = "온도(℃)";
  var slopeIrradiationAreaText = "경사 일사량(kcal/㎡/day) 영역";
  var horizontalIrradiationAreaText = "수평 일사량(kcal/㎡/day) 영역";
  var atmosphericTemperatureAreaText = "대기 온도(℃) 영역";
  var solarCellTemperatureAreaText = "태양 전지 온도(℃) 영역";

  // 일사량 라디오 버튼을 클릭하면
  if (myRadio.id == "irradiation") {
    // 온도 라디오 버튼의 상태를 수정한다.
    document.getElementById("temperature").checked = false;

    // 선 그래프의 범례를 일사량으로 수정한다.
    verticalBarChart.data.datasets[0].label = slopeIrradiationText;
    verticalBarChart.data.datasets[1].label = horizontalIrradiationText;
    verticalBarChart.data.datasets[3].label = slopeIrradiationAreaText;
    verticalBarChart.data.datasets[4].label = horizontalIrradiationAreaText;

    // 오른쪽 축 제목을 일사량으로 수정한다.
    verticalBarChart.options.scales.yAxes[1].scaleLabel.labelString = irradiationText;

    // 일사량 데이터를 수정한다.
    verticalBarChart.data.datasets[0].data = slopeIrradiationDatas;
    verticalBarChart.data.datasets[1].data = horizontalIrradiationDatas;
    verticalBarChart.data.datasets[3].data = slopeIrradiationDatas;
    verticalBarChart.data.datasets[4].data = horizontalIrradiationDatas;
  }
  // 온도 라디오 버튼을 클릭하면
  else {
    // 일사량 라디오 버튼의 상태를 수정한다.
    document.getElementById("irradiation").checked = false;

    // 선 그래프의 범례를 온도로 수정한다.
    verticalBarChart.data.datasets[0].label = atmosphericTemperatureText;
    verticalBarChart.data.datasets[1].label = solarCellTemperatureText;
    verticalBarChart.data.datasets[3].label = atmosphericTemperatureAreaText;
    verticalBarChart.data.datasets[4].label = solarCellTemperatureAreaText;

    // 오른쪽 축 제목을 온도로 수정한다.
    verticalBarChart.options.scales.yAxes[1].scaleLabel.labelString = temperatureText;

    // 온도 데이터를 수정한다.
    verticalBarChart.data.datasets[0].data = atmosphericTemperatureDatas;
    verticalBarChart.data.datasets[1].data = solarCellTemperatureDatas;
    verticalBarChart.data.datasets[3].data = atmosphericTemperatureDatas;
    verticalBarChart.data.datasets[4].data = solarCellTemperatureDatas;
  }
  verticalBarChart.update();
}

function runYearChart(currentPowerData) {
  // 차트를 만든다.
  var verticalBarChart = drawYearChart(currentPowerData);

  // 라디오 버튼을 클릭하면 일사량 데이터를 출력한다.
  $("#irradiation").click(function() {
    // 차트를 만든다.
    var verticalBarChart = drawYearChart(currentPowerData);
    handleClickYearChart(this, verticalBarChart);
  });

  // 라디오 버튼을 클릭하면 온도 데이터를 출력한다.
  $("#temperature").click(function() {
    // 차트를 만든다.
    var verticalBarChart = drawYearChart(currentPowerData);
    handleClickYearChart(this, verticalBarChart);
  });
}

// 전일 전체 발전량 데이터를 가져온다.
function getYesterdayPowerData() {
  var jsonUrl = "http://office.devzone.co.kr:8117/JSON/DB/H/SWOS/300/";
  var todayString = $("#workDate").val(); // 오늘 날짜 문자열
  var nowDate = new Date(todayString);
  var yesterday = nowDate.getTime() - 1 * 24 * 60 * 60 * 1000; // 어제 날짜
  nowDate.setTime(yesterday);
  var sYear = nowDate.getFullYear(); // 연도
  var sMonth = nowDate.getMonth() + 1; // 월
  var sDate = nowDate.getDate(); // 일

  sMonth = sMonth > 9 ? sMonth : "0" + sMonth;
  sDate = sDate > 9 ? sDate : "0" + sDate;

  var yesterdayString = sYear + "-" + sMonth + "-" + sDate; // 어제 날짜 문자열
  var url = jsonUrl + yesterdayString; // 전일 전체 발전량을 출력하는 데이터의 json url
  var powerData = new Array(); // 전일 전체 발전량 데이터

  // JSON으로 전일 전체 발전량 데이터를 가져온다.
  $.getJSON(url, function(data) {
    var items = new Array();
    $.each(data, function(key, val) {
      items.push(val);
    });
    powerData = items;
  });

  // 입력 데이터가 모두 0이면 샘플 데이터로 채운다.
  var zeroCount = 0;
  for (let index = 0; index < powerData.length; index++) {
    if (powerData[index] == 0) {
      zeroCount++;
    }
  }
  if (zeroCount == powerData.length) {
    powerData = todayPowerSampleData;
  }

  return powerData;
}

// 당일 전체 발전량 데이터를 가져온다.
function getTodayPowerData() {
  var jsonUrl = "http://office.devzone.co.kr:8117/JSON/DB/H/SWOS/300/";
  var todayPowerData = new Array(); // 가져온 당일 전체 발전량 데이터
  var inputDate = $("#workDate").val(); // 오늘 날짜 문자열
  var nowDate = new Date(inputDate);
  var sYear = nowDate.getFullYear(); // 연도
  var sMonth = nowDate.getMonth() + 1; // 월
  var sDate = nowDate.getDate(); // 일

  sMonth = sMonth > 9 ? sMonth : "0" + sMonth;
  sDate = sDate > 9 ? sDate : "0" + sDate;

  var todayString = sYear + "-" + sMonth + "-" + sDate; // 어제 날짜 문자열
  var url = jsonUrl + todayString; // 당일 전체 발전량을 출력하는 데이터의 json url

  // JSON으로 전일 전체 발전량 데이터를 가져온다.
  $.ajax({
    url: url,
    dataType: "json",
    async: false,
    success: function(data) {
      var items = new Array();
      $.each(data, function(key, val) {
        items.push(val);
      });
      todayPowerData = items;

      // 입력 데이터가 모두 0이면 샘플 데이터로 채운다.
      var zeroCount = 0;
      for (let index = 0; index < todayPowerData.length; index++) {
        if (todayPowerData[index] == 0) {
          zeroCount++;
        }
      }
      if (zeroCount == todayPowerData.length) {
        todayPowerData = todayPowerSampleData;
      }
    }
  });

  return todayPowerData;
}

/*
 * Date형을 yyyy-MM-dd형의 문자열로 변환
 */
function get_date_str(date) {
  var sYear = date.getFullYear();
  var sMonth = date.getMonth() + 1;

  sMonth = sMonth > 9 ? sMonth : "0" + sMonth;
  return sYear + "/" + sMonth;
}

// 당월 전체 발전량 데이터를 가져온다.
function GetMonthPowerData() {
  var inputDate = $("#workDate").val(); // 오늘 날짜 문자열
  var nowDate = new Date(inputDate);
  var currentString = get_date_str(nowDate); // 이번 달 문자열
  var jsonUrl = "http://office.devzone.co.kr:8117/JSON/DB/D/SWOS/300/";
  var currentPowerData = new Array(); // 가져온 당월 전체 발전량 데이터
  var currentDataUrl = jsonUrl + currentString; // 당월 전체 발전량을 출력하는 데이터의 json url

  // 당월 전체 발전량 데이터를 가져온다.
  $.ajax({
    url: currentDataUrl,
    dataType: "json",
    async: false,
    success: function(data) {
      var items = new Array();
      $.each(data, function(key, val) {
        items.push(val);
      });
      currentPowerData = items;
    }
  });

  return currentPowerData;
}

// 당해 전체 발전량 데이터를 가져온다.
function GetYearPowerData() {
  var inputDate = $("#workDate").val(); // 오늘 날짜 문자열
  var nowDate = new Date(inputDate);
  var currentString = nowDate.getFullYear();
  var jsonUrl = "http://office.devzone.co.kr:8117/JSON/DB/M/SWOS/300/";
  var currentPowerData = new Array(); // 가져온 올해 전체 발전량 데이터
  var currentDataUrl = jsonUrl + currentString; // 올해 전체 발전량을 출력하는 데이터의 json url

  // 당해 전체 발전량 데이터를 가져온다.
  $.ajax({
    url: currentDataUrl,
    dataType: "json",
    async: false,
    success: function(data) {
      var items = new Array();
      $.each(data, function(key, val) {
        items.push(val);
      });
      currentPowerData = items;
    }
  });

  return currentPowerData;
}

// Home 화면의 시간대별 생산량 차트 관련 함수

// 실시간 라벨을 만든다.
function makeRealTimeLabel() {
  var labels = new Array();
  var today = new Date(); // 오늘 날짜 정보
  var currentHour = today.getHours(); // 현재 시간
  var startHour = 4; // 시작 시간은 4시이다.

  for (let index = 0; index <= currentHour - 4; index++) {
    labels[index] = startHour + ":00";
    startHour++;
  }

  return labels;
}

// 경사 일사량과 수평 일사량 데이터가 있는 차트를 그린다.
function drawIrradiationChart(powerData) {
  // 온도 라디오 버튼의 상태를 수정한다.
  document.getElementById("temperature").checked = false;
  // 발전시간 라디오 버튼의 상태를 수정한다.
  document.getElementById("developmentTime").checked = false;

  // 그래프 그리기
  var gridColor = "#dedede";
  var graphColor = [
    "#00b0ff",
    "#00b0ff",
    "#00b0ff",
    "#00b0ff",
    "#00b0ff",
    "#00b0ff",
    "#00b0ff",
    "#00b0ff",
    "#00b0ff",
    "#00b0ff",
    "#00b0ff",
    "#00b0ff",
    "#00b0ff",
    "#00b0ff",
    "#00b0ff",
    "#00b0ff",
    "#00b0ff",
    "#00b0ff",
    "#00b0ff"
  ];
  var yesterdayGraphColor = new Array(); // 전일 발전량 막대 그래프의 색상
  var todayGraphColor = new Array(); // 당일 발전량 막대 그래프의 색상
  var currentHour = new Date().getHours(); // 현재 시간
  var xValueCount = currentHour - 3; // x 값의 개수
  var oneYesterdayGraphColor = "#ffcc33"; // 전일 발전량 막대의 색상
  var oneTodayGraphColor = "#00b0ff"; // 당일 발전량 막대의 색상

  // 전일 발전량 막대 그래프와 당일 발전량 막대 그래프의 색상을 구한다.
  for (let index = 0; index < xValueCount; index++) {
    yesterdayGraphColor[index] = oneYesterdayGraphColor;
    todayGraphColor[index] = oneTodayGraphColor;
  }

  // 이전 그래프를 삭제한다.
  removePreviousGraph();

  // 막대 그래프를 만든다.
  var ctx = $("#chart").get(0);

  var todayOutput = new Array(); // 당일 발전량
  var yesterdayOutput = new Array(); // 전일 발전량
  var slopeIrradiationDatas = new Array(); // 경사 일사량
  var horizontalIrradiationDatas = new Array(); // 수평 일사량

  var slopeIrradiationText = "경사 일사량(MJ/㎡)";
  var horizontalIrradiationText = "수평 일사량(MJ/㎡)";
  var irradiationText = "일사량(MJ/㎡)";
  var todayOutputText = "당일 발전량(kWh)";
  var yesterdayOutputText = "전일 발전량(kWh)";
  var slopeIrradiationAreaText = "경사 일사량(kcal/㎡/day) 영역";
  var horizontalIrradiationAreaText = "수평 일사량(kcal/㎡/day) 영역";

  // 영역 차트의 배경색 설정
  var firstLineChartColor = "#004D77";
  var secondLineChartColor = "#009688";
  var thirdLineChartColor = "#00b0ff";
  var color = Chart.helpers.color;
  var firstLineChartBGColor = color(firstLineChartColor)
    .alpha(0.1)
    .rgbString();
  var secondLineChartBGColor = color(secondLineChartColor)
    .alpha(0.1)
    .rgbString();
  var todayPowerChartBGColor = color(thirdLineChartColor)
    .alpha(0.5)
    .rgbString();
  var yesterdayPowerChartBGColor = color(thirdLineChartColor)
    .alpha(0.3)
    .rgbString();

  // x 축 라벨을 현재 시간에 맞게 만든다.
  var labels = makeRealTimeLabel(); // 차트의 x축 라벨

  var i = 0; // 전일 발전량의 인덱스
  var j = 0; // 당일 발전량의 인덱스

  for (var index = 0; index < powerData.length; index++) {
    // 어제 4시부터 현재 시간까지 경사 일사량, 수평 일사량, 전일 발전량을 추출한다.
    if (index >= 4 && index <= currentHour) {
      // 경사 일사량을 추출한다.
      slopeIrradiationDatas[i] = slopeIrradiationSampleDatas[index];
      // 수평 일사량을 추출한다.
      horizontalIrradiationDatas[i] = horizontalIrradiationSampleDatas[index];
      // 전일 발전량을 추출한다.
      yesterdayOutput[i] = powerData[index];
      i++;
    }
    // 금일 4시부터 현재 시간까지 당일 발전량을 추출한다.
    else if (index >= 28 && index < 28 + currentHour - 3) {
      todayOutput[j] = powerData[index];
      j++;
    }
  }

  // 차트의 옵션을 정한다.
  var chartOption = {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          // Changes this dataset to become a line
          type: "line",
          label: slopeIrradiationText,
          data: slopeIrradiationDatas,
          fill: false,
          yAxisID: "y-axis-2",
          borderColor: firstLineChartColor,
          backgroundColor: firstLineChartBGColor,
          pointBackgroundColor: firstLineChartColor,
          borderWidth: 0.5
        },
        {
          // Changes this dataset to become a line
          type: "line",
          label: horizontalIrradiationText,
          data: horizontalIrradiationDatas,
          fill: false,
          yAxisID: "y-axis-2",
          borderColor: secondLineChartColor,
          backgroundColor: secondLineChartBGColor,
          pointBackgroundColor: secondLineChartColor,
          borderWidth: 0.5
        },
        {
          label: yesterdayOutputText,
          data: yesterdayOutput,
          fill: false,
          yAxisID: "y-axis-1",
          borderColor: yesterdayGraphColor,
          backgroundColor: yesterdayGraphColor,
          borderWidth: 1
        },
        {
          label: todayOutputText,
          data: todayOutput,
          fill: false,
          yAxisID: "y-axis-1",
          borderColor: todayGraphColor,
          backgroundColor: todayGraphColor,
          borderWidth: 1
        }
      ]
    },
    options: {
      // Boolean - whether or not the chart should be responsive and resize when the browser does.
      responsive: true,

      // Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
      maintainAspectRatio: false,
      title: {
        display: false,
        text: "태양 전지 온도",
        fontSize: 12,
        position: "bottom"
      },
      scales: {
        yAxes: [
          {
            type: "linear",
            display: true,
            position: "left",
            id: "y-axis-1",
            scaleLabel: {
              display: true,
              labelString: todayOutputText
            }
          },
          {
            type: "linear",
            display: true,
            position: "right",
            id: "y-axis-2",
            gridLines: {
              drawOnChartArea: false // only want the grid lines for one axis to show up
            },
            scaleLabel: {
              display: true,
              labelString: irradiationText
            }
          }
        ],
        xAxes: [
          {
            barThickness: 10,
            gridLines: {
              drawBorder: false,
              color: "white"
            }
          }
        ]
      },
      aspectRatio: 4
    }
  };

  var verticalBarChart = new Chart(ctx, chartOption);
  return verticalBarChart;
}

// 모듈 온도와 대기 온도 데이터가 있는 차트를 그린다.
function drawTemperatureChart(powerData) {
  // 일사량 라디오 버튼의 상태를 수정한다.
  document.getElementById("irradiation").checked = false;
  // 발전시간 라디오 버튼의 상태를 수정한다.
  document.getElementById("developmentTime").checked = false;

  // 그래프 그리기
  var gridColor = "#dedede";
  var graphColor = [
    "#00b0ff",
    "#00b0ff",
    "#00b0ff",
    "#00b0ff",
    "#00b0ff",
    "#00b0ff",
    "#00b0ff",
    "#00b0ff",
    "#00b0ff",
    "#00b0ff",
    "#00b0ff",
    "#00b0ff",
    "#00b0ff",
    "#00b0ff",
    "#00b0ff",
    "#00b0ff",
    "#00b0ff",
    "#00b0ff",
    "#00b0ff"
  ];
  var yesterdayGraphColor = new Array(); // 전일 발전량 막대 그래프의 색상
  var todayGraphColor = new Array(); // 당일 발전량 막대 그래프의 색상
  var currentHour = new Date().getHours(); // 현재 시간
  var xValueCount = currentHour - 3; // x 값의 개수
  var oneYesterdayGraphColor = "#ffcc33"; // 전일 발전량 막대의 색상
  var oneTodayGraphColor = "#00b0ff"; // 당일 발전량 막대의 색상

  // 전일 발전량 막대 그래프와 당일 발전량 막대 그래프의 색상을 구한다.
  for (let index = 0; index < xValueCount; index++) {
    yesterdayGraphColor[index] = oneYesterdayGraphColor;
    todayGraphColor[index] = oneTodayGraphColor;
  }

  // 이전 그래프를 삭제한다.
  removePreviousGraph();

  // 막대 그래프를 만든다.
  var ctx = $("#chart").get(0);

  var todayOutput = new Array(); // 당일 발전량
  var yesterdayOutput = new Array(); // 전일 발전량
  var solarCellTemperatureDatas = new Array(); // 모듈 온도
  var atmosphericTemperatureDatas = new Array(); // 대기 온도

  var solarCellTemperatureText = "모듈 온도(℃)";
  var atmosphericTemperatureText = "대기 온도(℃)";
  var temperatureText = "온도(℃)";
  var todayOutputText = "당일 발전량(kWh)";
  var yesterdayOutputText = "전일 발전량(kWh)";
  var solarCellTemperatureAreaText = "모듈 온도(℃) 영역";
  var atmosphericTemperatureAreaText = "대기 온도(℃) 영역";

  // 영역 차트의 배경색 설정
  var firstLineChartColor = "#004D77";
  var secondLineChartColor = "#009688";
  var thirdLineChartColor = "#00b0ff";
  var color = Chart.helpers.color;
  var firstLineChartBGColor = color(firstLineChartColor)
    .alpha(0.1)
    .rgbString();
  var secondLineChartBGColor = color(secondLineChartColor)
    .alpha(0.1)
    .rgbString();
  var todayPowerChartBGColor = color(thirdLineChartColor)
    .alpha(0.5)
    .rgbString();
  var yesterdayPowerChartBGColor = color(thirdLineChartColor)
    .alpha(0.3)
    .rgbString();

  // x 축 라벨을 현재 시간에 맞게 만든다.
  var labels = makeRealTimeLabel(); // 차트의 x축 라벨

  var i = 0; // 전일 발전량의 인덱스
  var j = 0; // 당일 발전량의 인덱스
  for (var index = 0; index < powerData.length; index++) {
    // 어제 4시부터 현재 시간까지 모듈 온도, 대기 온도, 전일 발전량을 추출한다.
    if (index >= 4 && index <= currentHour) {
      // 모듈 온도를 추출한다.
      solarCellTemperatureDatas[i] = solarCellTemperatureSampleDatas[index];
      // 대기 온도를 추출한다.
      atmosphericTemperatureDatas[i] = atmosphericTemperatureSampleDatas[index];
      // 전일 발전량을 추출한다.
      yesterdayOutput[i] = powerData[index];
      i++;
    }
    // 금일 4시부터 현재 시간까지 당일 발전량을 추출한다.
    else if (index >= 28 && index < 28 + currentHour - 3) {
      todayOutput[j] = powerData[index];
      j++;
    }
  }
  // 차트의 옵션을 정한다.
  var chartOption = {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          // Changes this dataset to become a line
          type: "line",
          label: solarCellTemperatureText,
          data: solarCellTemperatureDatas,
          fill: false,
          yAxisID: "y-axis-2",
          borderColor: firstLineChartColor,
          backgroundColor: firstLineChartBGColor,
          pointBackgroundColor: firstLineChartColor,
          borderWidth: 0.5
        },
        {
          // Changes this dataset to become a line
          type: "line",
          label: atmosphericTemperatureText,
          data: atmosphericTemperatureDatas,
          fill: false,
          yAxisID: "y-axis-2",
          borderColor: secondLineChartColor,
          backgroundColor: secondLineChartBGColor,
          pointBackgroundColor: secondLineChartColor,
          borderWidth: 0.5
        },
        {
          label: yesterdayOutputText,
          data: yesterdayOutput,
          fill: false,
          yAxisID: "y-axis-1",
          borderColor: yesterdayGraphColor,
          backgroundColor: yesterdayGraphColor,
          borderWidth: 1
        },
        {
          label: todayOutputText,
          data: todayOutput,
          fill: false,
          yAxisID: "y-axis-1",
          borderColor: todayGraphColor,
          backgroundColor: todayGraphColor,
          borderWidth: 1
        }
      ]
    },
    options: {
      // Boolean - whether or not the chart should be responsive and resize when the browser does.
      responsive: true,

      // Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
      maintainAspectRatio: false,
      title: {
        display: false,
        text: "태양 전지 온도",
        fontSize: 12,
        position: "bottom"
      },
      scales: {
        yAxes: [
          {
            type: "linear",
            display: true,
            position: "left",
            id: "y-axis-1",
            scaleLabel: {
              display: true,
              labelString: todayOutputText
            }
          },
          {
            type: "linear",
            display: true,
            position: "right",
            id: "y-axis-2",
            gridLines: {
              drawOnChartArea: false // only want the grid lines for one axis to show up
            },
            scaleLabel: {
              display: true,
              labelString: temperatureText
            }
          }
        ],
        xAxes: [
          {
            barThickness: 10,
            gridLines: {
              drawBorder: false,
              color: "white"
            }
          }
        ]
      },
      aspectRatio: 4
    }
  };

  var verticalBarChart = new Chart(ctx, chartOption);
  return verticalBarChart;
}

// 발전 시간 데이터가 있는 차트를 그린다.
function drawDevelopmentTimeChart(powerData) {
  // 일사량 라디오 버튼의 상태를 수정한다.
  document.getElementById("irradiation").checked = false;
  // 온도 라디오 버튼의 상태를 수정한다.
  document.getElementById("temperature").checked = false;

  // 그래프 그리기
  var gridColor = "#dedede";
  var graphColor = [
    "#00b0ff",
    "#00b0ff",
    "#00b0ff",
    "#00b0ff",
    "#00b0ff",
    "#00b0ff",
    "#00b0ff",
    "#00b0ff",
    "#00b0ff",
    "#00b0ff",
    "#00b0ff",
    "#00b0ff",
    "#00b0ff",
    "#00b0ff",
    "#00b0ff",
    "#00b0ff",
    "#00b0ff",
    "#00b0ff",
    "#00b0ff"
  ];
  var yesterdayGraphColor = new Array(); // 전일 발전량 막대 그래프의 색상
  var todayGraphColor = new Array(); // 당일 발전량 막대 그래프의 색상
  var currentHour = new Date().getHours(); // 현재 시간
  var xValueCount = currentHour - 3; // x 값의 개수
  var oneYesterdayGraphColor = "#ffcc33"; // 전일 발전량 막대의 색상
  var oneTodayGraphColor = "#00b0ff"; // 당일 발전량 막대의 색상

  // 전일 발전량 막대 그래프와 당일 발전량 막대 그래프의 색상을 구한다.
  for (let index = 0; index < xValueCount; index++) {
    yesterdayGraphColor[index] = oneYesterdayGraphColor;
    todayGraphColor[index] = oneTodayGraphColor;
  }

  // 이전 그래프를 삭제한다.
  removePreviousGraph();

  // 막대 그래프를 만든다.
  var ctx = $("#chart").get(0);

  var todayOutput = new Array(); // 당일 발전량
  var yesterdayOutput = new Array(); // 전일 발전량
  var developmentTimeDatas = new Array(); // 발전 시간
  var developmentTimeText = "발전시간(h)";
  var developmentTimeAreaText = "발전시간(h) 영역";
  var todayOutputText = "당일 발전량(kWh)";
  var yesterdayOutputText = "전일 발전량(kWh)";

  // 영역 차트의 배경색 설정
  var firstLineChartColor = "#004D77";
  var secondLineChartColor = "#009688";
  var thirdLineChartColor = "#00b0ff";
  var color = Chart.helpers.color;
  var firstLineChartBGColor = color(firstLineChartColor)
    .alpha(0.1)
    .rgbString();
  var todayPowerChartBGColor = color(thirdLineChartColor)
    .alpha(0.5)
    .rgbString();
  var yesterdayPowerChartBGColor = color(thirdLineChartColor)
    .alpha(0.3)
    .rgbString();

  // x 축 라벨을 현재 시간에 맞게 만든다.
  var labels = makeRealTimeLabel(); // 차트의 x축 라벨

  var i = 0; // 전일 발전량의 인덱스
  var j = 0; // 당일 발전량의 인덱스
  for (var index = 0; index < powerData.length; index++) {
    // 어제 4시부터 현재 시간까지 발전 시간과 전일 발전량을 추출한다.
    if (index >= 4 && index <= currentHour) {
      // 발전 시간으 추출한다.
      developmentTimeDatas[i] = developmentTimeSampleDatas[index];
      // 전일 발전량을 추출한다.
      yesterdayOutput[i] = powerData[index];
      i++;
    }
    // 금일 4시부터 현재 시간까지 당일 발전량을 추출한다.
    else if (index >= 28 && index < 28 + currentHour - 3) {
      todayOutput[j] = powerData[index];
      j++;
    }
  }

  // 차트의 옵션을 정한다.
  var chartOption = {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          // Changes this dataset to become a line
          type: "line",
          label: developmentTimeText,
          data: developmentTimeDatas,
          fill: false,
          yAxisID: "y-axis-2",
          borderColor: firstLineChartColor,
          backgroundColor: firstLineChartBGColor,
          pointBackgroundColor: firstLineChartColor,
          borderWidth: 0.5
        },
        {
          label: yesterdayOutputText,
          data: yesterdayOutput,
          fill: false,
          yAxisID: "y-axis-1",
          borderColor: yesterdayGraphColor,
          backgroundColor: yesterdayGraphColor,
          borderWidth: 1
        },
        {
          label: todayOutputText,
          data: todayOutput,
          fill: false,
          yAxisID: "y-axis-1",
          borderColor: todayGraphColor,
          backgroundColor: todayGraphColor,
          borderWidth: 1
        }
      ]
    },
    options: {
      // Boolean - whether or not the chart should be responsive and resize when the browser does.
      responsive: true,

      // Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
      maintainAspectRatio: false,
      title: {
        display: false,
        text: "태양 전지 온도",
        fontSize: 12,
        position: "bottom"
      },
      scales: {
        yAxes: [
          {
            type: "linear",
            display: true,
            position: "left",
            id: "y-axis-1",
            scaleLabel: {
              display: true,
              labelString: todayOutputText
            }
          },
          {
            type: "linear",
            display: true,
            position: "right",
            id: "y-axis-2",
            gridLines: {
              drawOnChartArea: false // only want the grid lines for one axis to show up
            },
            scaleLabel: {
              display: true,
              labelString: developmentTimeText
            }
          }
        ],
        xAxes: [
          {
            barThickness: 10,
            gridLines: {
              drawBorder: false,
              color: "white"
            }
          }
        ]
      },
      aspectRatio: 4
    }
  };

  var verticalBarChart = new Chart(ctx, chartOption);
  return verticalBarChart;
}

// 시간대별 생산량 차트의 클릭 이벤트를 실행한다.
function addClickEventForHourChart() {
  // 일사량 라디오 버튼을 클릭하면 일사량 데이터를 출력한다.
  $("#irradiation").click(function() {
    // 발전량 데이터를 가져온다.
    var powerData = getPowerData();
    // 일사량 데이터가 들어간 차트를 만든다.
    var verticalBarChart = drawIrradiationChart(powerData);
  });

  // 온도 라디오 버튼을 클릭하면 온도 데이터를 출력한다.
  $("#temperature").click(function() {
    // 발전량 데이터를 가져온다.
    var powerData = getPowerData();
    // 온도 데이터가 들어간 차트를 만든다.
    var verticalBarChart = drawTemperatureChart(powerData);
  });

  // 발전시간 라디오 버튼을 클릭하면 온도 데이터를 출력한다.
  $("#developmentTime").click(function() {
    // 발전량 데이터를 가져온다.
    var powerData = getPowerData();
    // 발전시간이 들어간 차트를 만든다.
    var verticalBarChart = drawDevelopmentTimeChart(powerData);
  });
}
