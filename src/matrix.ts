import { Robot, Adapter, Envelope, TextMessage, User } from "hubot";
import {
  ClientEvent,
  ISendEventResponse,
  MatrixClient,
  RoomEvent,
  RoomMemberEvent,
} from "matrix-js-sdk";

import sdk from "matrix-js-sdk";
import request from "request";
import sizeOf from "image-size";
import { makeHtmlNotice, makeNotice } from "matrix-js-sdk/lib/content-helpers";
import { Parser, HtmlRenderer } from "commonmark";

/**
 * The Matrix-specific metadata available about a message.
 */
export type MatrixMessageMetadata = {
  readonly threadId?: string;
  readonly interpretMarkdown?: boolean;
};

/**
 * Represents a regular Hubot TextMessage with additional Matrix metadata.
 */
export class MatrixMessage extends TextMessage {
  constructor(
    user: User,
    text: string,
    id: string,
    public metadata: MatrixMessageMetadata
  ) {
    super(user, text, id);
  }
}

export class Matrix extends Adapter {
  public client: MatrixClient | undefined;
  private user_id: string | undefined;
  private access_token: string | undefined;
  private device_id: string | undefined;

  private commonMarkReader = new Parser();
  private commonMarkRenderer = new HtmlRenderer({ safe: true });

  constructor(private robot: Robot<Matrix>) {
    super(robot);
    this.robot.logger.info("Constructor");
  }

  handleUnknownDevices(err: { devices: { [x: string]: any } }) {
    return (() => {
      let result = [];
      for (var stranger in err.devices) {
        var devices = err.devices[stranger];
        result.push(
          (() => {
            let result1 = [];
            for (let device in devices) {
              this.robot.logger.info(
                `Acknowledging ${stranger}'s device ${device}`
              );
              result1.push(this.client?.setDeviceKnown(stranger, device));
            }
            return result1;
          })()
        );
      }
      return result;
    })();
  }

  send(envelope: Envelope, ...strings: any[]) {
    return strings.map((str) => this.sendThreaded(envelope, undefined, str));
  }

  sendThreaded(
    envelope: Envelope,
    threadId: string | undefined,
    message: string
  ): Promise<ISendEventResponse | undefined> | undefined {
    const interpretMarkdown =
      "metadata" in (envelope.message ?? {})
        ? (envelope.message as MatrixMessage).metadata.interpretMarkdown ?? true
        : true;

    const finalMessage = interpretMarkdown
      ? makeHtmlNotice(
          message,
          this.commonMarkRenderer.render(this.commonMarkReader.parse(message))
        )
      : makeNotice(message);

    this.robot.logger.info(`Sending to ${envelope.room}: ${message}`);
    if (/^(f|ht)tps?:\/\//i.test(message)) {
      return this.sendURL(envelope, message);
    }
    if (threadId !== undefined) {
      return this.client
        ?.sendMessage(envelope.room, threadId, finalMessage)
        ?.catch((err) => {
          if (err.name === "UnknownDeviceError") {
            this.handleUnknownDevices(err);
            return this.client?.sendMessage(
              envelope.room,
              threadId,
              finalMessage
            );
          }
        });
    }
    return this.client
      ?.sendMessage(envelope.room, finalMessage)
      .catch((err) => {
        if (err.name === "UnknownDeviceError") {
          this.handleUnknownDevices(err);
          return this.client?.sendMessage(envelope.room, finalMessage);
        }
      });
  }

  emote(envelope: Envelope, ...strings: string[]) {
    return Array.from(strings).map((str) =>
      this.client?.sendEmoteMessage(envelope.room, str).catch((err) => {
        if (err.name === "UnknownDeviceError") {
          this.handleUnknownDevices(err);
          return this.client?.sendEmoteMessage(envelope.room, str);
        }
      })
    );
  }

  reply(envelope: Envelope, ...strings: string[]) {
    const threadId =
      "metadata" in envelope.message
        ? (envelope.message as MatrixMessage).metadata.threadId
        : undefined;

    return Array.from(strings).map((str) =>
      this.sendThreaded(envelope, threadId, `${envelope.user.name}: ${str}`)
    );
  }

  topic(envelope: Envelope, ...strings: string[]) {
    return Array.from(strings).map((str) =>
      this.client?.sendStateEvent(
        envelope.room,
        "m.room.topic",
        {
          topic: str,
        },
        ""
      )
    );
  }

