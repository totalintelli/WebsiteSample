$(function() {
  //columns in data array : Sr No, Company Name, Revenues(domestic), Revenues(export), expenditure
  var data = [
    [1, "2019-02-25", "05:00", "339938.0", "36130.0", "23333.0"],
    [2, "Wal-Mart Stores", "WS", "315654.0", "11231.0", "24342.0"],
    [3, "Royal Dutch Shell", "RDS", "306731.0", "25311.0", "56231.2"],
    [4, "BP", "B", "267600.0", "22341.0", "71923.4"],
    [5, "General Motors", "GM", "192604.0", "-10567.0", "52934.0"],
    [6, "Chevron", "C", "189481.0", "14099.0", "12023.5"],
    [7, "DaimlerChrysler", "DC", "186106.3", "3536.3", "42734.0"],
    [8, "Toyota Motor", "TM", "185805.0", "12119.6", "57023.4"],
    [9, "Ford Motor", "FM", "177210.0", "2024.0", "22896.0"],
    [10, "ConocoPhillips", "CP", "166683.0", "13529.0", "72456.0"],
    [11, "General Electric", "GE", "157153.0", "16353.0", "16912.5"],
    [12, "Total", "T", "152360.7", "15250.0", "74236.5"],
    [13, "ING Group", "IG", "138235.3", "8958.9", "52012.9"],
    [14, "Citigroup", "CG", "131045.0", "24589.0", "90342.0"],
    [15, "AXA", "A", "129839.2", "5186.5", "13043.8"],
    [16, "Allianz", "AZ", "121406.0", "5442.4", "19529.5"],
    [17, "Volkswagen", "VW", "118376.6", "1391.7", "84472.7"],
    [18, "Fortis", "F", "112351.4", "4896.3", "83473.0"],
    [19, "Crédit Agricole", "CA", "110764.6", "7434.3", "14567.4"],
    [20, "American Intl. Group", "AIG", "108905.0", "10477.0", "10533.0"]
  ];

  for (var i = 0; i < data.length; i++) {
    //rev(total)
    var revDom = parseFloat(data[i][3].replace(",", ""));
    var revExp = parseFloat(data[i][4].replace(",", ""));
    var expenditure = parseFloat(data[i][5].replace(",", ""));
    data[i][6] = revTotal = revDom + revExp;
    //profits
    data[i][7] = revTotal - expenditure;
  }
  //calculate Rank based on profits
  data = data.sort(function(obj1, obj2) {
    var val1 = obj1[7];
    var val2 = obj2[7];
    val1 = val1 ? parseInt(val1) : 0;
    val2 = val2 ? parseInt(val2) : 0;

    return val2 - val1;
  });
  for (var i = 0; i < data.length; i++) {
    var rdata = data[i];
    //Rank
    rdata[8] = i + 1;
    rdata[9] = Math.random();
    rdata[10] = Math.random();
    rdata[11] = Math.random();
    rdata[12] = Math.random();
    rdata[13] = Math.random();
    rdata[14] = Math.random();
    rdata[15] = Math.random();
    rdata[16] = Math.random();
  }

  var obj = {
    width: "auto",
    //   height: 430,
    showTop: false,
    title: "Grid with header grouping",
    showBottom: true,
    collapsible: true,
    selectionModel: { swipe: true },
    numberCell: { show: false },
    editable: false,
    resizable: false,
    sorting: "local"
  };
  obj.columnTemplate = { width: 100 };
  obj.colModel = [
    { title: "구분", align: "center", width: 40 },
    { title: "일자", align: "center" },
    { title: "시간", align: "center", width: 50 },
    {
      title: "INV-1 (kWh)"
    },
    { title: "INV-2 (kWh)" },
    { title: "INV-3 (kWh)" },
    { title: "INV-4 (kWh)" },
    { title: "INV-5 (kWh)" },
    { title: "전체합 (kWh)" },
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

  obj.dataModel = {
    data: data,
    sortIndx: 1
  };

  obj.pageModel = {
    type: "local",
    rPP: 17,
    strRpp: "{0}",
    strDisplay: "보기 {0} - {1} / {2}",
    rPPOptions: [17]
  };
  var $grid = $("#grid_group").pqGrid(obj);

  // 페이지 링크에 색상을 적용한다.
  const grid_group = document.getElementById("grid_group");
  const page = grid_group.childNodes[2];
  page.classList.remove("ui-widget-header");
});
