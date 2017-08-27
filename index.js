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
	
	//mongo express
	log.info('starting mongo express server at /mongo');
	var mongo_express = require('mongo-express/lib/middleware');
	var mongo_express_config = require('./scripts/mongo_express_config');
	app.use('/mongo', mongo_express(mongo_express_config));		

	//express debug
	require('express-debug')(app);
    
}

if(config.docs) {
	require('express-aglio')(app,{
		source: config.dir + '/docs/source/index.apib',
		output: config.dir + '/docs/html/index.html',
		log: ()=>{}
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
	
	// Handle 500 
	app.use((err, req, res, next)=>res.err(err));

	//Handle 404
	app.use((req, res, next)=>res.notFound());

	log.info('app running on port %d',config.port);
		
	app.listen(config.port);
	
});