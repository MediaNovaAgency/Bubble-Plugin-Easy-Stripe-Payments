function(properties, context) {
    
    //Stripe only accepts inline urlencoded API calls, documentation here: https://stripe.com/docs/api/checkout/sessions/object 
    
    //fool proof https on input box
    if (properties.cancel_url.indexOf('http://') == -1 && properties.cancel_url.indexOf('https://') == -1){
        properties.cancel_url = 'http://' + properties.cancel_url;
    }
    
    if (properties.success_url.indexOf('http://') == -1 && properties.success_url.indexOf('https://') == -1){
        properties.success_url = 'http://' + properties.success_url;
    }
    
    //API Call
    var sentRequest = context.request(
    {
        method: 'POST',
        url: "https://api.stripe.com/v1/checkout/sessions",
        headers: {
            'Authorization': properties.token,
            'Content-Type' : "application/x-www-form-urlencoded",
        	},
        body: 
				'cancel_url='+properties.cancel_url+
        		'&success_url='+properties.success_url+
        		'&line_items[0][price_data][currency]='+properties.currency+
        		'&line_items[0][price_data][product_data][name]='+properties.product_name+
        		'&line_items[0][quantity]='+properties.quantity+
        		'&mode='+properties.mode+
        		'&payment_method_types[0]='+properties.payment_method+
        		'&line_items[0][price_data][unit_amount]='+properties.unity_amount+'',
    });
    
    var bodyParsed = JSON.parse(sentRequest.body)
	
    return{
        payment_url : bodyParsed.url,
        expires_at : bodyParsed.expires_at.toString(),
        payment_intent : bodyParsed.payment_intent,
        payment_status : bodyParsed.payment_status
    }
}