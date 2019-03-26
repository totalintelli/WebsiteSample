//columns in data array : Sr No, Company Name, Revenues(domestic), Revenues(export), expenditure
var data = [
  [
    1,
    "2019-02-26",
    "05:00",
    0.0,
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
  ],
  [
    2,
    "2019-02-26",
    "05:00",
    0.0,
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
  ],
  [
    3,
    "2019-02-26",
    "05:00",
    0.0,
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
  ],
  [
    4,
    "2019-02-26",
    "05:00",
    0.0,
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
  ],
  [
    5,
    "2019-02-26",
    "05:00",
    0.0,
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
  ],
  [
    6,
    "2019-02-26",
    "05:00",
    0.0,
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
  ],
  [
    7,
    "2019-02-26",
    "05:00",
    0.0,
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
  ],
  [
    8,
    "2019-02-26",
    "05:00",
    0.0,
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
  ],
  [
    9,
    "2019-02-26",
    "05:00",
    0.0,
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
  ],
  [
    10,
    "2019-02-26",
    "05:00",
    0.0,
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
  ],
  [
    11,
    "2019-02-26",
    "05:00",
    0.0,
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
  ],
  [
    12,
    "2019-02-26",
    "05:00",
    0.0,
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
  ],
  ["", "", "합계/평균", 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
];

// 초기 입력값은 오늘 날짜로 한다.
var start = moment();
var end = moment();

// 텍스트 박스의 출력값을 정한다.
function cb(start, end) {
  $("#reportrange span").html(
    start.format("YYYY-MM-DD") + " ~ " + end.format("YYYY-MM-DD")
  );
}

// 팝업 창을 만든다.
$("#reportrange").daterangepicker(
  {
    // 영어를 한국어로 번역한다.
    locale: {
      format: "YYYY-MM-DD",
      separator: " ~ ",
      applyLabel: "적용",
      cancelLabel: "취소",
      fromLabel: "From",
      toLabel: "To",
      customRangeLabel: "직접선택",
      daysOfWeek: ["일", "월", "화", "수", "목", "금", "토"],
      monthNames: [
        "1월",
        "2월",
        "3월",
        "4월",
        "5월",
        "6월",
        "7월",
        "8월",
        "9월",
        "10월",
        "11월",
        "12월"
      ],
      firstDay: 1
    },
    startDate: start,
    endDate: end,
    // Custom Range의 최대값을 30일로 한다.
    maxSpan: {
      days: 30
    },
    showDropdowns: false,
    autoApply: true,
    dateLimit: {
      days: 32
    },
    ranges: {
      금일: [moment(), moment()],
      전일: [moment().subtract(1, "days"), moment().subtract(1, "days")],
      "지난 한 주": [moment().subtract(6, "days"), moment()],
      "지난 30일": [moment().subtract(29, "days"), moment()],
      이번달: [moment().startOf("month"), moment().endOf("month")],
      지난달: [
        moment()
          .subtract(1, "month")
          .startOf("month"),
        moment()
          .subtract(1, "month")
          .endOf("month")
      ]
    },
    opens: "left"
  },
  cb
);
cb(start, end);

// 인버터 표를 그린다.
function drawInverterTable(isNewData) {
  //   for (var i = 0; i < data.length; i++) {
  //     //rev(total)
  //     var revDom = parseFloat(data[i][3].replace(",", ""));
  //     var revExp = parseFloat(data[i][4].replace(",", ""));
  //     var expenditure = parseFloat(data[i][5].replace(",", ""));
  //     data[i][6] = revTotal = revDom + revExp;
  //     //profits
  //     data[i][7] = revTotal - expenditure;
  //   }
  //   //calculate Rank based on profits
  //   data = data.sort(function(obj1, obj2) {
  //     var val1 = obj1[7];
  //     var val2 = obj2[7];
  //     val1 = val1 ? parseInt(val1) : 0;
  //     val2 = val2 ? parseInt(val2) : 0;

  //     return val2 - val1;
  //   });
  //   for (var i = 0; i < data.length; i++) {
  //     var rdata = data[i];
  //     //Rank
  //     rdata[8] = i + 1;
  //     rdata[9] = Math.random();
  //     rdata[10] = Math.random();
  //     rdata[11] = Math.random();
  //     rdata[12] = Math.random();
  //     rdata[13] = Math.random();
  //     rdata[14] = Math.random();
  //     rdata[15] = Math.random();
  //     rdata[16] = Math.random();
  //   }

  var obj = {
    width: "auto",
    showBottom: true,
    collapsible: true,
    selectionModel: { swipe: true },
    numberCell: { show: false },
    editable: false,
    resizable: false,
    sorting: "local",
    sortorder: "desc",
    height: 'flex',
    scrollModel: {autoFit: true},
    toolbar: {
      cls: 'pq-toolbar-export',
      items: [{
        type: 'button',
        label: 'Excel',
        icon: 'ui-icon-document',
        listeners: [{
          "click": function (evt) {
            $("#grid_group").pqGrid("exportCsv", {url: "/pro/demos/excel"});
          }
        }]
      }]
    }
  };
  obj.columnTemplate = { width: 100 };

  const reportType = $("#reportType").val(); // 보고서 종류

  var dateText = "";
  if (reportType === "년간") {
    dateText = "연월";
  } else {
    dateText = "일자";
  }

  // 세부항목을 확인한다.
  if ($("#detailItem").val() === "전체") {
    // 보고서 종류를 확인한다.
    if (reportType === "일일") {
      // 표의 헤더를 수정한다.
      obj.colModel = [
        { title: "구분", align: "center", width: 40 },
        { title: dateText, align: "center" },
        { title: "시간", align: "center", width: 84 },
        { title: "INV-1 (kWh)" },
        { title: "INV-2 (kWh)" },
        { title: "INV-3 (kWh)" },
        { title: "INV-4 (kWh)" },
        { title: "INV-5 (kWh)" },
        { title: "전체 발전량 (kWh)", width: 140 },
        { title: "발전시간" },
        {
          title: "일사량(W/㎡)",
          width: 140,
          align: "center",
          dataType: "float",
          colModel: [
            {
              title: "경사"
            },
            {
              title: "수평"
            }
          ]
        },
        {
          title: "온 도(℃)",
          width: 140,
          dataType: "float",
          align: "center",
          colModel: [{ title: "모듈" }, { title: "대기" }]
        }
      ];
    } else {
      // 표의 헤더를 수정한다.
      obj.colModel = [
        { title: "구분", align: "center", width: 40 },
        { title: dateText, align: "center" },
        { title: "INV-1 (kWh)" },
        { title: "INV-2 (kWh)" },
        { title: "INV-3 (kWh)" },
        { title: "INV-4 (kWh)" },
        { title: "INV-5 (kWh)" },
        { title: "전체 발전량 (kWh)", width: 140 },
        { title: "발전시간" },
        {
          title: "일사량(W/㎡)",
          width: 140,
          align: "center",
          dataType: "float",
          colModel: [
            {
              title: "경사"
            },
            {
              title: "수평"
            }
          ]
        },
        {
          title: "온 도(℃)",
          width: 140,
          dataType: "float",
          align: "center",
          colModel: [{ title: "모듈" }, { title: "대기" }]
        }
      ];
    }
  } else {
    // 보고서 종류를 확인한다.
    if (reportType === "일일") {
      // 표의 헤더를 수정한다.
      obj.colModel = [
        { title: "구분", align: "center", width: 40 },
        { title: dateText, align: "center" },
        { title: "시간", align: "center", width: 84 },
        {
          title: "DC",
          align: "center",
          dataType: "float",
          colModel: [
            {
              title: "전압(V)"
            },
            {
              title: "전류(A)"
            },
            {
              title: "입력(kW)"
            }
          ]
        },
        {
          title: "AC",
          align: "center",
          dataType: "float",
          colModel: [
            {
              title: "전압(RS)"
            },
            {
              title: "전압(ST)"
            },
            {
              title: "전압(TR)"
            },
            {
              title: "전류(R)"
            },
            {
              title: "전류(S)"
            },
            {
              title: "전류(T)"
            },
            {
              title: "출력(kW)"
            },
            {
              title: "발전량(kWh)"
            },
            {
              title: "누적발전량(kWh)",
              width: 140
            },
            {
              title: "주파수"
            },
            {
              title: "역률"
            }
          ]
        },
        { title: "발전시간" },
        {
          title: "일사량(W/㎡)",
          width: 140,
          align: "center",
          dataType: "float",
          colModel: [
            {
              title: "경사"
            },
            {
              title: "수평"
            }
          ]
        },
        {
          title: "온 도(℃)",
          width: 140,
          dataType: "float",
          align: "center",
          colModel: [{ title: "모듈" }, { title: "대기" }]
        }
      ];
    } else {
      // 표의 헤더를 수정한다.
      obj.colModel = [
        { title: "구분", align: "center", width: 40 },
        { title: dateText, align: "center" },
        {
          title: "DC",
          align: "center",
          dataType: "float",
          colModel: [
            {
              title: "전압(V)"
            },
            {
              title: "전류(A)"
            },
            {
              title: "입력(kW)"
            }
          ]
        },
        {
          title: "AC",
          align: "center",
          dataType: "float",
          colModel: [
            {
              title: "전압(RS)"
            },
            {
              title: "전압(ST)"
            },
            {
              title: "전압(TR)"
            },
            {
              title: "전류(R)"
            },
            {
              title: "전류(S)"
            },
            {
              title: "전류(T)"
            },
            {
              title: "출력(kW)"
            },
            {
              title: "발전량(kWh)"
            },
            {
              title: "누적발전량(kWh)",
              width: 140
            },
            {
              title: "주파수"
            },
            {
              title: "역률"
            }
          ]
        },
        { title: "발전시간" },
        {
          title: "일사량(W/㎡)",
          width: 140,
          align: "center",
          dataType: "float",
          colModel: [
            {
              title: "경사"
            },
            {
              title: "수평"
            }
          ]
        },
        {
          title: "온 도(℃)",
          width: 140,
          dataType: "float",
          align: "center",
          colModel: [{ title: "모듈" }, { title: "대기" }]
        }
      ];
    }
  }

  obj.dataModel = {
    data: data,
    sortIndx: 1,
    sortDir: "down"
  };

  obj.pageModel = {
    type: "local",
    rPP: 17,
    strRpp: "{0}",
    strDisplay: "보기 {0} - {1} / {2}",
    rPPOptions: [17]
  };

  if (isNewData) {
    // 표를 삭제한다.
    $("#grid_group").pqGrid("destroy");
  }

  // 표를 만든다.
  $("#grid_group").pqGrid(obj);

  // 페이지 링크에 색상을 적용한다.
  const grid_group = document.getElementById("grid_group");
  const page = grid_group.childNodes[2];
  page.classList.remove("ui-widget-header");
}
drawInverterTable(false);

// 접속반 표를 그린다.
function drawConnectionClassTable() {
  var obj = {
    width: "auto",
    showBottom: true,
    collapsible: true,
    selectionModel: { swipe: true },
    numberCell: { show: false },
    editable: false,
    resizable: false,
    sorting: "local",
    sortorder: "desc",
    height: 'flex',
    scrollModel: {autoFit: true},
    toolbar: {
      cls: 'pq-toolbar-export',
      items: [{
        type: 'button',
        label: 'Excel',
        icon: 'ui-icon-document',
        listeners: [{
          "click": function (evt) {
            $("#grid_group").pqGrid("exportCsv", {url: "/pro/demos/excel"});
          }
        }]
      }]
    }
  };
  obj.columnTemplate = { width: 100 };

  const reportType = $("#reportType").val(); // 보고서 종류
  const detailItem = $("#detailItem").val(); // 세부항목
  var dateText = "일자";
  var groupName = ""; // 그룹 이름
  var singleName = ""; // 개별 이름

  // 세부항목을 확인한다.
  if (detailItem === "전체") {
    // 표의 헤더를 수정한다.
    obj.colModel = [
      { title: "구분", align: "center", width: 40 },
      { title: dateText, align: "center" },
      { title: "시간", align: "center", width: 84 },
      {
        title: "전체 접속반",
        align: "center",
        dataType: "float",
        colModel: [
          {
            title: "A-1 (A)"
          },
          {
            title: "A-2 (A)"
          },
          {
            title: "A-3 (A)"
          },
          {
            title: "A-4 (A)"
          },
          {
            title: "B-1 (A)"
          },
          {
            title: "B-2 (A)"
          },
          {
            title: "B-3 (A)"
          },
          {
            title: "B-4 (A)"
          },
          {
            title: "C-1 (A)"
          },
          {
            title: "C-2 (A)"
          },
          {
            title: "C-3 (A)"
          },
          {
            title: "C-4 (A)"
          },
          {
            title: "D-1 (A)"
          },
          {
            title: "D-2 (A)"
          },
          {
            title: "D-3 (A)"
          },
          {
            title: "D-4 (A)"
          },
          {
            title: "E-1 (A)"
          },
          {
            title: "E-2 (A)"
          },
          {
            title: "E-3 (A)"
          },
          {
            title: "E-4 (A)"
          }
        ]
      },
      { title: "전류합" }
    ];
  } else if (
    detailItem === "AA그룹전체" ||
    detailItem === "AB그룹전체" ||
    detailItem === "AC그룹전체" ||
    detailItem === "AD그룹전체" ||
    detailItem === "AE그룹전체"
  ) {
    // 알파벳 텍스트를 구한다.
    if (detailItem === "AA그룹전체") {
      // 그룹 이름을 구한다.
      groupName = "AA";
      // 개별 이름을 구한다.
      singleName = "A";
    } else if (detailItem === "AB그룹전체") {
      // 그룹 이름을 구한다.
      groupName = "AB";
      // 개별 이름을 구한다.
      singleName = "B";
    } else if (detailItem === "AC그룹전체") {
      // 그룹 이름을 구한다.
      groupName = "AC";
      // 개별 이름을 구한다.
      singleName = "C";
    } else if (detailItem === "AD그룹전체") {
      // 그룹 이름을 구한다.
      groupName = "AD";
      // 개별 이름을 구한다.
      singleName = "D";
    } else {
      // 그룹 이름을 구한다.
      groupName = "AE";
      // 개별 이름을 구한다.
      singleName = "E";
    }

    // 표의 헤더를 수정한다.
    obj.colModel = [
      { title: "구분", align: "center", width: 40 },
      { title: dateText, align: "center" },
      { title: "시간", align: "center", width: 84 },
      {
        title: groupName + "그룹전체 접속반",
        width: 140,
        align: "center",
        dataType: "float",
        colModel: [
          {
            title: singleName + "-1 (A)"
          },
          {
            title: singleName + "-2 (A)"
          },
          {
            title: singleName + "-3 (A)"
          },
          {
            title: singleName + "-4 (A)"
          }
        ]
      },
      { title: "전류합" }
    ];
  } else if (
    detailItem === "A-1" ||
    detailItem === "A-2" ||
    detailItem === "A-3" ||
    detailItem === "A-4" ||
    detailItem === "B-1" ||
    detailItem === "B-2" ||
    detailItem === "B-3" ||
    detailItem === "B-4" ||
    detailItem === "C-1" ||
    detailItem === "C-2" ||
    detailItem === "C-3" ||
    detailItem === "C-4" ||
    detailItem === "D-1" ||
    detailItem === "D-2" ||
    detailItem === "D-3" ||
    detailItem === "D-4" ||
    detailItem === "E-1" ||
    detailItem === "E-2" ||
    detailItem === "E-3" ||
    detailItem === "E-4"
  ) {
    if (
      detailItem === "A-1" ||
      detailItem === "B-4" ||
      detailItem === "C-1" ||
      detailItem === "D-1" ||
      detailItem === "E-1" ||
      detailItem === "E-2" ||
      detailItem === "E-3" ||
      detailItem === "E-4"
    ) {
      // 표의 헤더를 수정한다.
      obj.colModel = [
        { title: "구분", align: "center", width: 40 },
        { title: dateText, align: "center" },
        { title: "시간", align: "center", width: 84 },
        { title: "전체전류" },
        { title: "전체전압" },
        { title: "내부온도" },
        { title: "CH1" },
        { title: "CH2" },
        { title: "CH3" },
        { title: "CH4" },
        { title: "CH5" },
        { title: "CH6" },
        { title: "CH7" },
        { title: "CH8" },
        { title: "CH9" },
        { title: "CH10" },
        { title: "CH11" },
        { title: "CH12" },
        { title: "CH13" },
        { title: "CH14" },
        { title: "CH15" },
        { title: "CH16" },
        { title: "CH17" },
        { title: "CH18" },
        { title: "CH19" },
        { title: "CH20" }
      ];
    } else {
      // 표의 헤더를 수정한다.
      obj.colModel = [
        { title: "구분", align: "center", width: 40 },
        { title: dateText, align: "center" },
        { title: "시간", align: "center", width: 84 },
        { title: "전체전류" },
        { title: "전체전압" },
        { title: "내부온도" },
        { title: "CH1" },
        { title: "CH2" },
        { title: "CH3" },
        { title: "CH4" },
        { title: "CH5" },
        { title: "CH6" },
        { title: "CH7" },
        { title: "CH8" },
        { title: "CH9" },
        { title: "CH10" },
        { title: "CH11" },
        { title: "CH12" },
        { title: "CH13" },
        { title: "CH14" },
        { title: "CH15" },
        { title: "CH16" },
        { title: "CH17" },
        { title: "CH18" },
        { title: "CH19" }
      ];
    }
  }

  obj.dataModel = {
    data: data,
    sortIndx: 1,
    sortDir: "down"
  };

  obj.pageModel = {
    type: "local",
    rPP: 17,
    strRpp: "{0}",
    strDisplay: "보기 {0} - {1} / {2}",
    rPPOptions: [17]
  };

  // 표를 삭제한다.
  $("#grid_group").pqGrid("destroy");

  // 표를 만든다.
  $("#grid_group").pqGrid(obj);

  // 페이지 링크에 색상을 적용한다.
  const grid_group = document.getElementById("grid_group");
  const page = grid_group.childNodes[2];
  page.classList.remove("ui-widget-header");
}

// ACB 표를 그린다.
function drawACBTable() {
  var obj = {
    width: "auto",
    showBottom: true,
    collapsible: true,
    selectionModel: { swipe: true },
    numberCell: { show: false },
    editable: false,
    resizable: false,
    sorting: "local",
    sortorder: "desc",
    height: 'flex',
    scrollModel: {autoFit: true},
    toolbar: {
      cls: 'pq-toolbar-export',
      items: [{
        type: 'button',
        label: 'Excel',
        icon: 'ui-icon-document',
        listeners: [{
          "click": function (evt) {
            $("#grid_group").pqGrid("exportCsv", {url: "/pro/demos/excel"});
          }
        }]
      }]
    }
  };
  obj.columnTemplate = { width: 100 };

  const reportType = $("#reportType").val(); // 보고서 종류

  var dateText = "";
  if (reportType === "년간") {
    dateText = "연월";
  } else {
    dateText = "일자";
  }

  const acbText = "ACB";

  // 세부항목을 확인한다.
  if ($("#detailItem").val() === "전체") {
    // 보고서 종류를 확인한다.
    if (reportType === "일일") {
      // 표의 헤더를 수정한다.
      obj.colModel = [
        { title: "구분", align: "center", width: 40 },
        { title: dateText, align: "center" },
        { title: "시간", align: "center", width: 84 },
        { title: acbText + "-1 (kWh)" },
        { title: acbText + "-2 (kWh)" },
        { title: acbText + "-3 (kWh)" },
        { title: acbText + "-4 (kWh)" },
        { title: acbText + "-5 (kWh)" },
        { title: "전체 발전량 (kWh)", width: 140 },
        {
          title: "일사량(W/㎡)",
          width: 140,
          align: "center",
          dataType: "float",
          colModel: [
            {
              title: "경사"
            },
            {
              title: "수평"
            }
          ]
        },
        {
          title: "온 도(℃)",
          width: 140,
          dataType: "float",
          align: "center",
          colModel: [{ title: "모듈" }, { title: "대기" }]
        }
      ];
    } else {
      // 표의 헤더를 수정한다.
      obj.colModel = [
        { title: "구분", align: "center", width: 40 },
        { title: dateText, align: "center" },
        { title: acbText + "-1 (kWh)" },
        { title: acbText + "-2 (kWh)" },
        { title: acbText + "-3 (kWh)" },
        { title: acbText + "-4 (kWh)" },
        { title: acbText + "-5 (kWh)" },
        { title: "전체 발전량 (kWh)", width: 140 },
        {
          title: "일사량(W/㎡)",
          width: 140,
          align: "center",
          dataType: "float",
          colModel: [
            {
              title: "경사"
            },
            {
              title: "수평"
            }
          ]
        },
        {
          title: "온 도(℃)",
          width: 140,
          dataType: "float",
          align: "center",
          colModel: [{ title: "모듈" }, { title: "대기" }]
        }
      ];
    }
  } else {
    // 보고서 종류를 확인한다.
    if (reportType === "일일") {
      // 표의 헤더를 수정한다.
      obj.colModel = [
        { title: "구분", align: "center", width: 40 },
        { title: dateText, align: "center" },
        { title: "시간", align: "center", width: 84 },
        { title: "전압(R)" },
        { title: "전압(S)" },
        { title: "전압(T)" },
        { title: "전압(RS)" },
        { title: "전압(ST)" },
        { title: "전압(TR)" },
        { title: "전류(R)" },
        { title: "전류(S)" },
        { title: "전류(T)" },
        { title: "출력(kW)" },
        { title: "발전량(kWh)" },
        { title: "누적발전량(kWh)", width: 140 },
        { title: "주파수" },
        { title: "역률" },
        {
          title: "일사량(W/㎡)",
          width: 140,
          align: "center",
          dataType: "float",
          colModel: [
            {
              title: "경사"
            },
            {
              title: "수평"
            }
          ]
        },
        {
          title: "온 도(℃)",
          width: 140,
          dataType: "float",
          align: "center",
          colModel: [{ title: "모듈" }, { title: "대기" }]
        }
      ];
    } else {
      // 표의 헤더를 수정한다.
      obj.colModel = [
        { title: "구분", align: "center", width: 40 },
        { title: dateText, align: "center" },
        { title: "전압(R)" },
        { title: "전압(S)" },
        { title: "전압(T)" },
        { title: "전압(RS)" },
        { title: "전압(ST)" },
        { title: "전압(TR)" },
        { title: "전류(R)" },
        { title: "전류(S)" },
        { title: "전류(T)" },
        { title: "출력(kW)" },
        { title: "발전량(kWh)" },
        { title: "누적발전량(kWh)", width: 140 },
        { title: "주파수" },
        { title: "역률" },
        {
          title: "일사량(W/㎡)",
          width: 140,
          align: "center",
          dataType: "float",
          colModel: [
            {
              title: "경사"
            },
            {
              title: "수평"
            }
          ]
        },
        {
          title: "온 도(℃)",
          width: 140,
          dataType: "float",
          align: "center",
          colModel: [{ title: "모듈" }, { title: "대기" }]
        }
      ];
    }
  }

  obj.dataModel = {
    data: data,
    sortIndx: 1,
    sortDir: "down"
  };

  obj.pageModel = {
    type: "local",
    rPP: 17,
    strRpp: "{0}",
    strDisplay: "보기 {0} - {1} / {2}",
    rPPOptions: [17]
  };

  // 표를 삭제한다.
  $("#grid_group").pqGrid("destroy");

  // 표를 만든다.
  $("#grid_group").pqGrid(obj);

  // 페이지 링크에 색상을 적용한다.
  const grid_group = document.getElementById("grid_group");
  const page = grid_group.childNodes[2];
  page.classList.remove("ui-widget-header");
}

// VCB 표를 그린다.
function drawVCBTable() {
  var obj = {
    width: "auto",
    showBottom: true,
    collapsible: true,
    selectionModel: { swipe: true },
    numberCell: { show: false },
    editable: false,
    resizable: false,
    sorting: "local",
    sortorder: "desc",
    height: 'flex',
    scrollModel: {autoFit: true},
    toolbar: {
      cls: 'pq-toolbar-export',
      items: [{
        type: 'button',
        label: 'Excel',
        icon: 'ui-icon-document',
        listeners: [{
          "click": function (evt) {
            $("#grid_group").pqGrid("exportCsv", {url: "/pro/demos/excel"});
          }
        }]
      }]
    }
  };
  obj.columnTemplate = { width: 100 };

  const reportType = $("#reportType").val(); // 보고서 종류

  var dateText = "";
  if (reportType === "년간") {
    dateText = "연월";
  } else {
    dateText = "일자";
  }

  // 세부항목을 확인한다.
  if ($("#detailItem").val() === "전체") {
    // 보고서 종류를 확인한다.
    if (reportType === "일일") {
      // 표의 헤더를 수정한다.
      obj.colModel = [
        { title: "구분", align: "center", width: 40 },
        { title: dateText, align: "center" },
        { title: "시간", align: "center", width: 84 },
        { title: "VCB (kWh)" },
        { title: "발전시간" },
        { title: "전체 발전량 (kWh)", width: 140 },
        {
          title: "일사량(W/㎡)",
          width: 140,
          align: "center",
          dataType: "float",
          colModel: [
            {
              title: "경사"
            },
            {
              title: "수평"
            }
          ]
        },
        {
          title: "온 도(℃)",
          width: 140,
          dataType: "float",
          align: "center",
          colModel: [{ title: "모듈" }, { title: "대기" }]
        }
      ];
    } else {
      // 표의 헤더를 수정한다.
      obj.colModel = [
        { title: "구분", align: "center", width: 40 },
        { title: dateText, align: "center" },
        { title: "VCB (kWh)" },
        { title: "발전시간" },
        { title: "전체 발전량 (kWh)", width: 140 },
        {
          title: "일사량(W/㎡)",
          width: 140,
          align: "center",
          dataType: "float",
          colModel: [
            {
              title: "경사"
            },
            {
              title: "수평"
            }
          ]
        },
        {
          title: "온 도(℃)",
          width: 140,
          dataType: "float",
          align: "center",
          colModel: [{ title: "모듈" }, { title: "대기" }]
        }
      ];
    }
  } else {
    // 보고서 종류를 확인한다.
    if (reportType === "일일") {
      // 표의 헤더를 수정한다.
      obj.colModel = [
        { title: "구분", align: "center", width: 40 },
        { title: dateText, align: "center" },
        { title: "시간", align: "center", width: 84 },
        { title: "전압(R)" },
        { title: "전압(S)" },
        { title: "전압(T)" },
        { title: "전압(RS)" },
        { title: "전압(ST)" },
        { title: "전압(TR)" },
        { title: "전류(R)" },
        { title: "전류(S)" },
        { title: "전류(T)" },
        { title: "출력(kW)" },
        { title: "발전량(kWh)" },
        { title: "누적발전량(kWh)", width: 140 },
        { title: "주파수" },
        { title: "역률" },
        { title: "발전시간" },
        {
          title: "일사량(W/㎡)",
          width: 140,
          align: "center",
          dataType: "float",
          colModel: [
            {
              title: "경사"
            },
            {
              title: "수평"
            }
          ]
        },
        {
          title: "온 도(℃)",
          width: 140,
          dataType: "float",
          align: "center",
          colModel: [{ title: "모듈" }, { title: "대기" }]
        }
      ];
    } else {
      // 표의 헤더를 수정한다.
      obj.colModel = [
        { title: "구분", align: "center", width: 40 },
        { title: dateText, align: "center" },
        { title: "전압(R)" },
        { title: "전압(S)" },
        { title: "전압(T)" },
        { title: "전압(RS)" },
        { title: "전압(ST)" },
        { title: "전압(TR)" },
        { title: "전류(R)" },
        { title: "전류(S)" },
        { title: "전류(T)" },
        { title: "출력(kW)" },
        { title: "발전량(kWh)" },
        { title: "누적발전량(kWh)", width: 140 },
        { title: "주파수" },
        { title: "역률" },
        { title: "발전시간" },
        {
          title: "일사량(W/㎡)",
          width: 140,
          align: "center",
          dataType: "float",
          colModel: [
            {
              title: "경사"
            },
            {
              title: "수평"
            }
          ]
        },
        {
          title: "온 도(℃)",
          width: 140,
          dataType: "float",
          align: "center",
          colModel: [{ title: "모듈" }, { title: "대기" }]
        }
      ];
    }
  }

  obj.dataModel = {
    data: data,
    sortIndx: 1,
    sortDir: "down"
  };

  obj.pageModel = {
    type: "local",
    rPP: 17,
    strRpp: "{0}",
    strDisplay: "보기 {0} - {1} / {2}",
    rPPOptions: [17]
  };

  // 표를 삭제한다.
  $("#grid_group").pqGrid("destroy");

  // 표를 만든다.
  $("#grid_group").pqGrid(obj);

  // 페이지 링크에 색상을 적용한다.
  const grid_group = document.getElementById("grid_group");
  const page = grid_group.childNodes[2];
  page.classList.remove("ui-widget-header");
}

// 기상반 표를 그린다.
function drawWeatherClassTable() {
  var obj = {
    width: "auto",
    showBottom: true,
    collapsible: true,
    selectionModel: { swipe: true },
    numberCell: { show: false },
    editable: false,
    resizable: false,
    sorting: "local",
    sortorder: "desc",
    height: 'flex',
    scrollModel: {autoFit: true},
    toolbar: {
      cls: 'pq-toolbar-export',
      items: [{
        type: 'button',
        label: 'Excel',
        icon: 'ui-icon-document',
        listeners: [{
          "click": function (evt) {
            $("#grid_group").pqGrid("exportCsv", {url: "/pro/demos/excel"});
          }
        }]
      }]
    }
  };
  obj.columnTemplate = { width: 100 };

  const reportType = $("#reportType").val(); // 보고서 종류

  var dateText = "";
  if (reportType === "년간") {
    dateText = "연월";
  } else {
    dateText = "일자";
  }

  // 표의 헤더를 수정한다.
  obj.colModel = [
    { title: "구분", align: "center", width: 40 },
    { title: dateText, align: "center" },
    { title: "시간", align: "center", width: 84 },
    {
      title: "일사량(W/㎡)",
      width: 140,
      align: "center",
      dataType: "float",
      colModel: [
        {
          title: "경사"
        },
        {
          title: "수평"
        }
      ]
    },
    {
      title: "온 도(℃)",
      width: 140,
      dataType: "float",
      align: "center",
      colModel: [{ title: "모듈" }, { title: "대기" }]
    }
  ];

  obj.dataModel = {
    data: data,
    sortIndx: 1,
    sortDir: "down"
  };

  obj.pageModel = {
    type: "local",
    rPP: 17,
    strRpp: "{0}",
    strDisplay: "보기 {0} - {1} / {2}",
    rPPOptions: [17]
  };

  // 표를 삭제한다.
  $("#grid_group").pqGrid("destroy");

   // 표를 만든다.
  $("#grid_group").pqGrid(obj);

  // 페이지 링크에 색상을 적용한다.
  const grid_group = document.getElementById("grid_group");
  const page = grid_group.childNodes[2];
  page.classList.remove("ui-widget-header");
}

// 장치명을 수정하면 세부항목을 변경한다.
function changeDetailItem() {
  var connection = [
    "전체",
    "AA그룹전체",
    "A-1",
    "A-2",
    "A-3",
    "A-4",
    "AB그룹전체",
    "B-1",
    "B-2",
    "B-3",
    "B-4",
    "AC그룹전체",
    "C-1",
    "C-2",
    "C-3",
    "C-4",
    "AD그룹전체",
    "D-1",
    "D-2",
    "D-3",
    "D-4",
    "AE그룹전체",
    "E-1",
    "E-2",
    "E-3",
    "E-4"
  ]; // 접속반
  var invereter = ["전체", "INV-1", "INV-2", "INV-3", "INV-4", "INV-5"]; // 인버터
  var acb = ["전체", "ACB-1", "ACB-2", "ACB-3", "ACB-4", "ACB-5"]; // ACB
  var vcb = ["전체", "VCB"]; // VCB
  var sensor = ["WT"]; // 기상반

  var selectItem = $("#equipmentName").val();

  var changeItem = new Array();

  if (selectItem == "접속반") {
    changeItem = connection;
  } else if (selectItem == "인버터") {
    changeItem = invereter;
  } else if (selectItem == "ACB") {
    changeItem = acb;
  } else if (selectItem == "VCB") {
    changeItem = vcb;
  } else if (selectItem == "기상반") {
    changeItem = sensor;
  }

  $("#detailItem").empty();

  for (var count = 0; count < changeItem.length; count++) {
    var option = $("<option>" + changeItem[count] + "</option>");
    $("#detailItem").append(option);
  }
}

// 보고서 종류를 변경하면 수집시간을 변경한다.
function changeCollectionHour() {
  var collectionHourOfDay = [
    "1시간(평균)",
    "30분(순시)",
    "10분(순시)",
    "5분(순시)",
    "RawData"
  ]; // 일일 보고서 관련 수집시간
  var collectionHourOfMonth = ["1일", "1시간(평균)"]; // 월간 보고서 관련 수집 시간
  var collectionHourOfYear = ["1개월", "1일"]; // 연간 보고서 관련 수집 시간

  var selectItem = $("#reportType").val();

  var changeItem = new Array();

  if (selectItem === "일일") {
    changeItem = collectionHourOfDay;
  } else if (selectItem === "월간") {
    changeItem = collectionHourOfMonth;
  } else {
    changeItem = collectionHourOfYear;
  }

  $("#collectionHour").empty();

  for (var count = 0; count < changeItem.length; count++) {
    var option = $("<option>" + changeItem[count] + "</option>");
    if ($("#equipmentName").val() === "인버터" && count > 0) {
      option.hide();
    }
    $("#collectionHour").append(option);
  }
}

// 장치명이 기상반이거나 접속반이면 보고서의 종류를 일일만 넣는다.
function changeReportType() {
  var equipmentName = $("#equipmentName").val(); // 장치명
  var reportTypeList = new Array(); // 보고서 종류 항목

  // 보고서 종류를 비운다.
  $("#reportType").empty();

  // 장치명이 기상반이거나 접속반인지 확인한다.
  if (equipmentName === "기상반" || equipmentName === "접속반") {
    reportType = ["일일"];
  } else {
    reportType = ["일일", "월간", "년간"];
  }

  // 보고서 종류 항목을 넣는다.
  for (var count = 0; count < reportType.length; count++) {
    var option = $("<option>" + reportType[count] + "</option>");
    $("#reportType").append(option);
  }
}

// 표를 그린다.
function drawTable(isNewData) {
  const equipmentName = $("#equipmentName").val(); // 장비 종류

  // 장비 종류가 인버터인지 확인한다.
  if (equipmentName === "인버터") {
    // 인버터 표를 그린다.
    drawInverterTable(isNewData);
  } else if (equipmentName === "기상반") {
    drawWeatherClassTable();
  } else if (equipmentName === "VCB") {
    drawVCBTable();
  } else if (equipmentName === "ACB") {
    drawACBTable();
  } else {
    drawConnectionClassTable();
  }
}

// 장치명에 접속반을 입력한다.
$("#equipmentName")
  .val("인버터")
  .prop("selected", true);

// 장치명을 수정하면 세부항목을 변경한다.
$("#equipmentName").change(function() {
  // 세부 항목을 변경한다.
  changeDetailItem();
  // 표를 그린다.
  drawTable(true);
  // 장치명이 기상반이면 보고서의 종류를 일일만 넣는다.
  changeReportType();
});

// 보고서 종류를 입력하면 차트와 표를 다시 그린다.
$("#reportType").change(function() {
  // 보고서 종류를 수정하면 수집시간을 변경한다.
  changeCollectionHour();
  // 표를 그린다.
  drawTable(true);
});

// 세부 항목을 입력하면 차트와 표를 다시 그린다.
$("#detailItem").change(function() {
  // 표를 그린다.
  drawTable(false);
});
