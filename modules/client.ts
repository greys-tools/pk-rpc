import EventEmitter from 'node:events';
import IPCTransport from './ipc';

function getPid() {
  if (typeof process !== 'undefined') {
    return process.pid;
  }
  return null;
}

class RPCClient extends EventEmitter {
	options: any;
	user: any;
	application: any;
	clientId: string | null;
	ipc: IPCTransport;
	connectPromise: Promise<any> | null;
	expecting: Map<string, any>;

	constructor(options = {}) {
		super();

		this.options = options;
		this.user = null;
		this.application = null;
		this.clientId = null;
		this.connectPromise = null;
		this.expecting = new Map();

    this.ipc = new IPCTransport(this);
    this.ipc.on('message', this.handleMessage.bind(this));
	}

	connect(clientId: string, reset: boolean = false) {
    if (this.connectPromise && !reset) {
      return this.connectPromise;
    }
    this.connectPromise = new Promise((resolve, reject) => {
      this.clientId = clientId;
      const timeout = setTimeout(() => reject(new Error('RPC_CONNECTION_TIMEOUT')), 30e3);
      timeout.unref();
      this.once('connected', () => {
        clearTimeout(timeout);
        resolve(this);
      });
      this.ipc.once('close', () => {
        this.expecting.forEach((e) => {
          e.reject(new Error('connection closed'));
        });
        this.emit('disconnected');
        reject(new Error('connection closed'));
      });
      this.ipc.connect().catch(reject);
    });
    return this.connectPromise;
  }

  async login(options: any = {}) {
    let { clientId, reset } = options;
    await this.connect(clientId, reset);
    this.emit('ready');
    return this;
  }

  request(cmd: string, args?: any, evt?: string) {
    return new Promise((resolve, reject) => {
      const nonce = crypto.randomUUID();
      this.ipc.send({ cmd, args, evt, nonce });
      this.expecting.set(nonce, { resolve, reject });
    });
  }

	handleMessage(message: any = {}) {
		const { cmd, evt, data, nonce } = message;

		if(cmd === 'DISPATCH' && evt === 'READY') {
			if (data.user) {
        this.user = data.user;
      }
      this.emit('connected');
		} else if (this.expecting.has(nonce)) {
      const { resolve, reject } = this.expecting.get(nonce);
      if (evt === 'ERROR') {
        const e: any = new Error(data.message);
        console.error(e);
        e.code = data.code;
        e.data = data;
        reject(e);
      } else {
        resolve(data);
      }
      this.expecting.delete(nonce);
    } else {
      this.emit(evt, data);
    }
	}

	setActivity(args: any = {}, pid = getPid()) {
    let timestamps: any;
    let assets: any;
    let party: any;
    let secrets: any;
    if (args.startTimestamp || args.endTimestamp) {
      timestamps = {
        start: args.startTimestamp,
        end: args.endTimestamp,
      };
      if (timestamps.start instanceof Date) {
        timestamps.start = Math.round(timestamps.start.getTime());
      }
      if (timestamps.end instanceof Date) {
        timestamps.end = Math.round(timestamps.end.getTime());
      }
      if (timestamps.start > 2147483647000) {
        throw new RangeError('timestamps.start must fit into a unix timestamp');
      }
      if (timestamps.end > 2147483647000) {
        throw new RangeError('timestamps.end must fit into a unix timestamp');
      }
    }
    if (
      args.largeImageKey || args.largeImageText
      || args.smallImageKey || args.smallImageText
    ) {
      assets = {
        large_image: args.largeImageKey,
        large_text: args.largeImageText,
        small_image: args.smallImageKey,
        small_text: args.smallImageText,
      };
    }
    if (args.partySize || args.partyId || args.partyMax) {
      party = { id: args.partyId };
      if (args.partySize || args.partyMax) {
        party.size = [args.partySize, args.partyMax];
      }
    }
    if (args.matchSecret || args.joinSecret || args.spectateSecret) {
      secrets = {
        match: args.matchSecret,
        join: args.joinSecret,
        spectate: args.spectateSecret,
      };
    }

    return this.request('SET_ACTIVITY', {
      pid,
      activity: {
        state: args.state,
        details: args.details,
        timestamps,
        assets,
        party,
        secrets,
        buttons: args.buttons,
        instance: !!args.instance,
      },
    });
  }

  async destroy() {
    await this.ipc.close();
  }
}

export default RPCClient;
export { RPCClient };