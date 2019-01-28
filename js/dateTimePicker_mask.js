$.datetimepicker.setLocale('ko');

$('#date').datetimepicker({
	format: 'Y-m-d',
	timepicker:false,
	mask: true
});

$('#month').datetimepicker({
	format: 'Y-m',
	timepicker:false,
	mask:true
});

$('#year').datetimepicker({
	format: 'Y',
	timepicker:false,
	mask: true
});

$('#fromDate').datetimepicker({
	format: 'Y-m-d',
	timepicker:false,
	mask: true,
	onShow:function( ct ){
	   this.setOptions({
	    maxDate:jQuery('#toDate').val()?jQuery('#toDate').val():false
	   })
  	},
});

$('#toDate').datetimepicker({
	format: 'Y-m-d',
	timepicker:false,
	mask: true,
	onShow:function( ct ){
	   this.setOptions({
	    minDate:jQuery('#fromDate').val()?jQuery('#fromDate').val():false
	   })
  	},
});