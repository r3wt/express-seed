module.exports = {
    dir: __dirname,
    env: process.env.NODE_ENV || 'development',
    jwt_secret: process.env.JWT_SECRET || 'foobar',
    mongo: {
        url: process.env.MONGO_URL || 'mongodb://localhost/test',
        debug: process.env.MONGO_DEBUG || true,
    },
    port: process.env.PORT || 3000,
    domain: process.env.DOMAIN || 'localhost',
    log: {
        level: process.env.LOG_LEVEL || 'debug',// emergency, alert, critical, error, warning, notice, info, debug
        stream: (()=>{
            // undefined to use STDIO OR fs.createWriteStream('/path/to/some.log') to use file
            if(process.env.LOG_FILE){
                return require('fs').createWriteStream(process.env.LOG_FILE);
            }
            return undefined;// log library will use STDIO by default.    
        })()
    },
    docs: process.env.ENABLE_DOCS || true
};