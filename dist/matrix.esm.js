import { TextMessage, Adapter } from 'hubot';
import sdk, { ClientEvent, RoomEvent, RoomMemberEvent } from 'matrix-js-sdk';
import request from 'request';
import sizeOf from 'image-size';
import { makeHtmlNotice, makeNotice } from 'matrix-js-sdk/lib/content-helpers.js';
import { Parser, HtmlRenderer } from 'commonmark';

/**
 * Represents a regular Hubot TextMessage with additional Matrix metadata.
 */

class MatrixMessage extends TextMessage {
  constructor(user, text, id, metadata) {
    super(user, text, id);
    this.metadata = void 0;
    this.metadata = metadata;
  }

}
class Matrix extends Adapter {
  constructor(robot) {
    super(robot);
    this.robot = void 0;
    this.client = void 0;
    this.user_id = void 0;
    this.access_token = void 0;
    this.device_id = void 0;
    this.commonMarkReader = new Parser();
    this.commonMarkRenderer = new HtmlRenderer({
      safe: true,
      softbreak: "<br />"
    });
    this.robot = robot;
    this.robot.logger.info("Constructor");
  }

  handleUnknownDevices(err) {
    return (() => {
      let result = [];

      for (var stranger in err.devices) {
        var devices = err.devices[stranger];
        result.push((() => {
          let result1 = [];

          for (let device in devices) {
            var _this$client;

            this.robot.logger.info(`Acknowledging ${stranger}'s device ${device}`);
            result1.push((_this$client = this.client) == null ? void 0 : _this$client.setDeviceKnown(stranger, device));
          }

          return result1;
        })());
      }

      return result;
    })();
  }

  send(envelope, ...strings) {
    return strings.map(str => this.sendThreaded(envelope, undefined, str));
  }

  async resolveRoom(room) {
    var _this$client2, _await$this$client$ge, _this$client3;

    const roomFromId = (_this$client2 = this.client) == null ? void 0 : _this$client2.getRoom(room);

    if (roomFromId !== null && roomFromId !== undefined) {
      return room;
    }

    const roomIdFromAlias = (_await$this$client$ge = await ((_this$client3 = this.client) == null ? void 0 : _this$client3.getRoomIdForAlias(room))) == null ? void 0 : _await$this$client$ge.room_id;

    if (roomIdFromAlias === undefined) {
      throw new Error(`Failed to resolve specified room: ${room}.`);
    }

    return roomIdFromAlias;
  }

  async sendThreaded(envelope, threadId, message) {
    var _envelope$message, _envelope$message$met, _this$client6;

    const resolvedRoom = await this.resolveRoom(envelope.room);
    const interpretMarkdown = "metadata" in ((_envelope$message = envelope.message) != null ? _envelope$message : {}) ? (_envelope$message$met = envelope.message.metadata.interpretMarkdown) != null ? _envelope$message$met : true : true;
    const finalMessage = interpretMarkdown ? makeHtmlNotice(message, this.commonMarkRenderer.render(this.commonMarkReader.parse(message))) : makeNotice(message);
    this.robot.logger.info(`Sending to ${envelope.room} (resolved to ${resolvedRoom}): ${message}`);

    if (/^(f|ht)tps?:\/\//i.test(message)) {
      return this.sendURL(envelope, message);
    }

    if (threadId !== undefined) {
      var _this$client4, _this$client4$sendMes;

      return (_this$client4 = this.client) == null ? void 0 : (_this$client4$sendMes = _this$client4.sendMessage(resolvedRoom, threadId, finalMessage)) == null ? void 0 : _this$client4$sendMes.catch(err => {
        if (err.name === "UnknownDeviceError") {
          var _this$client5;

          this.handleUnknownDevices(err);
          return (_this$client5 = this.client) == null ? void 0 : _this$client5.sendMessage(resolvedRoom, threadId, finalMessage);
        }
      });
    }

    return (_this$client6 = this.client) == null ? void 0 : _this$client6.sendMessage(resolvedRoom, finalMessage).catch(err => {
      if (err.name === "UnknownDeviceError") {
        var _this$client7;

        this.handleUnknownDevices(err);
        return (_this$client7 = this.client) == null ? void 0 : _this$client7.sendMessage(resolvedRoom, finalMessage);
      }
    });
  }

  async emote(envelope, ...strings) {
    const resolvedRoom = await this.resolveRoom(envelope.room);
    return Array.from(strings).map(str => {
      var _this$client8;

      return (_this$client8 = this.client) == null ? void 0 : _this$client8.sendEmoteMessage(resolvedRoom, str).catch(err => {
        if (err.name === "UnknownDeviceError") {
          var _this$client9;

          this.handleUnknownDevices(err);
          return (_this$client9 = this.client) == null ? void 0 : _this$client9.sendEmoteMessage(resolvedRoom, str);
        }
      });
    });
  }

  reply(envelope, ...strings) {
    const threadId = "metadata" in envelope.message ? envelope.message.metadata.threadId : undefined;
    return Array.from(strings).map(str => this.sendThreaded(envelope, threadId, `${envelope.user.name}: ${str}`));
  }

  topic(envelope, ...strings) {
    return Array.from(strings).map(str => {
      var _this$client10;

      return (_this$client10 = this.client) == null ? void 0 : _this$client10.sendStateEvent(envelope.room, "m.room.topic", {
        topic: str
      }, "");
    });
  }

