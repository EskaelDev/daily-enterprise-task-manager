import AWS, { Translate } from "aws-sdk";
import { Service } from "typedi";
import { Language } from "../../enums/languages.enum";

@Service()
export default class TranslationService {

    private translator: AWS.Translate;

    constructor() {
        this.translator = new AWS.Translate({ apiVersion: '2017-07-01' });
    }

    public async Translate(text: string, from: string, to: string): Promise<AWS.Request<Translate.TranslateTextResponse, AWS.AWSError>> {

        var params: Translate.Types.TranslateTextRequest = {
            SourceLanguageCode: from, /* required */
            TargetLanguageCode: to, /* required */
            Text: text, /* required */
        };
        return this.translator.translateText(params, function (err, data) {
            if (err) return err
            else return data;
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