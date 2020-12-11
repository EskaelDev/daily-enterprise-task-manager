import AWS, { ConfigurationOptions, DynamoDB } from 'aws-sdk';
import { ServiceConfigurationOptions } from 'aws-sdk/lib/service';
import fs from 'fs'
export default class DynamoTest {

    serviceConfigOptions: ServiceConfigurationOptions;
    dynamodb: DynamoDB;
    docClient: AWS.DynamoDB.DocumentClient;

    /**
     *
     */
    constructor() {
        this.serviceConfigOptions = {
            region: process.env.aws_region,
            endpoint: process.env.aws_dynamo_endpoint
        };
        AWS.config.update(this.serviceConfigOptions);
        this.dynamodb = new AWS.DynamoDB();
        this.docClient = new AWS.DynamoDB.DocumentClient();
    }

    // let dynamodb = new AWS.DynamoDB(serviceConfigOptions);

    // let docClient = new AWS.DynamoDB.DocumentClient( {
    //     region: "us-west-2",
    //     endpoint: "http://localhost:8000",
    //     convertEmptyValues: true
    // }); 



    params = {
        TableName: "Movies",
        KeySchema: [
            { AttributeName: "year", KeyType: "HASH" },  //Partition key
            { AttributeName: "title", KeyType: "RANGE" }  //Sort key
        ],
        AttributeDefinitions: [
            { AttributeName: "year", AttributeType: "N" },
            { AttributeName: "title", AttributeType: "S" }
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 10,
            WriteCapacityUnits: 10
        }
    };

    public createTable(): AWS.Request<DynamoDB.CreateTableOutput, AWS.AWSError> {
        return this.dynamodb.createTable(this.params, function (err, data) {
            if (err) {
                return err
            } else {
                return data;
            }
        });
    }

    public get() {
        let params = {
            TableName: "Movies",
            Key: {
                "year": 2013,
                "title": "Turn It Down, Or Else!",
            }
        };

        return this.docClient.get(params, function (err, data) {
            if (err) {
                console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
            }
        });

    }

    public upload() {

        var params = {
            TableName: "Movies",
            Item: {
                "year": 2013,
                "title": "Turn It Down, Or Else!",
                "info": {
                    "directors": [
                        "Alice Smith",
                        "Bob Jones"
                    ],
                    "release_date": "2013-01-18T00:00:00Z",
                    "rating": 6.2,
                    "genres": [
                        "Comedy",
                        "Drama"
                    ],
                    "image_url": "http://ia.media-imdb.com/images/N/O9ERWAU7FS797AJ7LU8HN09AMUP908RLlo5JF90EWR7LJKQ7@@._V1_SX400_.jpg",
                    "plot": "A rock band plays their music at high volumes, annoying the neighbors.",
                    "rank": 11,
                    "running_time_secs": 5215,
                    "actors": [
                        "David Matthewman",
                        "Ann Thomas",
                        "Jonathan G. Neff"
                    ]
                }
            }
        };

        return this.docClient.put(params, function (err, data) {
            if (err) {
                console.error("Unable to add movie", ". Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("PutItem succeeded:");
            }
        });
    }


    public update() {

        var params = {
            TableName: "Movies",
            Key: {
                "year": 2013,
                "title": "Turn It Down, Or Else!",
            },
            UpdateExpression: "set info.rating = :r, info.plot=:p, info.actors=:a",
            ExpressionAttributeValues: {
                ":r": 5.5,
                ":p": "Everything happens all at once.",
                ":a": ["Larry", "Moe", "Curly"]
            },
            ReturnValues: "UPDATED_NEW"
        };

        console.log("Updating the item...");
        return this.docClient.update(params, function (err, data) {
            if (err) {
                console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
            }
        });
    }
}