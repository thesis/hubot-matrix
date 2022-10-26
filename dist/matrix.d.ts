import { Robot, Adapter, Envelope, TextMessage, User } from "hubot";
import { ISendEventResponse, MatrixClient } from "matrix-js-sdk";
/**
 * The Matrix-specific metadata available about a message.
 */
export declare type MatrixMessageMetadata = {
    readonly threadId?: string;
    readonly interpretMarkdown?: boolean;
};
/**
 * Represents a regular Hubot TextMessage with additional Matrix metadata.
 */
export declare class MatrixMessage extends TextMessage {
    metadata: MatrixMessageMetadata;
    constructor(user: User, text: string, id: string, metadata: MatrixMessageMetadata);
}
export declare class Matrix extends Adapter {
    private robot;
    client: MatrixClient | undefined;
    private user_id;
    private access_token;
    private device_id;
    private commonMarkReader;
    private commonMarkRenderer;
    constructor(robot: Robot<Matrix>);
    handleUnknownDevices(err: {
        devices: {
            [x: string]: any;
        };
    }): (Promise<void> | undefined)[][];
    send(envelope: Envelope, ...strings: any[]): Promise<ISendEventResponse | undefined>[];
    resolveRoom(room: string): Promise<string>;
    sendThreaded(envelope: Envelope, threadId: string | undefined, message: string): Promise<ISendEventResponse | undefined>;
    emote(envelope: Envelope, ...strings: string[]): Promise<(Promise<ISendEventResponse | undefined> | undefined)[]>;
    reply(envelope: Envelope, ...strings: string[]): Promise<ISendEventResponse | undefined>[];
    topic(envelope: Envelope, ...strings: string[]): (Promise<ISendEventResponse> | undefined)[];
    sendURL(envelope: Envelope, url: string): Promise<ISendEventResponse | undefined>;
    run(): Promise<any>;
}
export declare function use(robot: Robot<any>): Matrix;
