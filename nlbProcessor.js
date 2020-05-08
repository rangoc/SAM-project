'use strict';

var AWS = require('aws-sdk');
var sqs = new AWS.SQS({apiVersion: '2012-11-05'});

exports.main = function (event,context) { 
    const accountId = context.invokedFunctionArn.split(':')[4];
    const data = event.Records[0].body;
    const splitString = data.split('\n');
    
    const card = splitString[0].split(':');
    const bank = splitString[1].split(':');
    const amount = splitString[2].split(' ');
    const time = splitString[3].split(' ');
    const status = splitString[4].split(':');
    const description = splitString[5].split(':');
    const balance = splitString[6].split(' ');

    const cardValue = card[1];
    const bankValue = bank[1];
    const amountValue = amount[1];
    const timeValue = time[1] + " " + time[2];
    const statusValue  = status[1];
    const descriptionValue = description[1];
    const balanceValue = balance[1];
    const currency = amount[2];


    const params = {
        MessageAttributes: {
            "Card": {
                DataType: "String",
                StringValue: cardValue.trim()
            },
            "Bank": {
                DataType: "String",
                StringValue: bankValue.trim()
            },
            "Amount": {
                DataType: "String",
                StringValue: amountValue.trim()
            },
            "Currency": {
                DataType: "String",
                StringValue: currency.trim()
            },
            "Time": {
                DataType: "String",
                StringValue: timeValue.trim()
            },
            "Status": {
                DataType: "String",
                StringValue: statusValue.trim()
            },
            "Description": {
                DataType: "String",
                StringValue: descriptionValue.trim()
            },
            "Balance": {
                DataType: "String",
                StringValue: balanceValue.trim()
            }
        },
        MessageBody: event.Records[0].body,
        QueueUrl: 'https://sqs.'+ region +'.amazonaws.com/' + accountId + '/parsed_messages'
    };

    sqs.sendMessage(params, function (err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Success", data.MessageId);
        }
    });

}