import AWS, { SNS } from "aws-sdk";
import { ServiceConfigurationOptions } from "aws-sdk/lib/service";
import { Service } from "typedi";

@Service()
export default class SnsService {

    private sns: AWS.SNS;


    serviceConfigOptions: ServiceConfigurationOptions;


    constructor() {
        this.serviceConfigOptions = {
            region: process.env.aws_region,
            endpoint: process.env.aws_sns_endpoint
        };
        AWS.config.update(this.serviceConfigOptions);
        this.sns = new AWS.SNS();
    }



    Send(message: string) {

        let params: SNS.Types.PublishInput = {
            Message: message,
            TopicArn: "arn:aws:sns:us-east-1:453738702555:daily-task-manager"
        };
        var publishTextPromise = this.sns.publish(params).promise();

        // Handle promise's fulfilled/rejected states
        publishTextPromise.then(
            function (data) {
                console.log("MessageID is " + data.MessageId);
            }).catch(
                function (err) {
                    console.error(err, err.stack);
                });
        return true
    }


    // async GetSmsAttributes() {
    //     console.log(AWS.config);
    //     this.sns.listSubscriptions(function (err, data) {
    //         if (err)
    //             console.log(err, err.stack); // an error occurred
    //         else
    //             console.log(data);           // successful response
    //     });

    //     var publishTextPromise = this.sns.publish(this.params).promise();

    //     // Handle promise's fulfilled/rejected states
    //     publishTextPromise.then(
    //         function (data) {
    //             // console.log(`Message ${params.Message} sent to the topic ${params.TopicArn}`);
    //             console.log("MessageID is " + data.MessageId);
    //         }).catch(
    //             function (err) {
    //                 console.error(err, err.stack);
    //             });
    // }
}