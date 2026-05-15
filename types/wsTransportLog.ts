export type WsTransportLogDirection = 'in' | 'out';

export type WsTransportLogEntry = {
  direction: WsTransportLogDirection;
  ts: number;
  body: unknown;
};
