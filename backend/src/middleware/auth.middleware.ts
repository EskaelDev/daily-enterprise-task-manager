import { ExpressMiddlewareInterface } from 'routing-controllers';
import jwt from 'jsonwebtoken';

export class AuthMiddleware implements ExpressMiddlewareInterface {
    // interface implementation is optional

    use(req: any, res: any, next: (err?: any) => any): any {
        // Gather the jwt access token from the request header
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (token == null) return res.sendStatus(401); // if there isn't any token

        jwt.verify(token, process.env.TOKEN_SECRET as string, (err: any, user: any) => {

            if (err) {
                console.log(err);
                return res.sendStatus(403);
            }
            req.user = user;
            next(); // pass the execution off to whatever request the client intended
        }
        )
    }
}