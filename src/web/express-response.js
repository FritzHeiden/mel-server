import { Response } from "mel-core";
import { Buffer } from "buffer";

export default class ExpressResponse extends Response {
  constructor(response) {
    super();
    this._response = response;
  }

  send(body) {
    this._response.status(this._status).send(body);
  }

  sendFile(relativeFilePath) {
    this._response.status(this._status).sendFile(relativeFilePath);
  }

  sendBuffer(arrayBuffer) {
    this._response.status(this._status).send(Buffer.from(arrayBuffer));
  }

  setHeader(field, value) {
    this._response.set(field, value);
  }
}
