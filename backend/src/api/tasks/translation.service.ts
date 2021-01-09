import AWS, { Translate } from "aws-sdk";
import { ServiceConfigurationOptions } from "aws-sdk/lib/service";
import { Service } from "typedi";
import { Language } from "../../enums/languages.enum";

@Service()
export default class TranslationService {

    private translator: AWS.Translate;
    serviceConfigOptions: ServiceConfigurationOptions;

    constructor() {
        this.serviceConfigOptions = {
            region: process.env.aws_region,
            endpoint: process.env.aws_translator_endpoint
        };
        AWS.config.update(this.serviceConfigOptions);
        this.translator = new AWS.Translate();
    }

    public async Translate(text: string, from: string, to: string): Promise<AWS.Request<Translate.TranslateTextResponse, AWS.AWSError>> {

        var params: Translate.Types.TranslateTextRequest = {
            SourceLanguageCode: from, /* required */
            TargetLanguageCode: to, /* required */
            Text: text, /* required */
        };
        return this.translator.translateText(params, function (err, data) {
            if (err)
                return err
            else
                return data;
        });

    }

    public EnumToCode(languageEnum: Language): string {
        switch (+languageEnum) {
            case 0:
                return "en";
                break;
            case 2:
                return "de";
                break;
            case 1:
                return "pl";
                break;

            default:
                return "";
                break;
        }
    }
}