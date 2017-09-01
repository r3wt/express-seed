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

validate('text-140',{
    validator: 'isLength',
    arguments: { min:0, max: 140 },
    message: '{PATH} can\'t be greater than {ARGS[1]} characters'
});

validate('text-1000',{
    validator: 'isLength',
    arguments: { min:0, max: 1000 },
    message: '{PATH} can\'t be greater than {ARGS[1]} characters'
});

validate('text-5000',{
    validator: 'isLength',
    arguments: { min:0, max: 5000 },
    message: '{PATH} can\'t be greater than {ARGS[1]} characters'
});