// adopting a credential based model allows a login to have access 
// to many accounts etc like on instagram and facebook.
module.exports = (app,Types,validate) => {

    //todo. find a way to make either email or phone required, but not both.
    app.model('Credential',{
        phone: { 
            type: String,
            validate: validate('mobile_phone'),
            index: {
                unique: true,
                partialFilterExpression: { phone: {$type: 'string'} }
            }
        },
        email: { 
            type: String, 
            validate: validate('email'),
            index: {
                unique: true,
                partialFilterExpression: { email: {$type: 'string'} }
            }
        },
        password: { type: String }
    },{ timestamps: true },(schema)=>{

    });

};