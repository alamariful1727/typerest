import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as pino from 'pino';
import * as loga from 'express-pino-logger';
import * as helmet from 'helmet';
import { HttpError } from '../error/index';
import { sendHttpErrorModule } from '../error/sendHttpError';
import { Application } from 'express';
// import * as Routes from '../../modules/route';
/**
 * @export
 * @param {Application} app
 */
export function configure(app: Application): void {
    const pinoLogger: pino.Logger = pino({
        prettyPrint: {
            colorize: true, translateTime: true
        }
    });
    // express middleware

    app.use(bodyParser.urlencoded({
        extended: false
    }));
    app.use(bodyParser.json());
    // parse Cookie header and populate req.cookies with an object keyed by the cookie names.
    app.use(cookieParser());
    // returns the compression middleware
    app.use(compression());

    if (process.env.NODE_ENV !== 'production') {
        app.use(loga({
            logger: pinoLogger
        }));
    }
    // helps you secure your Express apps by setting various HTTP headers
    app.use(helmet());
    // providing a Connect/Express middleware that can be used to enable CORS with various options
    app.use(cors());


    // custom errors
    app.use(sendHttpErrorModule);

    // cors
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS ');
        res.header(
            'Access-Control-Allow-Headers',
            'Origin, X-Requested-With,' +
            ' Content-Type, Accept,' +
            ' Authorization,' +
            ' Access-Control-Allow-Credentials'
        );
        res.header('Access-Control-Allow-Credentials', 'true');
        next();
    });
}

// interface CustomResponse extends Response {
//     sendHttpError: (error: HttpError | Error, message?: string) => void;
// }

/**
 * @export
 * @param {Application} app
 */
export function initErrorHandler(app: Application) {
    app.use((error: any, req: any, res: any, next: any) => {
        if (typeof error === 'number') {
            error = new HttpError(error); // next(404)
        }

        if (error instanceof HttpError) {
            res.sendHttpError(error);
        } else {
            if (app.get('env') === 'development') {
                error = new HttpError(500, error.message);
                res.sendHttpError(error);
            } else {
                error = new HttpError(500);
                res.sendHttpError(error, error.message);
            }
        }

        console.error(error);
    });
}
