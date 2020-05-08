'use strict';

var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB.DocumentClient({region: 'eu-central-1'});

exports.main = function(event,context,callback) { 
    const data = event.Records[0].messageAttributes

    const params = {
        Item: {
            uuid: context.awsRequestId,
            Card: data.Card.stringValue,
            Bank: data.Bank.stringValue,
            Amount: data.Amount.stringValue,
            Currency: data.Currency.stringValue,
            Time: data.Time.stringValue,
            Status: data.Status.stringValue,
            Description: data.Description.stringValue,
            Balance: data.Balance.stringValue,
        },

        TableName: 'transactions'
    };
    dynamodb.put(params, function(err, data){
        if(err){
            callback(err, null);
        }else{
            callback(null);
        }
    });
}