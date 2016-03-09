/**
 * GcmController
 *
 * @description :: Server-side logic for managing gcms
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var request = require('request');
var fs = require('fs');
var apikey = JSON.parse(fs.readFileSync('./apikey.json', 'utf8'));
console.log("api",apikey);
module.exports = {
	sendNotification: function(req,res){
        if(!apikey){
            return res.serverError({"status":"No API key found"});
        }
        var data = req.param('data');
        if(!data || !data.notification || !data.to){
            return res.badRequest({"status":"Missing parameters"});
        }       
        console.log(data);
        request.post({
            headers: {'content-type' : 'application/json',
            'Authorization':apikey.apiKey},
            url:     'https://gcm-http.googleapis.com/gcm/send',
            body:    JSON.stringify(data)
            }, function(error, response, body){
            console.log(body);
        });
        return res.ok({"status":"notification sent"});        
    },
    
    sendNotificationByUserId: function(req,res){
        if(!apikey){
            return res.serverError({"status":"No API key found"});
        }
        var userId = req.param('userId');
        if(!userId){
            return res.badRequest({"status":"Missing parameters"});            
        }
        var data = req.param('data');
        if(!data || !data.notification){
            return res.badRequest({"status":"Missing parameters"});
        }
        Gcm.findOne({'userId':userId}).exec(function(err,gcmData){
            if(err || !gcmData){
                return res.badRequest({"status":"Check User Id"});
            }
            else{
                console.log(gcmData);
                data.to = gcmData.token;
                console.log(data);
                request.post({
                headers: {'content-type' : 'application/json',
                    'Authorization':apikey.apiKey},
                    url:     'https://gcm-http.googleapis.com/gcm/send',
                     body:    JSON.stringify(data)
                    }, function(error, response, body){
                    console.log(error, body);
                    return res.ok({"status":"notification sent"});
                });                
            }             
        });     
              
    }
};

