# BANK SMS SAM Project
## 1. Architecture Overview: 

![Image of SAM Project](https://i.imgur.com/rxBW98l.png)


## 2. Project brief: 
Application that is processing financial reports from banks via SMS.
Application required for an API Gateway to be set up, so that it could receive POST and GET requests. 

*POST part*:

Once POST request reaches the API, corresponding lambda get's triggered, takes the payload from API Gateway, parses the message body looking for a certain keywoard and based on that forwards the message
to a corresponding SQS queue ( And there are 2 of them ). Those SQS queues, are serving as triggers for two separate lambdas, which take the messages from the queues and parse them into appropriate mappings, making them
"ready" for the last "parsed_messages" SQS queue. That queue, triggers the lambda that is reserved for writting the message into a DynamoDB table. 

*GET part*:

Once GET request reaches the API, corresponding lambda get's triggered and retrieves all records from DynamoDB table, with scan operation, and returns the
response to the API Gateway.
