//made by Adalen VLADI


app={
	var:{
		user:'wpuser',
		currency:localStorage.getItem('currency'),
		last_msg_id:'3'
	},

	function:{
		firstRun:function(currency){
			$.ajax({
				url: 'back/',
				type: 'POST',
				dataType: 'json',
				data: {
					currency: currency,
					function:'first_run'
				}
			})
			.done(function(data) {
				$('.chat-history').html('');
				if(typeof data !== 'undefined' && data.length >0){
					app.var.last_msg_id=data[data.length-1].id;
					app.function.displayMessages(data,'first_run');
				}
			})
			.fail(function() {
				console.log("error");
			})			
		},//firstrun end

		getMessages:function(currency){
			$.ajax({
				url: 'back/',
				type: 'POST',
				dataType: 'json',
				data: {
					currency: currency,
					function:'get_messages',
					last_msg_id:app.var.last_msg_id
				}
			})
			.done(function(data) {
				if(typeof data !== 'undefined' && data.length >0){
					console.log(data);
					app.var.last_msg_id=data[data.length-1].id;
					app.function.displayMessages(data,'new');
					console.clear();
				}
			})
			.fail(function() {
				console.log("error");
			})
			
		},//getMessage end

		displayMessages:function(data,type){

							
	
					for (var i = 0; i < data.length; i++) {
						$('.chat-history').append('<div class="chat-message clearfix">'+
								
								'<img src="'+data[i].avatar+'" alt="" width="32" height="32">'+

								'<div class="chat-message-content clearfix">'+
									
									'<span class="chat-time">'+data[i].datetime+'</span>'+

									'<h5>'+data[i].user+'</h5>'+

									'<p>'+data[i].text+'</p>'+

								'</div> '+

							'</div>'+

						'<hr>');
					}//for end

				$('.chat-history').scrollTop($('.chat-history')[0].scrollHeight);

			

		},//display messages end
		sendMessage:function(){
			$.ajax({
				url: 'back/',
				type: 'POST',
				data: {
					user: app.var.user,
					currency:app.var.currency,
					message:$('.message-text').val(),
					function:'send_message'
				},
			})
			.done(function() {
				$('.message-text').val('');
				app.function.getMessages(app.var.currency);
			})
			.fail(function() {
				console.log("error");
			})
			
		},//sendmessage end

		setCurrency:function(currency){
			app.var.currency=currency;
			app.var.last_msg_id='null';
			localStorage.setItem('currency',currency);
			app.function.firstRun(app.var.currency);

			
		},//setcurrency end
		getFromMarketCap:function(){
			$.ajax({
				url: 'https://api.coinmarketcap.com/v1/ticker/?limit=30',
				type: 'GET',
				dataType: 'json',
				//data: {param1: 'value1'},
			})
			.done(function(data) {
				for (var i = 0 ; i < data.length; i++) {
					$('.select-currency').append('<option value="'+data[i].id+'">'+data[i].name+'</option>')
				}
				$('.select-currency').val(app.var.currency);

			})
			.fail(function() {
				console.log("error");
			})
			
		}//getfrommarketcap end

	}



};


(function() {

if (typeof(Storage) !== "undefined") {

if (localStorage.getItem('currency')==null) {
	app.var.currency='bitcoin';
};

checkChat();


} else {
    // Sorry! No Web Storage support..
}

function checkChat(){
		if (typeof(Storage) !== "undefined") {

	    if (localStorage.chatOpen) {
	      if (localStorage.getItem('chatOpen')=='yes') {//if was open
	      	$('.chat-close').html('˅');
	      	$('.chat_title').hide();
	      	$('.select-currency').show();
	      	$('.chat').show();
	        //$('.chat').slideUp('slow');//open it
	        //console.log(localStorage.getItem('chatOpen'));
	      } else if (localStorage.getItem('chatOpen')=='no')  {

	      	$('.chat-close').html('˄');
	      	$('.chat_title').show();
	      	$('.select-currency').hide();
	      	//$('.chat').slideDown('slow');//open it
	      	$('.chat').hide();
	      }
	      
	  } else {
	     // localStorage.chatOpen='no';
	  }

	} else {
	    // Sorry! No Web Storage support..
	}
}







	$('.chat-close').on('click', function(e) {
		if (localStorage.getItem('chatOpen')=='no') {
            localStorage.setItem('chatOpen','yes')
            //$('.chat').slideDown('slow');//open it
            //console.log('from no to yes');
          } else if (localStorage.getItem('chatOpen')=='yes') {
            localStorage.setItem('chatOpen','no');
            //console.log('from yes to no');
          }
            checkChat();
            //console.log('from no to yes');
    
	});


	$('.select-currency').on('change', function() {
		app.function.setCurrency(this.value );
	})

	app.function.getFromMarketCap();
	app.function.firstRun(app.var.currency);

	setInterval(function(){
		app.function.getMessages(app.var.currency);
		//console.clear();

	},1000);

	$('.message-text').keypress(function (e) {
	  if (e.which == 13 && $('.message-text').val().length >1) {
	    app.function.sendMessage();
	    return false;    //<---- Add this line
	  }
	});


}) ();

