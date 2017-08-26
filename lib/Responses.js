const StringToStream = require('string-to-stream');

const api = function( code, message, data ){
	
	this.status(code||200).json({ status:code||200, data:data||null, message:message||''});
	
};

const ok = ( data , message )=>{
	api(200, message, data);
};

//bad request eg invalid field, index error, etc
const bad = ( message )=>{
	api(400, message || '400 Bad Request');
};

//unauthorized
const unauthorized = (message)=>{
	api(401, message||'401 Unauthorized');
};

//forbidden
const forbidden = (message)=>{
	api(403, message||'403 Forbidden');
};

//general errors, crashes, exceptions, etc with optional StackTrace
const err = ( message, code, sTrace )=>{
	api(500, message||'500 Internal Server Error', sTrace );
};

const notFound = ()=>{
	api(404,'Resource Not Found');
};

//missing parameters
const missingParams = ( params )=>{
	api(400,'Missing required parameters',{ missing_parameters: params });
};

const provideDownload = function( filename, localFilePath, rawDataAsString, stream ){
    
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