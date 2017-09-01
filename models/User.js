//for single user account.
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const uuid = require('node-uuid');

module.exports = (app,Types)=>{

    app.model('User',{
        email: { type: String, required: true },
		password: { type: String },
		username: { type: String, required: true },
		firstname: { type: String, default: '' },
		lastname: { type: String, default:'' },
		birthday: { type: Date, default: null },
		avatar: { type: String, default: '/assets/anon.png' },
		sex: { type: String, enum:['male','female','undisclosed'], default: 'undisclosed' },
        
		//meta
        status: { type: String, enum:[ 'active','unconfirmed','locked' ], default: 'active' },
        roles: {
            user:{ type: Boolean, default: true },
            admin:{ type: Boolean, default: false }
        },
		sessions: [
			{
				ip: String,
				sid: String
			}
		]
    },{ timestamps: true },(schema)=>{

        schema.index( { email: 1 }, { unique: true } );
		schema.index( { username: 1 }, { unique: true } );
		
		//password hashing
		schema.pre('save', function(next) {
			var user = this;

			// only hash the password if it has been modified (or is new)
			if (!user.isModified('password')) return next();

			// generate a salt
			bcrypt.genSalt(10, function(err, salt) {
				if (err){
					console.log(err);
					return next(err);
				} 

				// hash the password along with our new salt
				bcrypt.hash(user.password, salt, function(err, hash) {
					if (err) return next(err);

					// override the cleartext password with the hashed one
					user.password = hash;
					next();
				});
			});
		});
        
        //calls toObject(), removes sensitive fields, and returns the cleaned object.
		schema.methods.clean = function(){
			var obj = this.toObject();
			var sensitive = ['password','sessions'];
			sensitive.forEach(function(item){
				delete obj[item];
			});
			return obj;
		};
		
		//verify password on login
		schema.methods.validatePass = function(candidatePassword, cb) {
			bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
				if (err) return cb(err);
				cb(null, isMatch);
			});
		};

		//generates a jwt
		schema.methods.session_start = function(req,cb /* cb(err,jwt,user,expires) */){

			var sessionObject = {
				_id: this._id,
				sid: uuid.v4(),
				date: (new Date()).getTime(),
				ip: {
					initiator: req.ip,
					current: req.ip
				}
			};
            
            var user = this.clean();//for the callback. remove pw/sessions from user object.
            
			jwt.sign(sessionObject, config.jwt_secret , {
				expiresIn: '1 hour',
			},function(err,token){
                
                var d = (new Date()).getTime() + (24 * 60 * 60 * 1000);
				
				//add the session to the user model
				req.app.model.User.findByIdAndUpdate(user._id,{ 
					$push: { 
						sessions: {
							sid: user.sid,
							ip: req.ip
						}
					}
				},function(err2){
					cb(err||err2||null,token,user,d);
				});

			});

		};

		schema.static('session_stop',function(req,cb){
			this.findByIdAndUpdate(req.user._id,{
				$pull: {
					sessions: {
						sid: req.user.sid
					}
				}
			},function(err){
				cb(err);
			})
		});

		schema.methods.generate_PWCT = function(password,expiry,cb){
			var self = this;
			self.validatePass(password,function(err,match){
				if(err || !match){
					return cb('Incorrect password');
				}

				jwt.sign({}, config.jwt_secret , {
					expiresIn: expiry,
				},function(err,token){
					cb(null,token);
				});
			});
        };
        
    });

}