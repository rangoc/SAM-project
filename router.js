'use strict';
const AWS = require('aws-sdk');
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});
exports.main = function (event,context,callback) { 
    
    const region = context.invokedFunctionArn.split(':')[3];
    const responseCode = 200;
    const response = {
        statusCode: responseCode,
        headers: {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
            "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS

        },

        "body": "{\"result\": \"Success.\"}",

    };

        const data = JSON.parse(event.body);
        const nlb = data.message.includes("NLB");
        const hipotekarna = data.message.includes("Hipotekarna");
        if( hipotekarna == true ) { 
            // posalji poruku na hipotekarna sqs queue
            const params = {
                MessageBody: data.message,
                QueueUrl: 'https://sqs.' + region + '.amazonaws.com/' + event.requestContext.accountId + '/hb_message_processing_queue'
            };
            sqs.sendMessage(params, function(err, data) {
                if (err) console.log(err, err.stack); // an error occurred
                else     console.log(data);           // successful response
              });
        }
        else if( nlb == true ) { 
            // posalji poruku na nlb queue
            const params = {
                MessageBody: data.message,
                QueueUrl: 'https://sqs.'+ region +'.amazonaws.com/' + event.requestContext.accountId + '/nlb_message_processing_queue'
            };
            sqs.sendMessage(params, function(err, data) {
                if (err) console.log(err, err.stack); // an error occurred
                else     console.log(data);           // successful response
              });
        }
        else { 
            console.log(data.message);
        }
        callback(null, response);
};
    
