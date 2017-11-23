jQuery.sap.declare("com.deloitte.smartservice.SMARTSERVICE.model.formatter");
com.deloitte.smartservice.SMARTSERVICE.model.formatter = {
	priorityColorFormatter: function(count) {
		var src="green";
		if(count==="1"){
			src='red';
		}
		else if(count==="2"){
			src='orange';
		}
		else if(count==="3"){
			src='green';
		}
		//debugger;
		return src;
	}
};