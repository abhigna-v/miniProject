$(function(){


	var addressesObject = {
		saveAddress : function(){
			console.log("Calling Save Address");
			// TODO:  get values user filled
			var pinCode = $("#pinCode").val();
			// TODO:  Update hardcoded values with values obtained from form
			var addressData = {pinCode: 533333, address:'Lalitha Lane, Lalitha Mansion'};
			$.ajax({
				url: "/api/addresses",
				method: "post",
				data : addressData
			})
			.done(function( data ) {
				console.log("Address Saved");
			})
			.fail(function(err){
				console.log("Address Save Failed");

			});
		},
		getAddAddresses: function(){
			$.ajax({
				url: "/api/addresses",
				method: "get",
			})
			.done(function( data ) {
				console.log("ADDRESS DATA: "+JSON.stringify(data));
				$("#addresses").html(data);
			});
		}
	}


	// This will be called when page is loaded
	addressesObject.getAddAddresses();

	$('#saveAddress').click(function(){
		addressesObject.saveAddress();
	})

	// This was just for testing, keep it commented or delete it
	//addressesObject.saveAddress();
});