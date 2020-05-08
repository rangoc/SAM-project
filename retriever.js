const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({
    // optional tuning - 50% faster(cold) / 20% faster(hot)
    apiVersion: '2012-08-10',
    sslEnabled: false,
    paramValidation: false,
    convertResponseTypes: false
});

const tableName = 'transactions';

exports.main = async (event,context,callback) => { 
    
    let params = { TableName: tableName };

    let scanResults = [];
    let items;

    do {
        items = await docClient.scan(params).promise();
        items.Items.forEach((item) => scanResults.push(item));
        params.ExclusiveStartKey = items.LastEvaluatedKey;
    } while (typeof items.LastEvaluatedKey != "undefined");

    const responseCode = 200;
    const response = {
        statusCode: responseCode,
        headers: {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
            "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS

        },

        body: JSON.stringify(scanResults),

    };
    callback(null,response);
}