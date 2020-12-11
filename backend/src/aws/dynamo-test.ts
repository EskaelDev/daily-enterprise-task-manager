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
                console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
            }
            return data;
        });
    }


    public upload() {

        var params = {
            TableName: "Movies",
            Item: {
                "year": 1999,
                "title": 'movie.title',
                "info": 'movie.info'
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



    public LoadData() {

        var docClient = new AWS.DynamoDB.DocumentClient();

        console.log("Importing movies into DynamoDB. Please wait.");

        var allMovies = JSON.parse(fs.readFileSync('../../moviedata.json', 'utf8'));
        allMovies.forEach(function (movie: any) {
            var params = {
                TableName: "Movies",
                Item: {
                    "year": movie.year,
                    "title": movie.title,
                    "info": movie.info
                }
            };

            docClient.put(params, function (err, data) {
                if (err) {
                    console.error("Unable to add movie", movie.title, ". Error JSON:", JSON.stringify(err, null, 2));
                } else {
                    console.log("PutItem succeeded:", movie.title);
                }
            });
        });
    }
}