'use strict'
const AWS = require ('aws-sdk');

AWS.config.update({region : "us-east-1"});

exports.handler = async (event, context) => {
    const dDB = new AWS.DynamoDB({ apiVersion: "2012-10-08"}); //en standard apiVersion
    const documentClient = new AWS.DynamoDB.DocumentClient({ region : "us-east-1" });

    var responseBody = "";
    var statusCode = 0;
    
   
    var today = Math.floor(new Date().getTime()/1000.0).toString();
    var tomorrowInt = parseInt(today)+604800;
    var tomorrow = toString(tomorrowInt);

    var params = {
        TableName: "Aktivitet",
        ProjectionExpression: "#Unix, Namn, Beskrivning, Adress",
        FilterExpression: "#Unix between :today and :tomorrow",
        ExpressionAttributeNames: {
            "#Unix": "Unix",
        },
        ExpressionAttributeValues: {
             ":today": today,
             ":tomorrow": tomorrow 
        }
    };

    try{
        const data = await documentClient.scan(params).promise();
        data.Items.forEach(function (aktivitet){
            responseBody = responseBody + JSON.stringify(
                aktivitet.Namn + ": "+
                aktivitet.Adress + ", "+ 
                aktivitet.Beskrivning + ", "+
                aktivitet.Unix)
        })
        statusCode = 200;
    }
    catch(error){
        responseBody = 'Kan inte hämta aktivitet';
        statusCode = 403;
    }
    const response = {
        statusCode : statusCode,
        headers: {
            "myHeader": "test"
        },
        body : responseBody
    }
    return response;
}