declare module "chii" {
  import http = require("http");
  import https = require("https");
  type Request = typeof http.IncomingMessage;
  type Response = typeof http.ServerResponse;

  type httpServer = http.Server<Request, Response>;
  type httpsServer = https.Server<Request, Response>;
  interface ChiiOptions {
    port?: number;
    host?: string;
    domain?: string;
    cdn?: string;
    https?: boolean;
    sslCert?: string;
    sslKey?: string;
    basePath?: string;
    server?: httpServer | httpsServer;
  }
  function start(options: ChiiOptions): Promise<void>;
}