  async sendURL(
    envelope: Envelope,
    url: string
  ): Promise<ISendEventResponse | undefined> {
    this.robot.logger.info(`Downloading ${url}`);
    return new Promise((resolve, reject) => {
      request({ url, encoding: null }, (error, response, body) => {
        if (error) {
          this.robot.logger.info(`Request error: ${JSON.stringify(error)}`);
          reject(error);
        } else if (response.statusCode === 200) {
          let info: sdk.IImageInfo;
          try {
            let dims = sizeOf(body);
            this.robot.logger.info(
              `Image has dimensions ${JSON.stringify(dims)}, size ${
                body.length
              }`
            );
            if (dims.type === "jpg") {
              dims.type = "jpeg";
            }
            info = {
              mimetype: `image/${dims.type}`,
              h: dims.height,
              w: dims.width,
              size: body.length,
            };
            resolve(
              this.client
                ?.uploadContent(body, {
                  name: url,
                  type: info.mimetype,
                  rawResponse: false,
                  onlyContentUri: true,
                })
                .then((content_uri) => {
                  return this.client
                    ?.sendImageMessage(envelope.room, content_uri, info, url)
                    .catch((err) => {
                      if (err.name === "UnknownDeviceError") {
                        this.handleUnknownDevices(err);
                        return this.client?.sendImageMessage(
                          envelope.room,
                          content_uri,
                          info,
                          url
                        );
                      }
                    });
                })
            );
          } catch (error1) {
            error = error1;
            this.robot.logger.info(error.message);
            resolve(this.sendThreaded(envelope, undefined, ` ${url}`));
          }
        }
      });
    });
  }

  run() {
    this.robot.logger.info(`Run ${this.robot.name}`);
    let client = sdk.createClient({
      baseUrl: process.env.HUBOT_MATRIX_HOST_SERVER || "https://matrix.org",
      request: request,
    });
    return client.login(
      "m.login.password",
      {
        user: process.env.HUBOT_MATRIX_USER || this.robot.name,
        password: process.env.HUBOT_MATRIX_PASSWORD,
      },
      (
        err: any,
        data: { user_id: string; access_token: string; device_id: string }
      ) => {
        if (err) {
          this.robot.logger.error(err);
          return;
        }
        this.user_id = data.user_id;
        this.access_token = data.access_token;
        this.device_id = data.device_id;
        this.robot.logger.info(
          `Logged in ${this.user_id} on device ${this.device_id}`
        );
        this.client = sdk.createClient({
          baseUrl: process.env.HUBOT_MATRIX_HOST_SERVER || "https://matrix.org",
          accessToken: this.access_token,
          userId: this.user_id,
          deviceId: this.device_id,
          request,
        });
        this.client?.on(ClientEvent.Sync, (state) => {
          switch (state) {
            case "PREPARED":
              this.robot.logger.info(
                `Synced ${this.client?.getRooms().length} rooms`
              );
              // We really don't want to let people set the display name to something other than the bot
              // name because the bot only reacts to it's own name.
              const currentDisplayName = this.client?.getUser(
                this.user_id ?? ""
              )?.displayName;
              if (this.robot.name !== currentDisplayName) {
                this.robot.logger.info(
                  `Setting display name to ${this.robot.name}`
                );
                this.client?.setDisplayName(this.robot.name, () => {});
              }
              return this.emit("connected");
          }
        });
        this.client?.on(
          RoomEvent.Timeline,
          (event, room, toStartOfTimeline) => {
            if (
              event.getType() === "m.room.message" &&
              toStartOfTimeline === false
            ) {
              this.client?.setPresence({ presence: "online" });
              let id = event.getId();
              let message = event.getContent();
              let name = event.getSender();
              let user = this.robot.brain.userForId(name);
              user.room = room.roomId;
              if (name !== this.user_id) {
                this.robot.logger.info(
                  `Received message: ${JSON.stringify(message)} in room: ${
                    user.room
                  }, from: ${user.name} (${user.id}).`
                );
                if (message.msgtype === "m.text") {
                  const messageThreadId = event.threadRootId ?? id;

                  this.receive(
                    new MatrixMessage(user, message.body, id, {
                      threadId: messageThreadId,
                    })
                  );
                }
                if (
                  message.msgtype !== "m.text" ||
                  message.body.indexOf(this.robot.name) !== -1
                ) {
                  return this.client?.sendReadReceipt(event);
                }
              }
            }
          }
        );
        this.client?.on(RoomMemberEvent.Membership, async (event, member) => {
          if (
            member.membership === "invite" &&
            member.userId === this.user_id
          ) {
            await this.client?.joinRoom(member.roomId);
            this.robot.logger.info(`Auto-joined ${member.roomId}`);
          }
        });
        return this.client?.startClient({ initialSyncLimit: 0 });
      }
    );
  }
}

export function use(robot: Robot<any>): Matrix {
  return new Matrix(robot);
}
