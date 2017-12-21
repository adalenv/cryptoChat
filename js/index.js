//made by Adalen VLADI


app={
	var:{
		user:'wpuser',
		currency:'bitcoin',
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
				console.log(data);
				app.var.last_msg_id=data[data.length-1].id;
				app.function.displayMessages(data,'first_run');
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
				if(typeof data !== 'undefined'){
					console.log(data);
					app.var.last_msg_id=data[data.length-1].id;
					app.function.displayMessages(data,'new');
				}
			})
			.fail(function() {
				console.log("error");
			})
			
		},//getMessage end

		displayMessages:function(data,type){

					if (type=='first_run') {
						$('.chat-history').html('');		
					}	
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

		setCurrency:function(currency){
			app.var.currency=currency;
			app.var.last_msg_id='null';
			app.function.firstRun(app.var.currency);
			
		}//setcurrency end

	}



};


(function() {

if (typeof(Storage) !== "undefined") {

    if (localStorage.chatOpen) {
      if (localStorage.getItem('chatOpen')=='yes') {//if was open
      	$('.chat-close').html('˅');
      	$('.chat_title').hide();
      	$('.select-currency').show();
       // $('.chat').slideToggle('slow');//open it
        //console.log(localStorage.getItem('chatOpen'));
      } else if (localStorage.getItem('chatOpen')=='no')  {

      	$('.chat-close').html('˄');
      	$('.chat_title').show();
      	$('.select-currency').hide();
      }
      
  } else {
      localStorage.chatOpen='no';
  }

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
	       // $('.chat').slideToggle('slow');//open it
	        //console.log(localStorage.getItem('chatOpen'));
	      } else if (localStorage.getItem('chatOpen')=='no')  {

	      	$('.chat-close').html('˄');
	      	$('.chat_title').show();
	      	$('.select-currency').hide();
	      }
	      
	  } else {
	      localStorage.chatOpen='no';
	  }

	} else {
	    // Sorry! No Web Storage support..
	}
}







	$('.chat-close').on('click', function(e) {

		 if (localStorage.getItem('chatOpen')=='no') {
            localStorage.setItem('chatOpen','yes');
            $('.chat').slideUp(300, 'swing');
            checkChat();
            //console.log('from no to yes');
          } else if (localStorage.getItem('chatOpen')=='yes') {
            localStorage.setItem('chatOpen','no');
            checkChat();
            $('.chat').slideDown(300, 'swing');
            //console.log('from yes to no');
          }

		
		//$('.chat-message-counter').fadeToggle(300, 'swing');


	});


	$('.select-currency').on('change', function() {
		app.function.setCurrency(this.value );
	})


	app.function.firstRun(app.var.currency);

}) ();

