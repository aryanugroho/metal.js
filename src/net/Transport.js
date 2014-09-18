(function() {
  'use strict';

  /**
   * Transport utility.
   * @interface
   * @constructor
   * @extends {lfr.EventEmitter}
   */
  lfr.Transport = function(uri) {
    lfr.Transport.base(this, 'constructor');

    if (!lfr.isDef(uri)) {
      throw new Error('Transport uri not specified');
    }

    this.on('close', lfr.bind(this.onCloseHandler_, this));
    this.on('data', lfr.bind(this.onDataHandler_, this));
    this.on('open', lfr.bind(this.onOpenHandler_, this));
  };
  lfr.inherits(lfr.Transport, lfr.EventEmitter);

  /**
   * Returns lfr.Transport singleton.
   * @param {string} uri
   * @return {lfr.Transport} Single instance of lfr.Transport.
   * @static
   */
  lfr.Transport.getSingleton = function(uri) {
      if (lfr.Transport.instance_) {
        return lfr.Transport.instance_;
      }
      return (lfr.Transport.instance_ = new lfr.Transport(uri));
  };

  /**
   * Holds the transport state, it supports the available states: '',
   * 'opening', 'open' and 'closed'.
   * @type {string}
   * @default ''
   */
  lfr.Transport.prototype.state = '';

  /**
   * Holds the transport uri.
   * @type {string}
   * @default ''
   */
  lfr.Transport.prototype.uri = '';

  /**
   * Closes the transport.
   * @chainable
   */
  lfr.Transport.prototype.close = lfr.abstractMethod;

  /**
   * Decodes a data chunk received.
   * @param {*=} data
   * @return {?}
   */
  lfr.Transport.prototype.decodeData = lfr.identityFunction;

  /**
   * Gets the transport state value.
   * @return {string}
   */
  lfr.Transport.prototype.getState = function() {
    return this.state;
  };

  /**
   * Gets the transport uri.
   * @return {string}
   */
  lfr.Transport.prototype.getUri = function() {
    return this.uri;
  };

  /**
   * Defaults handler for close event.
   * @protected
   */
  lfr.Transport.prototype.onCloseHandler_ = function() {
    this.state = 'closed';
  };

  /**
   * Defaults handler for data event.
   * @protected
   */
  lfr.Transport.prototype.onDataHandler_ = function(event) {
    this.emit('data', {
      data: this.decodeData(event.data)
    });
  };

  /**
   * Defaults handler for open event.
   * @protected
   */
  lfr.Transport.prototype.onOpenHandler_ = function() {
    this.state = 'open';
  };

  /**
   * Opens the transport.
   * @chainable
   */
  lfr.Transport.prototype.open = lfr.abstractMethod;

  /**
   * Sends packet.
   * @param {*} packet
   */
  lfr.Transport.prototype.send = function(packet) {
    if (this.state === 'open') {
      this.write(packet);
    } else {
      throw new Error('Transport not open');
    }
  };

  /**
   * Sets the transport state value.
   * @param {string} state
   */
  lfr.Transport.prototype.setState = function(state) {
    this.state = state;
  };

  /**
   * Sets the transport uri.
   * @return {string}
   */
  lfr.Transport.prototype.setUri = function(uri) {
    this.uri = uri;
  };

  /**
   * Writes data to the transport.
   * @param {*} packet
   * @chainable
   */
  lfr.Transport.prototype.write = lfr.abstractMethod;

  /**
   * Emits when close is called.
   * @event close
   */

  /**
   * Emits when data is called.
   * @event data
   */

  /**
   * Emits when error is called.
   * @event error
   */

  /**
   * Emits when a message is received. Relevant when data event handles
   * multiple chunks of data.
   * @event message
   */

  /**
   * Emits when open is called.
   * @event open
   */

}());