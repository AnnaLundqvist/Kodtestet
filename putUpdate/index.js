'use strict'
const AWS = require ('aws-sdk');

AWS.config.update({region : "us-east-1"});

exports.handler = async (event, context) => {
    const dDB = new AWS.DynamoDB({ apiVersion: "2012-10-08"}); //en standard apiVersion
    const documentClient = new AWS.DynamoDB.DocumentClient({ region : "us-east-1" });

    let responseBody = "";
    let statusCode = 0;

    const { namn } = event.pathParameters;

    const { Beskrivning, Adress, Unix} = JSON.parse(event.body);

    const params = {
        TableName: "Aktivitet",
        Item:  {
            Namn: namn,
            Beskrivning: Beskrivning,
            Adress: Adress,
            Unix: Unix
        }
    }

    try{
        const data = await documentClient.put(params).promise();
        responseBody = JSON.stringify(data);
        statusCode = 201;
    }catch(error) {
        responseBody = 'Kan inte skriva aktivitet!' ;
        statusCode = 403;
    }

    const response = {
        statusCode: statusCode,
        headers: {
            "myHeader": "test"
        },
        body: responseBody
    }
    return response;
}