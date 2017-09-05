//for single user account.
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const uuid = require('node-uuid');

module.exports = (app,Types,validate)=>{

    app.model('User',{

		email: { 
			type: String, 
			validate: validate('email'),
			index: {
				unique: true	
			}
		},

		phone: { 
            type: String,
            validate: validate('mobile_phone'),
            index: {
                unique: true,
                partialFilterExpression: { phone: {$type: 'string'} }
            }
		},
		
		password: { type: String, required: true },

		username: { 
			type: String, 
			index: {
				unique: true
			},
			default: uuid.v4(), //pass uuid.v4 function to auto generate usernames
			validate: validate('username')
		},
			
		firstname: { type: String, default: '' },
		lastname: { type: String, default:'' },
		birthday: { type: Date, default: null },

		avatar: { type: String, default: '/assets/anon.png', validate: validate('url') },
		sex: { type: String, enum:['male','female','undisclosed'], default: 'undisclosed' },
		
		about: { type: String, validate: validate('text-140') },

		//meta
        status: { type: String, enum:[ 'active','unconfirmed','locked' ], default: 'active' },
        roles: {
            user:{ type: Boolean, default: true },
            admin:{ type: Boolean, default: false }
        },
		sessions: [
			{
				ip: String, validate: validate('ip'),
				sid: { type: String, validate: validate('uuid') }
			}
		]
    },{ timestamps: true },(schema)=>{
		
		//password hashing
		schema.pre('save', function(next) {
			// this = document
			if (!this.isModified('password')) return next();
			bcrypt.genSalt(10,(err, salt)=>{
				if (err) return next(err);
				bcrypt.hash(this.password, salt,(err, hash)=>{
					if (err) return next(err);
					this.password = hash;
					next();
				});
			});
		});
        
        //calls toObject(), removes sensitive fields, and returns the cleaned object.
		schema.methods.clean = function(){
			var obj = this.toObject();
			var sensitive = ['password','sessions'];
			sensitive.forEach((item)=>{
				delete obj[item];
			});
			return obj;
		};
		
		//verify password on login
		schema.methods.validatePass = function(candidatePassword, cb) {
			bcrypt.compare(candidatePassword, this.password, cb);
		};

		//generates a jwt
		schema.methods.session_start = function(req,cb /* cb(err,jwt,user) */){

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
            
			var token = jwt.sign(sessionObject, config.jwt_secret , {
				expiresIn: config.jwt_expiry,
			},(err,token)=>{
                	
				//add the session to the user model
				req.app.model.User.findByIdAndUpdate(user._id,{ 
					$push: { 
						sessions: {
							sid: user.sid,
							ip: req.ip
						}
					}
				},(err2)=>{
					cb(err||err2||null,token,user);
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
			},cb);
		});
        
    });

}