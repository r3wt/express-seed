module.exports = {
    dir: __dirname,
    public_dir: process.env.PUBLIC_DIR || false,
    env: process.env.NODE_ENV || 'development',
    jwt_secret: process.env.JWT_SECRET || 'foobar',
    jwt_expiry: process.env.JWT_EXPIRY || '365',
    mongo: {
        url: process.env.MONGO_URL || 'mongodb://localhost/test',
        debug: process.env.MONGO_DEBUG || true,
        admin_username:'',
        admin_password:'',
        use_ssl: false
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
    docs: process.env.ENABLE_DOCS || true,
    mail: {
        enable: process.env.ENABLE_MAIL || false,
        templatePath:'/templates/email/',
        templateCache: false,
        sengrid_key: '',
        from: 'no-reply@example.com'
    }
};