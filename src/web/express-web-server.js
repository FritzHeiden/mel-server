import express from "express";
import http from "http";
import path from "path";
import { WebServer } from "mel-core";
import fs from "fs";

import ExpressResponse from "./express-response";
import ExpressRequest from "./express-request";

export default class ExpressWebServer extends WebServer {
  constructor() {
    super();
    this._app = express();
    this._server = http.createServer(this._app);
    this._servingDirectory = "";
  }

  _get(uri, handler) {
    this._app.get(uri, (request, response) => {
      handler(new ExpressRequest(request), new ExpressResponse(response));
    });
  }

  _static(directoryPath, headers) {
    this._servingDirectory = directoryPath;
    let regex = this._makeWebRootRegExp();
    this._app.get(regex, async (request, response) => {
      Object.keys(headers).forEach(header =>
        response.set(header, headers[header])
      );

      let filePath = request.path.replace(regex, "");
      if (!filePath.startsWith("/")) filePath = "/" + filePath;
      let absolutePath = directoryPath + filePath;
      if (
        await new Promise(resolve => fs.stat(absolutePath, err => resolve(err)))
      ) {
        response.sendFile(directoryPath);
      } else {
        response.sendFile(absolutePath);
      }
    });
  }

  _makeWebRootRegExp() {
    let webRoot = this.getWebRoot();
    if (webRoot.endsWith("/")) webRoot = webRoot.substr(0, webRoot.length - 1);
    let regex = "^" + webRoot + "(/|$)(?!api)";
    return new RegExp(regex);
  }

  start() {
    return new Promise((resolve, reject) => {
      try {
        this._app.get("*", (request, response) =>
          response.sendFile(path.join(this._servingDirectory, "index.html"))
        );
        this._server.listen(this._port, resolve);
      } catch (e) {
        reject(e);
      }
    });
  }

  get server() {
    return this._server;
  }
}
