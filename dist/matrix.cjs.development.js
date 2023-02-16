'use strict';

var hubot = require('hubot');
var sdk = require('matrix-js-sdk');
var request = require('request');
var sizeOf = require('image-size');
var contentHelpers = require('matrix-js-sdk/lib/content-helpers');
var commonmark = require('commonmark');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var sdk__default = /*#__PURE__*/_interopDefaultLegacy(sdk);
var request__default = /*#__PURE__*/_interopDefaultLegacy(request);
var sizeOf__default = /*#__PURE__*/_interopDefaultLegacy(sizeOf);

function _regeneratorRuntime() {
  /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */

  _regeneratorRuntime = function () {
    return exports;
  };

  var exports = {},
      Op = Object.prototype,
      hasOwn = Op.hasOwnProperty,
      $Symbol = "function" == typeof Symbol ? Symbol : {},
      iteratorSymbol = $Symbol.iterator || "@@iterator",
      asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator",
      toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    return Object.defineProperty(obj, key, {
      value: value,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }), obj[key];
  }

  try {
    define({}, "");
  } catch (err) {
    define = function (obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator,
        generator = Object.create(protoGenerator.prototype),
        context = new Context(tryLocsList || []);
    return generator._invoke = function (innerFn, self, context) {
      var state = "suspendedStart";
      return function (method, arg) {
        if ("executing" === state) throw new Error("Generator is already running");

        if ("completed" === state) {
          if ("throw" === method) throw arg;
          return doneResult();
        }

        for (context.method = method, context.arg = arg;;) {
          var delegate = context.delegate;

          if (delegate) {
            var delegateResult = maybeInvokeDelegate(delegate, context);

            if (delegateResult) {
              if (delegateResult === ContinueSentinel) continue;
              return delegateResult;
            }
          }

          if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) {
            if ("suspendedStart" === state) throw state = "completed", context.arg;
            context.dispatchException(context.arg);
          } else "return" === context.method && context.abrupt("return", context.arg);
          state = "executing";
          var record = tryCatch(innerFn, self, context);

          if ("normal" === record.type) {
            if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue;
            return {
              value: record.arg,
              done: context.done
            };
          }

          "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg);
        }
      };
    }(innerFn, self, context), generator;
  }

  function tryCatch(fn, obj, arg) {
    try {
      return {
        type: "normal",
        arg: fn.call(obj, arg)
      };
    } catch (err) {
      return {
        type: "throw",
        arg: err
      };
    }
  }

  exports.wrap = wrap;
  var ContinueSentinel = {};

  function Generator() {}

  function GeneratorFunction() {}

  function GeneratorFunctionPrototype() {}

  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });
  var getProto = Object.getPrototypeOf,
      NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype);
  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);

  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function (method) {
      define(prototype, method, function (arg) {
        return this._invoke(method, arg);
      });
    });
  }

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);

      if ("throw" !== record.type) {
        var result = record.arg,
            value = result.value;
        return value && "object" == typeof value && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) {
          invoke("next", value, resolve, reject);
        }, function (err) {
          invoke("throw", err, resolve, reject);
        }) : PromiseImpl.resolve(value).then(function (unwrapped) {
          result.value = unwrapped, resolve(result);
        }, function (error) {
          return invoke("throw", error, resolve, reject);
        });
      }

      reject(record.arg);
    }

    var previousPromise;

    this._invoke = function (method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function (resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
    };
  }

  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];

    if (undefined === method) {
      if (context.delegate = null, "throw" === context.method) {
        if (delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel;
        context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);
    if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel;
    var info = record.arg;
    return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel);
  }

  function pushTryEntry(locs) {
    var entry = {
      tryLoc: locs[0]
    };
    1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal", delete record.arg, entry.completion = record;
  }

  function Context(tryLocsList) {
    this.tryEntries = [{
      tryLoc: "root"
    }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0);
  }

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) return iteratorMethod.call(iterable);
      if ("function" == typeof iterable.next) return iterable;

      if (!isNaN(iterable.length)) {
        var i = -1,
            next = function next() {
          for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next;

          return next.value = undefined, next.done = !0, next;
        };

        return next.next = next;
      }
    }

    return {
      next: doneResult
    };
  }

  function doneResult() {
    return {
      value: undefined,
      done: !0
    };
  }

  return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) {
    var ctor = "function" == typeof genFun && genFun.constructor;
    return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name));
  }, exports.mark = function (genFun) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun;
  }, exports.awrap = function (arg) {
    return {
      __await: arg
    };
  }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    void 0 === PromiseImpl && (PromiseImpl = Promise);
    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
    return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) {
      return result.done ? result.value : iter.next();
    });
  }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () {
    return this;
  }), define(Gp, "toString", function () {
    return "[object Generator]";
  }), exports.keys = function (object) {
    var keys = [];

    for (var key in object) keys.push(key);

    return keys.reverse(), function next() {
      for (; keys.length;) {
        var key = keys.pop();
        if (key in object) return next.value = key, next.done = !1, next;
      }

      return next.done = !0, next;
    };
  }, exports.values = values, Context.prototype = {
    constructor: Context,
    reset: function (skipTempReset) {
      if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined);
    },
    stop: function () {
      this.done = !0;
      var rootRecord = this.tryEntries[0].completion;
      if ("throw" === rootRecord.type) throw rootRecord.arg;
      return this.rval;
    },
    dispatchException: function (exception) {
      if (this.done) throw exception;
      var context = this;

      function handle(loc, caught) {
        return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i],
            record = entry.completion;
        if ("root" === entry.tryLoc) return handle("end");

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc"),
              hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
          } else {
            if (!hasFinally) throw new Error("try statement without catch or finally");
            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
          }
        }
      }
    },
    abrupt: function (type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];

        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null);
      var record = finallyEntry ? finallyEntry.completion : {};
      return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record);
    },
    complete: function (record, afterLoc) {
      if ("throw" === record.type) throw record.arg;
      return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel;
    },
    finish: function (finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel;
      }
    },
    catch: function (tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];

        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;

          if ("throw" === record.type) {
            var thrown = record.arg;
            resetTryEntry(entry);
          }

          return thrown;
        }
      }

      throw new Error("illegal catch attempt");
    },
    delegateYield: function (iterable, resultName, nextLoc) {
      return this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      }, "next" === this.method && (this.arg = undefined), ContinueSentinel;
    }
  }, exports;
}

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;

  _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}

