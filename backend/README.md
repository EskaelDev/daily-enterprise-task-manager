## Installation
`> npm i` install all node packages.

`> npm run dev` for nodemon (service that listens for updates in files).

`> npm run build` to build .js files.

`> npm start` to start nerver from .js files.

### env
create `.env` file with content as such:
``` 
# Port
PORT=5000

aws_access_key_id=
aws_secret_access_key=
aws_session_token=

aws_region=us-east-1
aws_dynamo_endpoint=https://dynamodb.us-east-1.amazonaws.com


private_key=
salt=
```

## Info
API port: 5000

## Available endpoint
GET: localhost:5000/users

## Usefull links
[Overview of Routing Controllers in Polish](https://solutionchaser.com/piszemy-kontrolery-w-nodejs-latwiej-i-szybciej/)

[Routing Controllers Github Page](https://github.com/typestack/routing-controllers)

[AWS SDK](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/)

[AWS SDK Getting Started](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/welcome.html)

[DynamoDB CRUD](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.03.html)

[JWT PL](https://www.unity.pl/blog/jak-napisac-aplikacje-ktora-pozwoli-na-uwierzytelnienie-uzytkownika-wykorzystujac-tokeny-jwt/)

[JWT Passport EN](https://www.digitalocean.com/community/tutorials/api-authentication-with-json-web-tokensjwt-and-passport)

[JWT Example](https://www.digitalocean.com/community/tutorials/nodejs-jwt-expressjs)