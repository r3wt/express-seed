// uses simple event emitter to attach middleware to the crud operations
// making simple crud generation with access control/validation easy as writing the access control middleware

const EventEmitter = require('events');

//used to install default middleware for an route method if it hasn't been established already.
function _defaultMiddleware( instance, event ){
    if(instance.listenerCount(event) == 0){
        instance.on(event,(req,res,next)=>{ next() })
    }
}

class Crud extends EventEmitter {

    constructor( modelName ){
        this.model = app.model[modelName];
        if(!this.model){
            throw new Error(`invalid model "${modelName}". unable to find model with that name.`);
        }
        this.fields = Object.keys((new this.model()).toObject()).filter((v)=> v!='_id');

        //we want at most 1 event per method. this so we can req/res/next only once!
        this.setMaxListeners(1);
    }
    
    query(req,res) {
        _defaultMiddleware(this,'query');
        this.emit('query',req,res,()=>{
            var validate = req.validate('POST',[],['page','pageSize','query','sort','select']);
        
            var query = validate.data.query || {};
            
            if(typeof query != 'object' || query instanceof Array){
                return res.bad('invalid value for field `query`');
            }
        
            var page = ~~(validate.data.page || 1);
            page -= 1;
            var size = ~~(validate.data.pageSize || 10);
            var offset = page * offset;
            
            if(page <0){
                page=0;
            }
            if(size < 10){
                size = 10;
            }
            if(size > 100){
                size = 100;
            }
            
            var select = validate.data.select || {};

            if(typeof select != 'object' && typeof select != 'string'){
                return res.bad('invalid value for field `select`');
            }

            var sort = validate.data.sort || {};

            if(typeof sort != 'object' && typeof sort != 'string'){
                return res.bad('invalid value for field `sort`');
            }

            Promise.all([
                this.model.find(query).sort(sort).skip(offset).limit(size).select(select).exec(),
                this.model.count(query).exec()
            ]).spread((results,count)=>{
                res.ok({
                    results: results,
                    pages: Math.ceil(count/size),
                    page: page+1,
                    pageSize: size,
                    count: count
                });
            });
        });
    }

    create(req,res) {
        _defaultMiddleware(this,'create');
        this.emit('create',req,res,()=>{
            (new this.model(req.body)).save((err,m)=>{
                if(err){
                    return res.err(err);
                }
                if(!m){
                    return res.notFound();
                }
                res.ok(m);
            })
        });
    }

    read(req,res) {
        _defaultMiddleware(this,'read');
        this.emit('read',req,res,()=>{

            var id = (
                req.params._id || req.params.id || 
                req.query._id || req.query.id || 
                req.body._id || req.body.id || null
            );

            if(id == null){
                res.bad('invalid or missing parameter `id`');
            }

            this.model.findOne({ _id: id },(err,m)=>{
                if(err){
                    return res.err(err);
                }
                if(!m){
                    return res.notFound();
                }
                res.ok(m);
            });

        });
    }

    update(req,res) {
        _defaultMiddleware(this,'update');
        this.emit('update',req,res,()=>{
            
            var id = (
                req.params._id || req.params.id || 
                req.query._id || req.query.id || 
                req.body._id || req.body.id || null
            );

            if(id == null){
                res.bad('invalid or missing parameter `id`');
            }

            this.model.findOne({ _id: id },function(err,m){
                if(err){
                    return res.err(err);
                }
                if(!m){
                    return res.notFound();
                }

                for(var i=0;i<this.fields.length;i++){
                    if(req.body.hasOwnProperty(this.fields[i])){
                        m[fields[i]] = req.body[fields[i]];
                    }
                }

                m.save(function(err){
                    if(err){
                        return res.err(err);
                    }
                    res.ok(m);
                });
            });

        });
    }

    delete(req,res) {
        _defaultMiddleware(this,'delete');
        this.emit('delete',req,res,()=>{
            
            var id = (
                req.params._id || req.params.id || 
                req.query._id || req.query.id || 
                req.body._id || req.body.id || null
            );

            if(id == null){
                res.bad('invalid or missing parameter `id`');
            }

            this.model.findOne({ _id: id },(err,m)=>{
                if(err){
                    return res.err(err);
                }
                if(!m){
                    return res.notFound();
                }

                m.remove((err)=>{
                    if(err){
                        return res.err(err);
                    }
                    res.ok();
                });

            });

        });
    }

}

module.exports = Crud;

/* usage example

Const UserController = new Lib.Crud('User');

//using events to implement middleware
UserController.on('update',function(req,res,next){
    //call next() to proceed with operation
})

*/