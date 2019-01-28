/*
날짜 입력 유효성을 검사하는 자바스크립트 파일 
*/
/* --- 숫자만 입력 가능 (onKeyDown 이벤트) --- */
function onlyNumberInput()
{
 var code = window.event.keyCode;

 if ((code > 34 && code < 41) || (code > 47 && code < 58) || (code > 95 && code < 106) || code == 8 || code == 9 || code == 13 || code == 46)
 {
  window.event.returnValue = true;
  return;
 }
 window.event.returnValue = false;
}

/* --- 날짜 형식 (onKeyUp 이벤트) --- */
function dateFormat(obj)
{
 var str  = onlyNum(obj.value);
 var leng = str.length;

 switch (leng)
 {
  case 1 :
  case 2 :
  case 3 :
  case 4 : obj.value = str; break;
  case 5 :
  case 6 : obj.value = str.substring(0, 4) + "-" + str.substring(4); break;
  case 7 :
  case 8 : obj.value = str.substring(0, 4) + "-" + str.substring(4, 6) + "-" + str.substring(6); 
           chkDay(str);
     break;
 }
}

/* --- 숫자만 리턴 --- */
function onlyNum(val)
{
 var num = val;
 var tmp = "";

 for (var i = 0; i < num.length; i ++)
 {
  if (num.charAt(i) >= 0 && num.charAt(i) <= 9)
   tmp = tmp + num.charAt(i);
  else
   continue;
 }
 return tmp;
}

/* --- 날짜 유효성 검사 --- */
function chkDate(str){
 if( str.length == 8 ){ 
  vDate = new Date();
  vDate.setFullYear(str.substring(0, 4));
  vDate.setMonth(str.substring(4, 6));
  vDate.setDate(str.substring(6));

  if( vDate.getFullYear() != str.substring(0, 4) ||
   vDate.getMonth()    != str.substring(4, 6) ||
   vDate.getDate()     != str.substring(6) ){
   alert("날짜 입력을 정확하게 하시기 바랍니다!");
   return;
  }
 }
}

// 연도-월 형식 검사 
function chkYearMonth(str){
 if( str.length == 6 ){ 
  vDate = new Date();
  vDate.setFullYear(str.substring(0, 4));
  vDate.setMonth(str.substring(4, 6));

  if( vDate.getFullYear() != str.substring(0, 4) ||
   vDate.getMonth()    != str.substring(4, 6)){
   alert("월을 정확하게 입력하시기 바랍니다!");
   return;
  }
 }
}

/* --- 연도-월 형식 (onKeyUp 이벤트) --- */
function yearMonthFormat(obj)
{
 var str  = onlyNum(obj.value);
 var leng = str.length;

 switch (leng)
 {
  case 1 :
  case 2 :
  case 3 :
  case 4 : obj.value = str; break;
  case 5 :
  case 6 : obj.value = str.substring(0, 4) + "-" + str.substring(4); chkYearMonth(str); break;
 }
}

// 연도 입력 검사 
function chkYear(str){
  vDate = new Date();
  vDate.setFullYear(str.substring(0, 4));

  if( vDate.getFullYear() != str.substring(0, 4)){
   alert("연도를 정확하게 입력하시기 바랍니다!");
   return;
  }
}

function chkDay(Obj)
{
    var strValue = Obj.value;
    var chk1 = /^(19|20)\d{2}-([1-9]|1[012])-([1-9]|[12][0-9]|3[01])$/;
    var chk2 = /^(19|20)\d{2}\/([0][1-9]|1[012])\/(0[1-9]|[12][0-9]|3[01])$/;
    if (strValue == "")
    { // 공백이면 무시
         return true;
    }

    //-------------------------------------------------------------------------------
    // 유효성 검사- 입력형식에 맞게 들왔는지 // 예) 2000-1-1, 2000-01-01 2가지 형태 지원
    //-------------------------------------------------------------------------------
    if (chk1.test(strValue) == false && chk2.test(strValue) == false)
    { // 유효성 검사에 둘다 성공하지 못했다면
        alert("1999-1-1 형식 또는 \r\n1999-01-01 형식으로 날자를 입력해주세요.");
       Obj.value = "";
       Obj.focus = true;
       return false;
    }

    //-------------------------------------------------------------------------------
    // 존재하는 날자(유효한 날자) 인지 체크
    //-------------------------------------------------------------------------------
    var bDateCheck = true;
    var arrDate = Obj.value.split("-");
    var nYear = Number(arrDate[0]);
    var nMonth = Number(arrDate[1]);
    var nDay = Number(arrDate[2]);

    if (nYear < 1900 || nYear > 3000)
    { // 사용가능 하지 않은 년도 체크
        bDateCheck = false;
    }

    if (nMonth < 1 || nMonth > 12)
    { // 사용가능 하지 않은 달 체크
        bDateCheck = false;
    }

    // 해당달의 마지막 일자 구하기
    var nMaxDay = new Date(new Date(nYear, nMonth, 1) - 86400000).getDate();
    if (nDay < 1 || nDay > nMaxDay)
    { // 사용가능 하지 않은 날자 체크
        bDateCheck = false;
    }

    if(bDateCheck == false) 
    { 
       alert("존재하지 않은 년월일을 입력하셨습니다. 다시 한번 확인해주세요.");
       return false;
    }
}
