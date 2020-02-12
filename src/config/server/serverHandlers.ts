import * as debug from 'debug';
import { Server } from 'https';
import { AddressInfo } from 'net';

/**
 * @param  {NodeJS.ErrnoException} error
 * @param  {number|string|boolean} port
 * @returns throw error
 */
export function onError(error: NodeJS.ErrnoException, port: number | string | boolean): void {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind: string = (typeof port === 'string') ? `Pipe ${port}` : `Port ${port}`;

    switch (error.code) {
        case 'EACCES':
            console.error(`${bind} requires elevated privileges`);
            process.exit(1);

            break;
        case 'EADDRINUSE':
            console.error(`${bind} is already in use`);
            process.exit(1);

            break;
        default:
            throw error;
    }
}

/**
 * @export onListening
 */
export function onListening(server: Server) {
    const addr: string | AddressInfo = server.address();
    const bind: string = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;

    debug(`Listening on ${bind}`);
}
