// 알람 화면에서 발전소 목록을 출력한다.
function loadPowerPlant() {
  var powerPlant = ["세아", "공촌", "금현주공장", "영진", "금현검사동"];
  var changeItem = powerPlant;

  for (var count = 0; count < changeItem.length; count++) {
    var option = $("<option>" + changeItem[count] + "</option>");
    $('#select1').append(option);
  }
}
