const TeamSchema = {
    TableName: "Teams",
    KeySchema: [
        { AttributeName: "teamName", KeyType: "HASH" },  //Partition key
    ],
    AttributeDefinitions: [
        { AttributeName: "teamName", AttributeType: "S" },
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
    }
};

export default TeamSchema;