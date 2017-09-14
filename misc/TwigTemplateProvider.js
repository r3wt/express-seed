const Twig = require('twig');

class TwigTemplateProvider {

    constructor(templatePath=config.mail.templatePath,cache=true){
        this.path = templatePath;
        this.cache = cache;

        if(!this.cache){
            Twig.cache(false);//disable template cacheing for twig.
        }
    }

    _determinePath( template ) {
        let tpl = Lib.Util.basepath(this.templatePath + template);
        //if no extension assume .twig
        if(!Lib.Util.ext(tpl)){
            tpl +='.twig';
        }
        return tpl;
    }

    compile(template,data){
        return new Promise((resolve,reject)=>{
            Twig.twig({
                path: _determinePath(template),
                method: 'fs',
                load: (t)=>{
                    resolve( ''+t.render(data) );
                }
            })
        })
    }
}

module.exports = TwigTemplateProvider;