const sg = require('sendgrid');

class SendgridTransportProvider {

    constructor(options){
        this.options = options;
        this.transport = sg(options.sendgrid_key);
    }

    send(html,subject,to,from){

        if(!Array.isArray(to)){
            to = [to];//because sendgrid expects array.
        }

        return new Promise((resolve,reject)=>{

            let request = this.agent.emptyRequest({
                method: 'POST',
                path: '/v3/mail/send',
                body: {
                    personalizations: [
                        {
                            to: to,
                            subject: subject,
                        },
                    ],
                    from: from || this.options.from,
                    content: [
                        {
                            type: 'text/html',
                            value: html,
                        },
                    ],
                },
            });
            
            this.agent.API(request,(error, response)=> {
                if (error) {
                    return reject(error);
                }
                resolve();
            });
                    
        });
    }

}

module.exports = SendgridTransportProvider;