//add custom validators here!
const validate = Lib.Validator;

validate('email',{
    validator: 'isEmail',
});

validate('mobile_phone',{
    validator: 'isMobilePhone',
    arguments: 'any'
});

validate('uuid',{
    validator: 'isUUID',
    arguments:4
});

validate('url',{
    validator: 'isURL',
    arguments: { 
        protocols: ['http','https'],
    }
});

validate('name',{
    validator: 'isLength',
    arguments: { min: 2, max: 55 },
    message: '{PATH} must be {ARGS[0]}-{ARGS[1]} characters in length'
});

validate('text-140',{
    validator: 'isLength',
    arguments: { min:0, max: 140 },
    passIfEmpty: true,
    message: '{PATH} can\'t be greater than {ARGS[1]} characters'
});

validate('text-1000',{
    validator: 'isLength',
    arguments: { min:0, max: 1000 },
    passIfEmpty: true,
    message: '{PATH} can\'t be greater than {ARGS[1]} characters'
});

validate('text-5000',{
    validator: 'isLength',
    arguments: { min:0, max: 5000 },
    passIfEmpty: true,
    message: '{PATH} can\'t be greater than {ARGS[1]} characters'
});

validate('username',{
    validator: function(val) {
        return /^(?:[a-zA-Z0-9]|([._])(?!\1)){4,24}$/.test(val);
    },
    message: 'Invalid username. Username must be alphanumeric up to 24 chars with period or underscores.'
});