  async sendURL(envelope, url) {
    const resolvedRoom = await this.resolveRoom(envelope.room);
    this.robot.logger.info(`Downloading ${url}`);
    return new Promise((resolve, reject) => {
      request({
        url,
        encoding: null
      }, (error, response, body) => {
        if (error) {
          this.robot.logger.info(`Request error: ${JSON.stringify(error)}`);
          reject(error);
        } else if (response.statusCode === 200) {
          let info;

          try {
            var _this$client11;

            let dims = sizeOf(body);
            this.robot.logger.info(`Image has dimensions ${JSON.stringify(dims)}, size ${body.length}`);

            if (dims.type === "jpg") {
              dims.type = "jpeg";
            }

            info = {
              mimetype: `image/${dims.type}`,
              h: dims.height,
              w: dims.width,
              size: body.length
            };
            resolve((_this$client11 = this.client) == null ? void 0 : _this$client11.uploadContent(body, {
              name: url,
              type: info.mimetype,
              rawResponse: false,
              onlyContentUri: true
            }).then(content_uri => {
              var _this$client12;

              return (_this$client12 = this.client) == null ? void 0 : _this$client12.sendImageMessage(resolvedRoom, content_uri, info, url).catch(err => {
                if (err.name === "UnknownDeviceError") {
                  var _this$client13;

                  this.handleUnknownDevices(err);
                  return (_this$client13 = this.client) == null ? void 0 : _this$client13.sendImageMessage(resolvedRoom, content_uri, info, url);
                }
              });
            }));
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
      request: request
    });
    return client.login("m.login.password", {
      user: process.env.HUBOT_MATRIX_USER || this.robot.name,
      password: process.env.HUBOT_MATRIX_PASSWORD
    }, (err, data) => {
      var _this$client14, _this$client18, _this$client21, _this$client23;

      if (err) {
        this.robot.logger.error(err);
        return;
      }

      this.user_id = data.user_id;
      this.access_token = data.access_token;
      this.device_id = data.device_id;
      this.robot.logger.info(`Logged in ${this.user_id} on device ${this.device_id}`);
      this.client = sdk.createClient({
        baseUrl: process.env.HUBOT_MATRIX_HOST_SERVER || "https://matrix.org",
        accessToken: this.access_token,
        userId: this.user_id,
        deviceId: this.device_id,
        request
      });
      (_this$client14 = this.client) == null ? void 0 : _this$client14.on(ClientEvent.Sync, state => {
        var _this$client15, _this$client16, _this$client16$getUse, _this$user_id;

        switch (state) {
          case "PREPARED":
            this.robot.logger.info(`Synced ${(_this$client15 = this.client) == null ? void 0 : _this$client15.getRooms().length} rooms`); // We really don't want to let people set the display name to something other than the bot
            // name because the bot only reacts to it's own name.

            const currentDisplayName = (_this$client16 = this.client) == null ? void 0 : (_this$client16$getUse = _this$client16.getUser((_this$user_id = this.user_id) != null ? _this$user_id : "")) == null ? void 0 : _this$client16$getUse.displayName;

            if (this.robot.name !== currentDisplayName) {
              var _this$client17;

              this.robot.logger.info(`Setting display name to ${this.robot.name}`);
              (_this$client17 = this.client) == null ? void 0 : _this$client17.setDisplayName(this.robot.name, () => {});
            }

            return this.emit("connected");
        }
      });
      (_this$client18 = this.client) == null ? void 0 : _this$client18.on(RoomEvent.Timeline, (event, room, toStartOfTimeline) => {
        if (event.getType() === "m.room.message" && toStartOfTimeline === false) {
          var _this$client19, _room$getCanonicalAli;

          (_this$client19 = this.client) == null ? void 0 : _this$client19.setPresence({
            presence: "online"
          });
          let id = event.getId();
          let message = event.getContent();
          let name = event.getSender();
          let user = this.robot.brain.userForId(name);
          user.room = (_room$getCanonicalAli = room.getCanonicalAlias()) != null ? _room$getCanonicalAli : room.roomId;

          if (name !== this.user_id) {
            this.robot.logger.info(`Received message: ${JSON.stringify(message)} in room: ${user.room}, from: ${user.name} (${user.id}).`);

            if (message.msgtype === "m.text") {
              var _event$threadRootId;

              const messageThreadId = (_event$threadRootId = event.threadRootId) != null ? _event$threadRootId : id;
              this.robot.receive(new MatrixMessage(user, message.body, id, {
                threadId: messageThreadId
              }));
            }

            if (message.msgtype !== "m.text" || message.body.indexOf(this.robot.name) !== -1) {
              var _this$client20;

              return (_this$client20 = this.client) == null ? void 0 : _this$client20.sendReadReceipt(event);
            }
          }
        }
      });
      (_this$client21 = this.client) == null ? void 0 : _this$client21.on(RoomMemberEvent.Membership, async (event, member) => {
        if (member.membership === "invite" && member.userId === this.user_id) {
          var _this$client22;

          await ((_this$client22 = this.client) == null ? void 0 : _this$client22.joinRoom(member.roomId));
          this.robot.logger.info(`Auto-joined ${member.roomId}`);
        }
      });
      return (_this$client23 = this.client) == null ? void 0 : _this$client23.startClient({
        initialSyncLimit: 0
      });
    });
  }

}
function use(robot) {
  return new Matrix(robot);
}

export { Matrix, MatrixMessage, use };
//# sourceMappingURL=matrix.esm.js.map
