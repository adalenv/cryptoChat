//made by Adalen VLADI

back_url='/cryptoChat/back/index.php';
app={
	var:{
		user:localStorage.getItem('wp_user'),
		currency:localStorage.getItem('currency'),
		last_msg_id:'null',
	},

	function:{
		firstRun:function(currency){
			$.ajax({
				url: back_url,
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
				url: back_url,
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
					//console.log(data);
					app.var.last_msg_id=data[data.length-1].id;
					app.function.displayMessages(data,'new');
					//console.clear();
				}
			})
			.fail(function() {
				console.log("error");
			})
			
		},//getMessage end

		displayMessages:function(data,type){

							
	
					for (var i = 0; i < data.length; i++) {

						if (toString(data[i].user)==app.var.user) {
							console.log(data[i].user);
							$('#msg_id'+data[i].id).find('h5').css('float','right');
						}
						$('.chat-history').append('<div class="chat-message clearfix" id="msg_id'+data[i].id+'">'+

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
				url: back_url,
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
			$('.c_price_val').html($('.select-currency [value="'+currency+'"]').attr('data-price_atr'));
			$('.c_percent_val').html($('.select-currency [value="'+currency+'"]').attr('data-percent_atr')+'%');
			if ($('.select-currency [value="'+app.var.currency+'"]').attr('data-percent_atr') <0) {
					$('.c_percent_val').css('color','#e62727');
				} else{
					$('.c_percent_val').css('color','#1a8a34');
				}

			
		},//setcurrency end
		getFromMarketCap:function(){
			$.ajax({
				url: 'https://api.coinmarketcap.com/v1/ticker/?limit=20000',
				type: 'GET',
				dataType: 'json',
				//data: {param1: 'value1'},
			})
			.done(function(data) {
				for (var i = 0 ; i < data.length; i++) {
					$('.select-currency').append('<option data-price_atr="'+data[i].price_usd+'" data-percent_atr="'+data[i].percent_change_24h+'"   value="'+data[i].id+'">'+data[i].name+'</option>')
				}
				$('.select-currency').val(app.var.currency);
				$('.select-currency').select2({
					placeholder:app.var.currency,
				});
				$('.c_price_val').html($('.select-currency [value="'+app.var.currency+'"]').attr('data-price_atr'));
				$('.c_percent_val').html($('.select-currency [value="'+app.var.currency+'"]').attr('data-percent_atr')+'%');

				if ($('.select-currency [value="'+app.var.currency+'"]').attr('data-percent_atr') <0) {
					$('.c_percent_val').css('color','#e62727');
				} else{
					$('.c_percent_val').css('color','#1a8a34');
				}



			})
			.fail(function() {
				console.log("error");
			})
			
		}//getfrommarketcap end

	}



};


(function() {

app.function.getFromMarketCap();

if (typeof(Storage) !== "undefined") {

if (localStorage.getItem('currency')==null) {
	app.var.currency='bitcoin';
};



if (localStorage.getItem('wp_user')==null) {
	localStorage.setItem('wp_user','guest'+Math.floor(1000 + Math.random() * 9000));
	app.var.user=localStorage.getItem('wp_user');
};

 if (localStorage.getItem('chatOpen')==null){
 	localStorage.setItem('chatOpen','no');
 }


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
	      	$('.select-div').show()
	      	$('.chat').show();
	        //$('.chat').slideUp('slow');//open it
	        //console.log(localStorage.getItem('chatOpen'));
	      } else if (localStorage.getItem('chatOpen')=='no')  {

	      	$('.chat-close').html('˄');
	      	$('.chat_title').show();
	      	$('.select-currency').hide();
	      	$('.select-div').hide();
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
		// $('.select-currency').attr('size', '1');
	})


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
