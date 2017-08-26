module.exports = function( key, required, optional ){
	
	key = key.toLowerCase();
	let  field = null;
	switch(key){
		case 'get':
		case 'query':
			field = 'query';
		break;
		case 'params':
			field = 'params';
		break;
		case 'post':
		case 'body':
			field = 'body';
		break;
		default:
			throw new Error('invalid key specified in module `request-validator`');
	}
	
	let source = this[ field ],
	    data = {},
		errors = [];
	
	if(required instanceof Array){
		for(let i=0;i<required.length;i++){
			if(source.hasOwnProperty(required[i])){
				data[required[i]] = source[required[i]];
			}else{
				errors.push(required[i]);
			}
		}	
	}
	
	if(optional instanceof Array){
		for(let i=0;i<optional.length;i++){
			if(source.hasOwnProperty(optional[i])){
				data[optional[i]] = source[optional[i]];
			}
		}	
	}
	
	return { errors, data };
};