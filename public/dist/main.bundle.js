/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _amber = __webpack_require__(1);

var _amber2 = _interopRequireDefault(_amber);

var _marked = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"marked\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

var _marked2 = _interopRequireDefault(_marked);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (document.getElementsByTagName('textarea')) {
  try {
    var editor = new Editor();
    editor.render();
  } catch (error) {
    console.error(error);
  }
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EVENTS = {
  join: 'join',
  leave: 'leave',
  message: 'message'
};
var STALE_CONNECTION_THRESHOLD_SECONDS = 100;
var SOCKET_POLLING_RATE = 10000;

/**
 * Returns a numeric value for the current time
 */
var now = function now() {
  return new Date().getTime();
};

/**
 * Returns the difference between the current time and passed `time` in seconds
 * @param {Number|Date} time - A numeric time or date object
 */
var secondsSince = function secondsSince(time) {
  return (now() - time) / 1000;
};

/**
 * Class for channel related functions (joining, leaving, subscribing and sending messages)
 */

var Channel = exports.Channel = function () {
  /**
   * @param {String} topic - topic to subscribe to
   * @param {Socket} socket - A Socket instance
   */
  function Channel(topic, socket) {
    _classCallCheck(this, Channel);

    this.topic = topic;
    this.socket = socket;
    this.onMessageHandlers = [];
  }

  /**
   * Join a channel, subscribe to all channels messages
   */


  _createClass(Channel, [{
    key: 'join',
    value: function join() {
      this.socket.ws.send(JSON.stringify({ event: EVENTS.join, topic: this.topic }));
    }

    /**
     * Leave a channel, stop subscribing to channel messages
     */

  }, {
    key: 'leave',
    value: function leave() {
      this.socket.ws.send(JSON.stringify({ event: EVENTS.leave, topic: this.topic }));
    }

    /**
     * Calls all message handlers with a matching subject
     */

  }, {
    key: 'handleMessage',
    value: function handleMessage(msg) {
      this.onMessageHandlers.forEach(function (handler) {
        if (handler.subject === msg.subject) handler.callback(msg.payload);
      });
    }

    /**
     * Subscribe to a channel subject
     * @param {String} subject - subject to listen for: `msg:new`
     * @param {function} callback - callback function when a new message arrives
     */

  }, {
    key: 'on',
    value: function on(subject, callback) {
      this.onMessageHandlers.push({ subject: subject, callback: callback });
    }

    /**
     * Send a new message to the channel
     * @param {String} subject - subject to send message to: `msg:new`
     * @param {Object} payload - payload object: `{message: 'hello'}`
     */

  }, {
    key: 'push',
    value: function push(subject, payload) {
      this.socket.ws.send(JSON.stringify({ event: EVENTS.message, topic: this.topic, subject: subject, payload: payload }));
    }
  }]);

  return Channel;
}();

/**
 * Class for maintaining connection with server and maintaining channels list
 */


var Socket = exports.Socket = function () {
  /**
   * @param {String} endpoint - Websocket endpont used in routes.cr file
   */
  function Socket(endpoint) {
    _classCallCheck(this, Socket);

    this.endpoint = endpoint;
    this.ws = null;
    this.channels = [];
    this.lastPing = now();
    this.reconnectTries = 0;
    this.attemptReconnect = true;
  }

  /**
   * Returns whether or not the last received ping has been past the threshold
   */


  _createClass(Socket, [{
    key: '_connectionIsStale',
    value: function _connectionIsStale() {
      return secondsSince(this.lastPing) > STALE_CONNECTION_THRESHOLD_SECONDS;
    }

    /**
     * Tries to reconnect to the websocket server using a recursive timeout
     */

  }, {
    key: '_reconnect',
    value: function _reconnect() {
      var _this = this;

      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = setTimeout(function () {
        _this.reconnectTries++;
        _this.connect(_this.params);
        _this._reconnect();
      }, this._reconnectInterval());
    }

    /**
     * Returns an incrementing timeout interval based around the number of reconnection retries
     */

  }, {
    key: '_reconnectInterval',
    value: function _reconnectInterval() {
      return [1000, 2000, 5000, 10000][this.reconnectTries] || 10000;
    }

    /**
     * Sets a recursive timeout to check if the connection is stale
     */

  }, {
    key: '_poll',
    value: function _poll() {
      var _this2 = this;

      this.pollingTimeout = setTimeout(function () {
        if (_this2._connectionIsStale()) {
          _this2._reconnect();
        } else {
          _this2._poll();
        }
      }, SOCKET_POLLING_RATE);
    }

    /**
     * Clear polling timeout and start polling
     */

  }, {
    key: '_startPolling',
    value: function _startPolling() {
      clearTimeout(this.pollingTimeout);
      this._poll();
    }

    /**
     * Sets `lastPing` to the curent time
     */

  }, {
    key: '_handlePing',
    value: function _handlePing() {
      this.lastPing = now();
    }

    /**
     * Clears reconnect timeout, resets variables an starts polling
     */

  }, {
    key: '_reset',
    value: function _reset() {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTries = 0;
      this.attemptReconnect = true;
      this._startPolling();
    }

    /**
     * Connect the socket to the server, and binds to native ws functions
     * @param {Object} params - Optional parameters
     * @param {String} params.location - Hostname to connect to, defaults to `window.location.hostname`
     * @param {String} parmas.port - Port to connect to, defaults to `window.location.port`
     * @param {String} params.protocol - Protocol to use, either 'wss' or 'ws'
     */

  }, {
    key: 'connect',
    value: function connect(params) {
      var _this3 = this;

      this.params = params;

      var opts = {
        location: window.location.hostname,
        port: window.location.port,
        protocol: window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      };

      if (params) Object.assign(opts, params);
      if (opts.port) opts.location += ':' + opts.port;

      return new Promise(function (resolve, reject) {
        _this3.ws = new WebSocket(opts.protocol + '//' + opts.location + _this3.endpoint);
        _this3.ws.onmessage = function (msg) {
          _this3.handleMessage(msg);
        };
        _this3.ws.onclose = function () {
          if (_this3.attemptReconnect) _this3._reconnect();
        };
        _this3.ws.onopen = function () {
          _this3._reset();
          resolve();
        };
      });
    }

    /**
     * Closes the socket connection permanently
     */

  }, {
    key: 'disconnect',
    value: function disconnect() {
      this.attemptReconnect = false;
      clearTimeout(this.pollingTimeout);
      clearTimeout(this.reconnectTimeout);
      this.ws.close();
    }

    /**
     * Adds a new channel to the socket channels list
     * @param {String} topic - Topic for the channel: `chat_room:123`
     */

  }, {
    key: 'channel',
    value: function channel(topic) {
      var channel = new Channel(topic, this);
      this.channels.push(channel);
      return channel;
    }

    /**
     * Message handler for messages received
     * @param {MessageEvent} msg - Message received from ws
     */

  }, {
    key: 'handleMessage',
    value: function handleMessage(msg) {
      if (msg.data === "ping") return this._handlePing();

      var parsed_msg = JSON.parse(msg.data);
      this.channels.forEach(function (channel) {
        if (channel.topic === parsed_msg.topic) channel.handleMessage(parsed_msg);
      });
    }
  }]);

  return Socket;
}();

module.exports = {
  Socket: Socket
};

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgN2E5ZGJjMTM5OTkzZjQ0NDJiYzkiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Fzc2V0cy9qYXZhc2NyaXB0cy9tYWluLmpzIiwid2VicGFjazovLy8uL2xpYi9hbWJlci9hc3NldHMvanMvYW1iZXIuanMiXSwibmFtZXMiOlsiZG9jdW1lbnQiLCJnZXRFbGVtZW50c0J5VGFnTmFtZSIsImVkaXRvciIsIkVkaXRvciIsInJlbmRlciIsImVycm9yIiwiY29uc29sZSIsIkVWRU5UUyIsImpvaW4iLCJsZWF2ZSIsIm1lc3NhZ2UiLCJTVEFMRV9DT05ORUNUSU9OX1RIUkVTSE9MRF9TRUNPTkRTIiwiU09DS0VUX1BPTExJTkdfUkFURSIsIm5vdyIsIkRhdGUiLCJnZXRUaW1lIiwic2Vjb25kc1NpbmNlIiwidGltZSIsIkNoYW5uZWwiLCJ0b3BpYyIsInNvY2tldCIsIm9uTWVzc2FnZUhhbmRsZXJzIiwid3MiLCJzZW5kIiwiSlNPTiIsInN0cmluZ2lmeSIsImV2ZW50IiwibXNnIiwiZm9yRWFjaCIsImhhbmRsZXIiLCJzdWJqZWN0IiwiY2FsbGJhY2siLCJwYXlsb2FkIiwicHVzaCIsIlNvY2tldCIsImVuZHBvaW50IiwiY2hhbm5lbHMiLCJsYXN0UGluZyIsInJlY29ubmVjdFRyaWVzIiwiYXR0ZW1wdFJlY29ubmVjdCIsImNsZWFyVGltZW91dCIsInJlY29ubmVjdFRpbWVvdXQiLCJzZXRUaW1lb3V0IiwiY29ubmVjdCIsInBhcmFtcyIsIl9yZWNvbm5lY3QiLCJfcmVjb25uZWN0SW50ZXJ2YWwiLCJwb2xsaW5nVGltZW91dCIsIl9jb25uZWN0aW9uSXNTdGFsZSIsIl9wb2xsIiwiX3N0YXJ0UG9sbGluZyIsIm9wdHMiLCJsb2NhdGlvbiIsIndpbmRvdyIsImhvc3RuYW1lIiwicG9ydCIsInByb3RvY29sIiwiT2JqZWN0IiwiYXNzaWduIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJXZWJTb2NrZXQiLCJvbm1lc3NhZ2UiLCJoYW5kbGVNZXNzYWdlIiwib25jbG9zZSIsIm9ub3BlbiIsIl9yZXNldCIsImNsb3NlIiwiY2hhbm5lbCIsImRhdGEiLCJfaGFuZGxlUGluZyIsInBhcnNlZF9tc2ciLCJwYXJzZSIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7OztBQzdEQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFJQSxTQUFTQyxvQkFBVCxDQUE4QixVQUE5QixDQUFKLEVBQStDO0FBQzdDLE1BQUk7QUFDRixRQUFJQyxTQUFTLElBQUlDLE1BQUosRUFBYjtBQUNBRCxXQUFPRSxNQUFQO0FBQ0QsR0FIRCxDQUdFLE9BQU9DLEtBQVAsRUFBYztBQUNkQyxZQUFRRCxLQUFSLENBQWNBLEtBQWQ7QUFDRDtBQUNGLEM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDVkQsSUFBTUUsU0FBUztBQUNiQyxRQUFNLE1BRE87QUFFYkMsU0FBTyxPQUZNO0FBR2JDLFdBQVM7QUFISSxDQUFmO0FBS0EsSUFBTUMscUNBQXFDLEdBQTNDO0FBQ0EsSUFBTUMsc0JBQXNCLEtBQTVCOztBQUVBOzs7QUFHQSxJQUFJQyxNQUFNLFNBQU5BLEdBQU0sR0FBTTtBQUNkLFNBQU8sSUFBSUMsSUFBSixHQUFXQyxPQUFYLEVBQVA7QUFDRCxDQUZEOztBQUlBOzs7O0FBSUEsSUFB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QUksT0FBSzFCLGdCQUFULEVBQTJCLE9BQUtNLFVBQUw7QUFDNUIsU0FGRDtBQUdBLGVBQUt2QixFQUFMLENBQVE0QyxNQUFSLEdBQWlCLFlBQU07QUFDckIsaUJBQUtDLE1BQUw7QUFDQVA7QUFDRCxTQUhEO0FBSUQsT0FWTSxDQUFQO0FBV0Q7O0FBRUQ7Ozs7OztpQ0FHYTtBQUNYLFdBQUtyQixnQkFBTCxHQUF3QixLQUF4QjtBQUNBQyxtQkFBYSxLQUFLTyxjQUFsQjtBQUNBUCxtQkFBYSxLQUFLQyxnQkFBbEI7QUFDQSxXQUFLbkIsRUFBTCxDQUFROEMsS0FBUjtBQUNEOztBQUVEOzs7Ozs7OzRCQUlRakQsSyxFQUFPO0FBQ2IsVUFBSWtELFVBQVUsSUFBSW5ELE9BQUosQ0FBWUMsS0FBWixFQUFtQixJQUFuQixDQUFkO0FBQ0EsV0FBS2lCLFFBQUwsQ0FBY0gsSUFBZCxDQUFtQm9DLE9BQW5CO0FBQ0EsYUFBT0EsT0FBUDtBQUNEOztBQUVEOzs7Ozs7O2tDQUljMUMsRyxFQUFLO0FBQ2pCLFVBQUlBLElBQUkyQyxJQUFKLEtBQWEsTUFBakIsRUFBeUIsT0FBTyxLQUFLQyxXQUFMLEVBQVA7O0FBRXpCLFVBQUlDLGFBQWFoRCxLQUFLaUQsS0FBTCxDQUFXOUMsSUFBSTJDLElBQWYsQ0FBakI7QUFDQSxXQUFLbEMsUUFBTCxDQUFjUixPQUFkLENBQXNCLFVBQUN5QyxPQUFELEVBQWE7QUFDakMsWUFBSUEsUUFBUWxELEtBQVIsS0FBa0JxRCxXQUFXckQsS0FBakMsRUFBd0NrRCxRQUFRTCxhQUFSLENBQXNCUSxVQUF0QjtBQUN6QyxPQUZEO0FBR0Q7Ozs7OztBQUdIRSxPQUFPQyxPQUFQLEdBQWlCO0FBQ2Z6QyxVQUFRQTtBQURPLENBQWpCLEMiLCJmaWxlIjoibWFpbi5idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCIvZGlzdFwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDdhOWRiYzEzOTk5M2Y0NDQyYmM5IiwiaW1wb3J0IEFtYmVyIGZyb20gJ2FtYmVyJ1xuaW1wb3J0IG1hcmtlZCBmcm9tICdtYXJrZWQnXG5cbmlmIChkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgndGV4dGFyZWEnKSkge1xuICB0cnkge1xuICAgIHZhciBlZGl0b3IgPSBuZXcgRWRpdG9yKCk7XG4gICAgZWRpdG9yLnJlbmRlcigpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpXG4gIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9hc3NldHMvamF2YXNjcmlwdHMvbWFpbi5qcyIsImNvbnN0IEVWRU5UUyA9IHtcbiAgam9pbjogJ2pvaW4nLFxuICBsZWF2ZTogJ2xlYXZlJyxcbiAgbWVzc2FnZTogJ21lc3NhZ2UnXG59XG5jb25zdCBTVEFMRV9DT05ORUNUSU9OX1RIUkVTSE9MRF9TRUNPTkRTID0gMTAwXG5jb25zdCBTT0NLRVRfUE9MTElOR19SQVRFID0gMTAwMDBcblxuLyoqXG4gKiBSZXR1cm5zIGEgbnVtZXJpYyB2YWx1ZSBmb3IgdGhlIGN1cnJlbnQgdGltZVxuICovXG5sZXQgbm93ID0gKCkgPT4ge1xuICByZXR1cm4gbmV3IERhdGUoKS5nZXRUaW1lKClcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBkaWZmZXJlbmNlIGJldHdlZW4gdGhlIGN1cnJlbnQgdGltZSBhbmQgcGFzc2VkIGB0aW1lYCBpbiBzZWNvbmRzXG4gKiBAcGFyYW0ge051bWJlcnxEYXRlfSB0aW1lIC0gQSBudW1lcmljIHRpbWUgb3IgZGF0ZSBvYmplY3RcbiAqL1xubGV0IHNlY29uZHNTaW5jZSA9ICh0aW1lKSA9PiB7XG4gIHJldHVybiAobm93KCkgLSB0aW1lKSAvIDEwMDBcbn1cblxuLyoqXG4gKiBDbGFzcyBmb3IgY2hhbm5lbCByZWxhdGVkIGZ1bmN0aW9ucyAoam9pbmluZywgbGVhdmluZywgc3Vic2NyaWJpbmcgYW5kIHNlbmRpbmcgbWVzc2FnZXMpXG4gKi9cbmV4cG9ydCBjbGFzcyBDaGFubmVsIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB0b3BpYyAtIHRvcGljIHRvIHN1YnNjcmliZSB0b1xuICAgKiBAcGFyYW0ge1NvY2tldH0gc29ja2V0IC0gQSBTb2NrZXQgaW5zdGFuY2VcbiAgICovXG4gIGNvbnN0cnVjdG9yKHRvcGljLCBzb2NrZXQpIHtcbiAgICB0aGlzLnRvcGljID0gdG9waWNcbiAgICB0aGlzLnNvY2tldCA9IHNvY2tldFxuICAgIHRoaXMub25NZXNzYWdlSGFuZGxlcnMgPSBbXVxuICB9XG5cbiAgLyoqXG4gICAqIEpvaW4gYSBjaGFubmVsLCBzdWJzY3JpYmUgdG8gYWxsIGNoYW5uZWxzIG1lc3NhZ2VzXG4gICAqL1xuICBqb2luKCkge1xuICAgIHRoaXMuc29ja2V0LndzLnNlbmQoSlNPTi5zdHJpbmdpZnkoeyBldmVudDogRVZFTlRTLmpvaW4sIHRvcGljOiB0aGlzLnRvcGljIH0pKVxuICB9XG5cbiAgLyoqXG4gICAqIExlYXZlIGEgY2hhbm5lbCwgc3RvcCBzdWJzY3JpYmluZyB0byBjaGFubmVsIG1lc3NhZ2VzXG4gICAqL1xuICBsZWF2ZSgpIHtcbiAgICB0aGlzLnNvY2tldC53cy5zZW5kKEpTT04uc3RyaW5naWZ5KHsgZXZlbnQ6IEVWRU5UUy5sZWF2ZSwgdG9waWM6IHRoaXMudG9waWMgfSkpXG4gIH1cblxuICAvKipcbiAgICogQ2FsbHMgYWxsIG1lc3NhZ2UgaGFuZGxlcnMgd2l0aCBhIG1hdGNoaW5nIHN1YmplY3RcbiAgICovXG4gIGhhbmRsZU1lc3NhZ2UobXNnKSB7XG4gICAgdGhpcy5vbk1lc3NhZ2VIYW5kbGVycy5mb3JFYWNoKChoYW5kbGVyKSA9PiB7XG4gICAgICBpZiAoaGFuZGxlci5zdWJqZWN0ID09PSBtc2cuc3ViamVjdCkgaGFuZGxlci5jYWxsYmFjayhtc2cucGF5bG9hZClcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIFN1YnNjcmliZSB0byBhIGNoYW5uZWwgc3ViamVjdFxuICAgKiBAcGFyYW0ge1N0cmluZ30gc3ViamVjdCAtIHN1YmplY3QgdG8gbGlzdGVuIGZvcjogYG1zZzpuZXdgXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIC0gY2FsbGJhY2sgZnVuY3Rpb24gd2hlbiBhIG5ldyBtZXNzYWdlIGFycml2ZXNcbiAgICovXG4gIG9uKHN1YmplY3QsIGNhbGxiYWNrKSB7XG4gICAgdGhpcy5vbk1lc3NhZ2VIYW5kbGVycy5wdXNoKHsgc3ViamVjdDogc3ViamVjdCwgY2FsbGJhY2s6IGNhbGxiYWNrIH0pXG4gIH1cblxuICAvKipcbiAgICogU2VuZCBhIG5ldyBtZXNzYWdlIHRvIHRoZSBjaGFubmVsXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzdWJqZWN0IC0gc3ViamVjdCB0byBzZW5kIG1lc3NhZ2UgdG86IGBtc2c6bmV3YFxuICAgKiBAcGFyYW0ge09iamVjdH0gcGF5bG9hZCAtIHBheWxvYWQgb2JqZWN0OiBge21lc3NhZ2U6ICdoZWxsbyd9YFxuICAgKi9cbiAgcHVzaChzdWJqZWN0LCBwYXlsb2FkKSB7XG4gICAgdGhpcy5zb2NrZXQud3Muc2VuZChKU09OLnN0cmluZ2lmeSh7IGV2ZW50OiBFVkVOVFMubWVzc2FnZSwgdG9waWM6IHRoaXMudG9waWMsIHN1YmplY3Q6IHN1YmplY3QsIHBheWxvYWQ6IHBheWxvYWQgfSkpXG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyBmb3IgbWFpbnRhaW5pbmcgY29ubmVjdGlvbiB3aXRoIHNlcnZlciBhbmQgbWFpbnRhaW5pbmcgY2hhbm5lbHMgbGlzdFxuICovXG5leHBvcnQgY2xhc3MgU29ja2V0IHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBlbmRwb2ludCAtIFdlYnNvY2tldCBlbmRwb250IHVzZWQgaW4gcm91dGVzLmNyIGZpbGVcbiAgICovXG4gIGNvbnN0cnVjdG9yKGVuZHBvaW50KSB7XG4gICAgdGhpcy5lbmRwb2ludCA9IGVuZHBvaW50XG4gICAgdGhpcy53cyA9IG51bGxcbiAgICB0aGlzLmNoYW5uZWxzID0gW11cbiAgICB0aGlzLmxhc3RQaW5nID0gbm93KClcbiAgICB0aGlzLnJlY29ubmVjdFRyaWVzID0gMFxuICAgIHRoaXMuYXR0ZW1wdFJlY29ubmVjdCA9IHRydWVcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHdoZXRoZXIgb3Igbm90IHRoZSBsYXN0IHJlY2VpdmVkIHBpbmcgaGFzIGJlZW4gcGFzdCB0aGUgdGhyZXNob2xkXG4gICAqL1xuICBfY29ubmVjdGlvbklzU3RhbGUoKSB7XG4gICAgcmV0dXJuIHNlY29uZHNTaW5jZSh0aGlzLmxhc3RQaW5nKSA+IFNUQUxFX0NPTk5FQ1RJT05fVEhSRVNIT0xEX1NFQ09ORFNcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmllcyB0byByZWNvbm5lY3QgdG8gdGhlIHdlYnNvY2tldCBzZXJ2ZXIgdXNpbmcgYSByZWN1cnNpdmUgdGltZW91dFxuICAgKi9cbiAgX3JlY29ubmVjdCgpIHtcbiAgICBjbGVhclRpbWVvdXQodGhpcy5yZWNvbm5lY3RUaW1lb3V0KVxuICAgIHRoaXMucmVjb25uZWN0VGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5yZWNvbm5lY3RUcmllcysrXG4gICAgICB0aGlzLmNvbm5lY3QodGhpcy5wYXJhbXMpXG4gICAgICB0aGlzLl9yZWNvbm5lY3QoKVxuICAgIH0sIHRoaXMuX3JlY29ubmVjdEludGVydmFsKCkpXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBpbmNyZW1lbnRpbmcgdGltZW91dCBpbnRlcnZhbCBiYXNlZCBhcm91bmQgdGhlIG51bWJlciBvZiByZWNvbm5lY3Rpb24gcmV0cmllc1xuICAgKi9cbiAgX3JlY29ubmVjdEludGVydmFsKCkge1xuICAgIHJldHVybiBbMTAwMCwgMjAwMCwgNTAwMCwgMTAwMDBdW3RoaXMucmVjb25uZWN0VHJpZXNdIHx8IDEwMDAwXG4gIH1cblxuICAvKipcbiAgICogU2V0cyBhIHJlY3Vyc2l2ZSB0aW1lb3V0IHRvIGNoZWNrIGlmIHRoZSBjb25uZWN0aW9uIGlzIHN0YWxlXG4gICAqL1xuICBfcG9sbCgpIHtcbiAgICB0aGlzLnBvbGxpbmdUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBpZiAodGhpcy5fY29ubmVjdGlvbklzU3RhbGUoKSkge1xuICAgICAgICB0aGlzLl9yZWNvbm5lY3QoKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fcG9sbCgpXG4gICAgICB9XG4gICAgfSwgU09DS0VUX1BPTExJTkdfUkFURSlcbiAgfVxuXG4gIC8qKlxuICAgKiBDbGVhciBwb2xsaW5nIHRpbWVvdXQgYW5kIHN0YXJ0IHBvbGxpbmdcbiAgICovXG4gIF9zdGFydFBvbGxpbmcoKSB7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMucG9sbGluZ1RpbWVvdXQpXG4gICAgdGhpcy5fcG9sbCgpXG4gIH1cblxuICAvKipcbiAgICogU2V0cyBgbGFzdFBpbmdgIHRvIHRoZSBjdXJlbnQgdGltZVxuICAgKi9cbiAgX2hhbmRsZVBpbmcoKSB7XG4gICAgdGhpcy5sYXN0UGluZyA9IG5vdygpXG4gIH1cblxuICAvKipcbiAgICogQ2xlYXJzIHJlY29ubmVjdCB0aW1lb3V0LCByZXNldHMgdmFyaWFibGVzIGFuIHN0YXJ0cyBwb2xsaW5nXG4gICAqL1xuICBfcmVzZXQoKSB7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMucmVjb25uZWN0VGltZW91dClcbiAgICB0aGlzLnJlY29ubmVjdFRyaWVzID0gMFxuICAgIHRoaXMuYXR0ZW1wdFJlY29ubmVjdCA9IHRydWVcbiAgICB0aGlzLl9zdGFydFBvbGxpbmcoKVxuICB9XG5cbiAgLyoqXG4gICAqIENvbm5lY3QgdGhlIHNvY2tldCB0byB0aGUgc2VydmVyLCBhbmQgYmluZHMgdG8gbmF0aXZlIHdzIGZ1bmN0aW9uc1xuICAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zIC0gT3B0aW9uYWwgcGFyYW1ldGVyc1xuICAgKiBAcGFyYW0ge1N0cmluZ30gcGFyYW1zLmxvY2F0aW9uIC0gSG9zdG5hbWUgdG8gY29ubmVjdCB0bywgZGVmYXVsdHMgdG8gYHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZWBcbiAgICogQHBhcmFtIHtTdHJpbmd9IHBhcm1hcy5wb3J0IC0gUG9ydCB0byBjb25uZWN0IHRvLCBkZWZhdWx0cyB0byBgd2luZG93LmxvY2F0aW9uLnBvcnRgXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwYXJhbXMucHJvdG9jb2wgLSBQcm90b2NvbCB0byB1c2UsIGVpdGhlciAnd3NzJyBvciAnd3MnXG4gICAqL1xuICBjb25uZWN0KHBhcmFtcykge1xuICAgIHRoaXMucGFyYW1zID0gcGFyYW1zXG5cbiAgICBsZXQgb3B0cyA9IHtcbiAgICAgIGxvY2F0aW9uOiB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUsXG4gICAgICBwb3J0OiB3aW5kb3cubG9jYXRpb24ucG9ydCxcbiAgICAgIHByb3RvY29sOiB3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wgPT09ICdodHRwczonID8gJ3dzczonIDogJ3dzOicsXG4gICAgfVxuXG4gICAgaWYgKHBhcmFtcykgT2JqZWN0LmFzc2lnbihvcHRzLCBwYXJhbXMpXG4gICAgaWYgKG9wdHMucG9ydCkgb3B0cy5sb2NhdGlvbiArPSBgOiR7b3B0cy5wb3J0fWBcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLndzID0gbmV3IFdlYlNvY2tldChgJHtvcHRzLnByb3RvY29sfS8vJHtvcHRzLmxvY2F0aW9ufSR7dGhpcy5lbmRwb2ludH1gKVxuICAgICAgdGhpcy53cy5vbm1lc3NhZ2UgPSAobXNnKSA9PiB7IHRoaXMuaGFuZGxlTWVzc2FnZShtc2cpIH1cbiAgICAgIHRoaXMud3Mub25jbG9zZSA9ICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuYXR0ZW1wdFJlY29ubmVjdCkgdGhpcy5fcmVjb25uZWN0KClcbiAgICAgIH1cbiAgICAgIHRoaXMud3Mub25vcGVuID0gKCkgPT4ge1xuICAgICAgICB0aGlzLl9yZXNldCgpXG4gICAgICAgIHJlc29sdmUoKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogQ2xvc2VzIHRoZSBzb2NrZXQgY29ubmVjdGlvbiBwZXJtYW5lbnRseVxuICAgKi9cbiAgZGlzY29ubmVjdCgpIHtcbiAgICB0aGlzLmF0dGVtcHRSZWNvbm5lY3QgPSBmYWxzZVxuICAgIGNsZWFyVGltZW91dCh0aGlzLnBvbGxpbmdUaW1lb3V0KVxuICAgIGNsZWFyVGltZW91dCh0aGlzLnJlY29ubmVjdFRpbWVvdXQpXG4gICAgdGhpcy53cy5jbG9zZSgpXG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIG5ldyBjaGFubmVsIHRvIHRoZSBzb2NrZXQgY2hhbm5lbHMgbGlzdFxuICAgKiBAcGFyYW0ge1N0cmluZ30gdG9waWMgLSBUb3BpYyBmb3IgdGhlIGNoYW5uZWw6IGBjaGF0X3Jvb206MTIzYFxuICAgKi9cbiAgY2hhbm5lbCh0b3BpYykge1xuICAgIGxldCBjaGFubmVsID0gbmV3IENoYW5uZWwodG9waWMsIHRoaXMpXG4gICAgdGhpcy5jaGFubmVscy5wdXNoKGNoYW5uZWwpXG4gICAgcmV0dXJuIGNoYW5uZWxcbiAgfVxuXG4gIC8qKlxuICAgKiBNZXNzYWdlIGhhbmRsZXIgZm9yIG1lc3NhZ2VzIHJlY2VpdmVkXG4gICAqIEBwYXJhbSB7TWVzc2FnZUV2ZW50fSBtc2cgLSBNZXNzYWdlIHJlY2VpdmVkIGZyb20gd3NcbiAgICovXG4gIGhhbmRsZU1lc3NhZ2UobXNnKSB7XG4gICAgaWYgKG1zZy5kYXRhID09PSBcInBpbmdcIikgcmV0dXJuIHRoaXMuX2hhbmRsZVBpbmcoKVxuXG4gICAgbGV0IHBhcnNlZF9tc2cgPSBKU09OLnBhcnNlKG1zZy5kYXRhKVxuICAgIHRoaXMuY2hhbm5lbHMuZm9yRWFjaCgoY2hhbm5lbCkgPT4ge1xuICAgICAgaWYgKGNoYW5uZWwudG9waWMgPT09IHBhcnNlZF9tc2cudG9waWMpIGNoYW5uZWwuaGFuZGxlTWVzc2FnZShwYXJzZWRfbXNnKVxuICAgIH0pXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIFNvY2tldDogU29ja2V0XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9saWIvYW1iZXIvYXNzZXRzL2pzL2FtYmVyLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==