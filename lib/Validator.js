const validators = {};

const validate = require('mongoose-validator');

module.exports = (k,v) => {

    if(k && v) {
        validators[k] = validate(v);//create the validator with mongoose-validator
    }else{

        //parse a list of validators by string
        // example 'isEmail,isLength

        //split the string and use map to select each validator and return it
        //result is an array of validators for use in mongoose schema as `validate` option
        return k.split(',').map((kk)=> validators[kk.trim()]);
    }

};