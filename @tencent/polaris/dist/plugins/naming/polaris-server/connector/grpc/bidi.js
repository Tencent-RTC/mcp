"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamCaller = exports.PacketDirection = void 0;
const events_1 = require("events");
const __1 = require("../../../../..");
const utils_1 = require("../../../../../utils");
var PacketDirection;
(function (PacketDirection) {
    PacketDirection[PacketDirection["Request"] = 0] = "Request";
    PacketDirection[PacketDirection["Response"] = 1] = "Response";
})(PacketDirection = exports.PacketDirection || (exports.PacketDirection = {}));
class Deferred {
    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
        Object.freeze(this);
    }
}
class StreamCaller extends events_1.EventEmitter {
    constructor(streamCreator, keyGenerator, timeout) {
        super();
        this.streamCreator = streamCreator;
        this.keyGenerator = keyGenerator;
        this.timeout = timeout;
        this.callStream = null;
        this.activeRequests = Object.create(null);
    }
    init() {
        if (this.callStream === null) {
            this.callStream = this.streamCreator();
            this.callStream.on("data", this.handleResponse.bind(this));
            this.callStream.on("end", this.close.bind(this));
            this.callStream.on("error", this.close.bind(this));
        }
    }
    async request(request) {
        const priKey = this.keyGenerator(PacketDirection.Request, request);
        let call = this.activeRequests[priKey];
        if (!call) {
            const deferred = new Deferred();
            call = {
                deferred,
                timer: setTimeout(() => {
                    deferred.reject(new __1.TimeoutError("Exceed deadline"));
                    delete this.activeRequests[priKey];
                }, this.timeout).unref()
            };
            this.activeRequests[priKey] = call;
            this.init();
            this.callStream.write(request);
        }
        return call.deferred.promise;
    }
    close(e) {
        const requests = Object.values(this.activeRequests);
        if (requests.length > 0) {
            requests.forEach(({ timer, deferred: { reject } }) => {
                clearTimeout(timer);
                if (e) {
                    reject(new __1.NetworkError(e));
                }
                else {
                    reject(new __1.NetworkError("Stream end"));
                }
            });
            this.activeRequests = Object.create(null);
        }
        const { callStream } = this;
        if (callStream !== null) {
            this.callStream = null;
            callStream.cancel();
            callStream.end();
            callStream.removeAllListeners();
            callStream.on("error", () => { }); /** no longer receive error event on this stream */
        }
    }
    handleResponse(response) {
        const priKey = this.keyGenerator(PacketDirection.Response, response);
        if (priKey === "") {
            (0, utils_1.UNREACHABLE)();
            return;
        }
        const keys = Object.keys(this.activeRequests);
        for (let i = 0; i < keys.length; i += 1) { // eslint-disable-line @typescript-eslint/prefer-for-of
            if (keys[i] === priKey) {
                const { deferred, timer } = this.activeRequests[priKey];
                delete this.activeRequests[priKey];
                clearTimeout(timer);
                deferred.resolve(response);
                return;
            }
        }
        this.emit("PushReceived" /* PushReceived */, response);
    }
}
exports.StreamCaller = StreamCaller;
//# sourceMappingURL=bidi.js.map