/**
 * Represents a regular Hubot TextMessage with additional Matrix metadata.
 */

var MatrixMessage = /*#__PURE__*/function (_TextMessage) {
  _inheritsLoose(MatrixMessage, _TextMessage);

  function MatrixMessage(user, text, id, metadata) {
    var _this;

    _this = _TextMessage.call(this, user, text, id) || this;
    _this.metadata = void 0;
    _this.metadata = metadata;
    return _this;
  }

  return MatrixMessage;
}(hubot.TextMessage);
var Matrix = /*#__PURE__*/function (_Adapter) {
  _inheritsLoose(Matrix, _Adapter);

  function Matrix(robot) {
    var _this2;

    _this2 = _Adapter.call(this, robot) || this;
    _this2.robot = void 0;
    _this2.client = void 0;
    _this2.user_id = void 0;
    _this2.access_token = void 0;
    _this2.device_id = void 0;
    _this2.commonMarkReader = new commonmark.Parser();
    _this2.commonMarkRenderer = new commonmark.HtmlRenderer({
      safe: true,
      softbreak: "<br />"
    });
    _this2.robot = robot;

    _this2.robot.logger.info("Constructor");

    return _this2;
  }

  var _proto = Matrix.prototype;

  _proto.handleUnknownDevices = function handleUnknownDevices(err) {
    var _this3 = this;

    return function () {
      var result = [];

      for (var stranger in err.devices) {
        var devices = err.devices[stranger];
        result.push(function () {
          var result1 = [];

          for (var device in devices) {
            var _this3$client;

            _this3.robot.logger.info("Acknowledging " + stranger + "'s device " + device);

            result1.push((_this3$client = _this3.client) == null ? void 0 : _this3$client.setDeviceKnown(stranger, device));
          }

          return result1;
        }());
      }

      return result;
    }();
  };

  _proto.send = function send(envelope) {
    var _this4 = this;

    for (var _len = arguments.length, strings = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      strings[_key - 1] = arguments[_key];
    }

    return strings.map(function (str) {
      return _this4.sendThreaded(envelope, undefined, str);
    });
  };

  _proto.resolveRoom = /*#__PURE__*/function () {
    var _resolveRoom = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(room) {
      var _this$client, _yield$this$client$ge, _this$client2;

      var roomFromId, roomIdFromAlias;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              roomFromId = (_this$client = this.client) == null ? void 0 : _this$client.getRoom(room);

              if (!(roomFromId !== null && roomFromId !== undefined)) {
                _context.next = 3;
                break;
              }

              return _context.abrupt("return", room);

            case 3:
              _context.next = 5;
              return (_this$client2 = this.client) == null ? void 0 : _this$client2.getRoomIdForAlias(room);

            case 5:
              _context.t0 = _yield$this$client$ge = _context.sent;

              if (!(_context.t0 == null)) {
                _context.next = 10;
                break;
              }

              _context.t1 = void 0;
              _context.next = 11;
              break;

            case 10:
              _context.t1 = _yield$this$client$ge.room_id;

            case 11:
              roomIdFromAlias = _context.t1;

              if (!(roomIdFromAlias === undefined)) {
                _context.next = 14;
                break;
              }

              throw new Error("Failed to resolve specified room: " + room + ".");

            case 14:
              return _context.abrupt("return", roomIdFromAlias);

            case 15:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function resolveRoom(_x) {
      return _resolveRoom.apply(this, arguments);
    }

    return resolveRoom;
  }();

  _proto.sendThreaded = /*#__PURE__*/function () {
    var _sendThreaded = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(envelope, threadId, message) {
      var _envelope$message,
          _envelope$message$met,
          _this5 = this,
          _this$client4;

      var resolvedRoom, interpretMarkdown, finalMessage, _this$client3, _this$client3$sendMes;

      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return this.resolveRoom(envelope.room);

            case 2:
              resolvedRoom = _context2.sent;
              interpretMarkdown = "metadata" in ((_envelope$message = envelope.message) != null ? _envelope$message : {}) ? (_envelope$message$met = envelope.message.metadata.interpretMarkdown) != null ? _envelope$message$met : true : true;
              finalMessage = interpretMarkdown ? contentHelpers.makeHtmlNotice(message, this.commonMarkRenderer.render(this.commonMarkReader.parse(message))) : contentHelpers.makeNotice(message);
              this.robot.logger.info("Sending to " + envelope.room + " (resolved to " + resolvedRoom + "): " + message);

              if (!/^(f|ht)tps?:\/\//i.test(message)) {
                _context2.next = 8;
                break;
              }

              return _context2.abrupt("return", this.sendURL(envelope, message));

            case 8:
              if (!(threadId !== undefined)) {
                _context2.next = 10;
                break;
              }

              return _context2.abrupt("return", (_this$client3 = this.client) == null ? void 0 : (_this$client3$sendMes = _this$client3.sendMessage(resolvedRoom, threadId, finalMessage)) == null ? void 0 : _this$client3$sendMes["catch"](function (err) {
                if (err.name === "UnknownDeviceError") {
                  var _this5$client;

                  _this5.handleUnknownDevices(err);

                  return (_this5$client = _this5.client) == null ? void 0 : _this5$client.sendMessage(resolvedRoom, threadId, finalMessage);
                }
              }));

            case 10:
              return _context2.abrupt("return", (_this$client4 = this.client) == null ? void 0 : _this$client4.sendMessage(resolvedRoom, finalMessage)["catch"](function (err) {
                if (err.name === "UnknownDeviceError") {
                  var _this5$client2;

                  _this5.handleUnknownDevices(err);

                  return (_this5$client2 = _this5.client) == null ? void 0 : _this5$client2.sendMessage(resolvedRoom, finalMessage);
                }
              }));

            case 11:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function sendThreaded(_x2, _x3, _x4) {
      return _sendThreaded.apply(this, arguments);
    }

    return sendThreaded;
  }();

  _proto.emote = /*#__PURE__*/function () {
    var _emote = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(envelope) {
      var _this6 = this;

      var resolvedRoom,
          _len2,
          strings,
          _key2,
          _args3 = arguments;

      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return this.resolveRoom(envelope.room);

            case 2:
              resolvedRoom = _context3.sent;

              for (_len2 = _args3.length, strings = /*#__PURE__*/new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                strings[_key2 - 1] = _args3[_key2];
              }

              return _context3.abrupt("return", Array.from(strings).map(function (str) {
                var _this6$client;

                return (_this6$client = _this6.client) == null ? void 0 : _this6$client.sendEmoteMessage(resolvedRoom, str)["catch"](function (err) {
                  if (err.name === "UnknownDeviceError") {
                    var _this6$client2;

                    _this6.handleUnknownDevices(err);

                    return (_this6$client2 = _this6.client) == null ? void 0 : _this6$client2.sendEmoteMessage(resolvedRoom, str);
                  }
                });
              }));

            case 5:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    function emote(_x5) {
      return _emote.apply(this, arguments);
    }

    return emote;
  }();

  _proto.reply = function reply(envelope) {
    var _this7 = this;

    var threadId = "metadata" in envelope.message ? envelope.message.metadata.threadId : undefined;

    for (var _len3 = arguments.length, strings = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      strings[_key3 - 1] = arguments[_key3];
    }

    return Array.from(strings).map(function (str) {
      return _this7.sendThreaded(envelope, threadId, envelope.user.name + ": " + str);
    });
  };

  _proto.topic = function topic(envelope) {
    var _this8 = this;

    for (var _len4 = arguments.length, strings = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
      strings[_key4 - 1] = arguments[_key4];
    }

    return Array.from(strings).map(function (str) {
      var _this8$client;

      return (_this8$client = _this8.client) == null ? void 0 : _this8$client.sendStateEvent(envelope.room, "m.room.topic", {
        topic: str
      }, "");
    });
  };

  _proto.sendURL = /*#__PURE__*/function () {
    var _sendURL = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(envelope, url) {
      var _this9 = this;

      var resolvedRoom;
      return _regeneratorRuntime().wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return this.resolveRoom(envelope.room);

            case 2:
              resolvedRoom = _context4.sent;
              this.robot.logger.info("Downloading " + url);
              return _context4.abrupt("return", new Promise(function (resolve, reject) {
                request__default["default"]({
                  url: url,
                  encoding: null
                }, function (error, response, body) {
                  if (error) {
                    _this9.robot.logger.info("Request error: " + JSON.stringify(error));

                    reject(error);
                  } else if (response.statusCode === 200) {
                    var info;

                    try {
                      var _this9$client;

                      var dims = sizeOf__default["default"](body);

                      _this9.robot.logger.info("Image has dimensions " + JSON.stringify(dims) + ", size " + body.length);

                      if (dims.type === "jpg") {
                        dims.type = "jpeg";
                      }

                      info = {
                        mimetype: "image/" + dims.type,
                        h: dims.height,
                        w: dims.width,
                        size: body.length
                      };
                      resolve((_this9$client = _this9.client) == null ? void 0 : _this9$client.uploadContent(body, {
                        name: url,
                        type: info.mimetype,
                        rawResponse: false,
                        onlyContentUri: true
                      }).then(function (content_uri) {
                        var _this9$client2;

                        return (_this9$client2 = _this9.client) == null ? void 0 : _this9$client2.sendImageMessage(resolvedRoom, content_uri, info, url)["catch"](function (err) {
                          if (err.name === "UnknownDeviceError") {
                            var _this9$client3;

                            _this9.handleUnknownDevices(err);

                            return (_this9$client3 = _this9.client) == null ? void 0 : _this9$client3.sendImageMessage(resolvedRoom, content_uri, info, url);
                          }
                        });
                      }));
                    } catch (error1) {
                      error = error1;

                      _this9.robot.logger.info(error.message);

                      resolve(_this9.sendThreaded(envelope, undefined, " " + url));
                    }
                  }
                });
              }));

            case 5:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));

    function sendURL(_x6, _x7) {
      return _sendURL.apply(this, arguments);
    }

    return sendURL;
  }();

  _proto.run = function run() {
    var _this10 = this;

    this.robot.logger.info("Run " + this.robot.name);

    if (process.env.HUBOT_MATRIX_ACCESS_TOKEN) {
      this.robot.logger.info("Login by access token");
      this.user_id = process.env.HUBOT_MATRIX_USER;
      this.access_token = process.env.HUBOT_MATRIX_ACCESS_TOKEN;
      this.access();
    } else {
      this.robot.logger.info("Login by password");
      var client = sdk__default["default"].createClient({
        baseUrl: process.env.HUBOT_MATRIX_HOST_SERVER || "https://matrix.org",
        request: request__default["default"]
      });
      return client.login("m.login.password", {
        user: process.env.HUBOT_MATRIX_USER || this.robot.name,
        password: process.env.HUBOT_MATRIX_PASSWORD
      }, function (err, data) {
        if (err) {
          _this10.robot.logger.error(err);

          return;
        }

        _this10.user_id = data.user_id;
        _this10.access_token = data.access_token;
        _this10.device_id = data.device_id;

        _this10.access();
      });
    }
  };

  _proto.access = function access() {
    var _this$client5,
        _this11 = this,
        _this$client6,
        _this$client7,
        _this$client8;

    this.robot.logger.info("Logged in " + this.user_id + " on device " + this.device_id);
    this.client = sdk__default["default"].createClient({
      baseUrl: process.env.HUBOT_MATRIX_HOST_SERVER || "https://matrix.org",
      accessToken: this.access_token,
      userId: this.user_id,
      deviceId: this.device_id,
      request: request__default["default"]
    });
    (_this$client5 = this.client) == null ? void 0 : _this$client5.on(sdk.ClientEvent.Sync, function (state) {
      var _this11$client, _this11$client2, _this11$client2$getUs, _this11$user_id;

      switch (state) {
        case "PREPARED":
          _this11.robot.logger.info("Synced " + ((_this11$client = _this11.client) == null ? void 0 : _this11$client.getRooms().length) + " rooms"); // We really don't want to let people set the display name to something other than the bot
          // name because the bot only reacts to it's own name.


          var currentDisplayName = (_this11$client2 = _this11.client) == null ? void 0 : (_this11$client2$getUs = _this11$client2.getUser((_this11$user_id = _this11.user_id) != null ? _this11$user_id : "")) == null ? void 0 : _this11$client2$getUs.displayName;

          if (_this11.robot.name !== currentDisplayName) {
            var _this11$client3;

            _this11.robot.logger.info("Setting display name to " + _this11.robot.name);

            (_this11$client3 = _this11.client) == null ? void 0 : _this11$client3.setDisplayName(_this11.robot.name, function () {});
          }

          return _this11.emit("connected");
      }
    });
    (_this$client6 = this.client) == null ? void 0 : _this$client6.on(sdk.RoomEvent.Timeline, function (event, room, toStartOfTimeline) {
      if (event.getType() === "m.room.message" && toStartOfTimeline === false) {
        var _this11$client4, _room$getCanonicalAli;

        (_this11$client4 = _this11.client) == null ? void 0 : _this11$client4.setPresence({
          presence: "online"
        });
        var id = event.getId();
        var message = event.getContent();
        var name = event.getSender();

        var user = _this11.robot.brain.userForId(name);

        user.room = (_room$getCanonicalAli = room.getCanonicalAlias()) != null ? _room$getCanonicalAli : room.roomId;

        if (name !== _this11.user_id) {
          _this11.robot.logger.info("Received message: " + JSON.stringify(message) + " in room: " + user.room + ", from: " + user.name + " (" + user.id + ").");

          if (message.msgtype === "m.text") {
            var _event$threadRootId;

            var messageThreadId = (_event$threadRootId = event.threadRootId) != null ? _event$threadRootId : id;

            _this11.receive(new MatrixMessage(user, message.body, id, {
              threadId: messageThreadId
            }));
          }

          if (message.msgtype !== "m.text" || message.body.indexOf(_this11.robot.name) !== -1) {
            var _this11$client5;

            return (_this11$client5 = _this11.client) == null ? void 0 : _this11$client5.sendReadReceipt(event);
          }
        }
      }
    });
    (_this$client7 = this.client) == null ? void 0 : _this$client7.on(sdk.RoomMemberEvent.Membership, /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(event, member) {
        var _this11$client6;

        return _regeneratorRuntime().wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (!(member.membership === "invite" && member.userId === _this11.user_id)) {
                  _context5.next = 4;
                  break;
                }

                _context5.next = 3;
                return (_this11$client6 = _this11.client) == null ? void 0 : _this11$client6.joinRoom(member.roomId);

              case 3:
                _this11.robot.logger.info("Auto-joined " + member.roomId);

              case 4:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }));

      return function (_x8, _x9) {
        return _ref.apply(this, arguments);
      };
    }());
    return (_this$client8 = this.client) == null ? void 0 : _this$client8.startClient({
      initialSyncLimit: 0
    });
  };

  return Matrix;
}(hubot.Adapter);
function use(robot) {
  return new Matrix(robot);
}

exports.Matrix = Matrix;
exports.MatrixMessage = MatrixMessage;
exports.use = use;
//# sourceMappingURL=matrix.cjs.development.js.map
