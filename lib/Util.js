const path = require('path');

class Util {

    //returns the file extension of a str or false
    ext( filename ) {
        return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2) || false;
    }

    //removing duplicate slashes from string
    duplicate_slashes( str ){
        return str.replace(/\/\//g,'/');
    }

    //get absolute path relative to root dir
    basepath( path ){
        //return basepath relative to
        return this.duplicate_slashes(config.dir + path);
    }

}