class EventStream {
    constructor(res) {
      this.res = res;
      this.init();
    }

    init() {
      this.res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      });
    }

    sendMessage(message) {
      this.res.write(`data: ${JSON.stringify(message)}\n\n`);
    }

    close() {
      this.res.end();
    }
  }

  module.exports = EventStream;
