import { Request } from "mel-core";

export default class ExpressRequest extends Request {
  constructor(request) {
    super();
    this._request = request;
  }

  getUrl() {
    return this._request.url;
  }
}
