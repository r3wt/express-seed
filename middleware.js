const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const jwt = require('express-jwt');
const morgan = require('morgan');

//enable proxying (this is insecure unless on trusted network)
app.enable('trust proxy');
app.set('trust proxy',()=> true );

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(fileUpload({
	limits: { 
		fileSize: 1 * 1024 * 1024,
		fields: 50,
		files: 1,
		parts: 51
	}
}));

// jwt creates req.user
app.use(
	jwt({ credentialsRequired: false, secret: config.jwt_secret })
);

app.use((req,res,next)=>{
	if(req.hasOwnProperty('user')){
		req.user.ip.current = req.ip;//go ahead and log an user ip
	}
	next();
});

//allows us to get around origin. probably unsafe but not really important during dev.
app.use((req, res, next)=>{
	res
	.header('X-Frame-Options','SAMEORIGIN')
	.header('Access-Control-Allow-Credentials', true)
	.header('Access-Control-Allow-Origin', '*')
	.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE')
	.header('Access-Control-Allow-Headers','X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
	next();
});

// morgan request logger
app.use(morgan('combined'));
