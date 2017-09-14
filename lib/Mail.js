class Mail {

    constructor({transportProvider,templateProvider}){
        this.template = templateProvider;
        this.transport = transportProvider;
    }

    send(template,data){

        return this.template.compile(template,data).then((html)=>{
            return this.transport.send(html,data.subject,data.to,data.from);
        });

    }

}