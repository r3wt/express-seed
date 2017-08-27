const StringToStream = require('string-to-stream');

function api( code, message, data ){
	
	this.status(code||200).json({ status:code||200, data:data||null, message:message||''});
	
};

function ok( data , message ){
	this.api(200, message, data);
};

//bad request eg invalid field, index error, etc
function bad( message ){
	this.api(400, message || '400 Bad Request');
};

//unauthorized
function unauthorized(message){
	this.api(401, message||'401 Unauthorized');
};

//forbidden
function forbidden(message){
	this.api(403, message||'403 Forbidden');
};

//general errors, crashes, exceptions, etc with optional StackTrace
function err( message, code, sTrace ){
	this.api(500, message||'500 Internal Server Error', sTrace );
};

function notFound(){
	this.api(404,'Resource Not Found');
};

//missing parameters
function missingParams( params ){
	this.api(400,'Missing required parameters',{ missing_parameters: params });
};

function provideDownload( filename, localFilePath, rawDataAsString, stream ){
    
    this.attachment(filename);//express will take care of the files.
    
    if(localFilePath){
        return this.download(localFilePath);//send local file
    }
    
    if(rawDataAsString){
        stream = StringToStream(rawDataAsString);
    }
    
    if(stream){
        stream.pipe(this.res);
    }
  
};

module.exports = { api, ok, bad, err, unauthorized, notFound, missingParams, provideDownload };