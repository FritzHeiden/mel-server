import "babel-polyfill";
import path from "path";
import { MelCore } from "mel-core";

import ExpressWebServer from "./web/express-web-server";
import NodeFileSystem from "./file-system/node-file-system";
import NedbDatabase from "./database/nedb-database";
import SocketIoWebSocket from "./network/socket-io-web-socket";

const DEFAULT_CONFIG_PATH = "config.json";
const RELATIVE_MEL_WEB_PATH = "/www";

export class MelServer {
  constructor({ configPath } = {}) {
    this._configPath = DEFAULT_CONFIG_PATH;
    if (configPath) this._configPath = configPath;
  }

  async start() {
    this._melCore = new MelCore();
    let fileSystem = new NodeFileSystem();
    this._melCore.fileSystem = fileSystem;
    let expressWebServer = new ExpressWebServer();
    this._melCore.webServer = expressWebServer;
    this._melCore.database = new NedbDatabase(fileSystem.APPLICATION_DIRECTORY);
    this._melCore.webSocket = new SocketIoWebSocket(expressWebServer.server);

    if (!this._configPath.startsWith("/")) {
      this._configPath =
        fileSystem.APPLICATION_DIRECTORY + "/" + this._configPath;
    }
    console.log("Using config path " + this._configPath);
    await this._melCore.initialize({
      configPath: this._configPath,
      melWebPath: fileSystem.APPLICATION_DIRECTORY + RELATIVE_MEL_WEB_PATH
    });
  }

  async refreshFiles() {
    await this._melCore.refreshFiles();
  }

  getPort() {
    return this._melCore.webServer.getPort();
  }
}

let main = async () => {
  let fileSystem = new NodeFileSystem();
  let args = {};
  for (let i = 2; i < process.argv.length; i++) {
    let argument = process.argv[i];
    switch (argument) {
      case "-c":
      case "--config":
        let configPath = process.argv[i + 1];
        configPath = path.resolve(configPath);
        let stats = await fileSystem.stats(path.dirname(configPath));
        if (!stats) {
          throw new Error("Invalid config path: " + configPath);
        }
        args.configPath = configPath;
        break;
    }
  }

  const melServer = new MelServer({ configPath: args.configPath });
  await melServer.start();

  console.log(`MelServer started at port ${melServer.getPort()}`);
  await melServer.refreshFiles();
};

main().catch(err => console.error(err));
