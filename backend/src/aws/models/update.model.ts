export default interface DynamoUpdateModel {
    TableName: string;
    Key: object;
    /** "set info.rating = :r, info.plot=:p, info.actors=:a" */
    UpdateExpression: string;
    /**
     * {
     * 
     * ":r": 5.5,
     * 
     * ":p": "Everything happens all at once.",
     * 
     * ":a": ["Larry", "Moe", "Curly"]
     * 
     * }
     */
    ExpressionAttributeValues: object;

    /** always set to "UPDATED_NEW" */
    ReturnValues: string;

}