const express = require('express');
const Logger = require('log');

global.config = require('./config');
global.app = express();
global.log = new Logger(config.log.level,config.log.stream);
global.Lib = require('./lib');
global.Promise = require('bluebird');

app.disable('x-powered-by');

//serve a webapp
if(config.env == 'development'){
    
    app.use('/',express.static(config.dir + '/../public'));
    
}

if(config.docs) {
	require('express-aglio')(app,{
		source: config.dir + '/docs/source/index.apib',
		output: config.dir + '/docs/html/index.html',
		log: (...args)=>log.info(...args)
	});	
}
 
require('express-mongoose-helper')(app,{
    path: config.dir + '/models/',
    connectionString: config.mongo.url,
    debug: config.mongo.debug,
	extend: (mongoose)=>{
		mongoose.Promise = Promise;
		// add more plugins and such here
	},
    log: (...args)=>log.info(...args)
});

app.request.validate = Lib.RequestValidator;

for(let prop in Lib.Responses){
	app.response[prop] = Lib.Responses[prop];
}

//express-map2
app.set('controllers',__dirname+'/controllers/');
require('express-map2')(app); // patch map() function into express

 
// wait until models are availabe on app before loading middleware and controllers.
app.on('mongoose.models.ready',()=>{
	
	require('./middleware'); // load middleware
	require('./routes');  // load our routes
	
	log.info('api instance running on port %d',config.port);
		
	app.listen(config.port);
	
	if(config.env == 'development'){
        require('express-debug')(app);
	}
	
});