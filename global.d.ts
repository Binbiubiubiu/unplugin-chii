declare module "chii" {
  interface ChiiOptions {
    port?: number;
    host?: string;
    domain?: string;
    cdn?: string;
    https?: boolean;
    sslCert?: string;
    sslKey?: string;
    basePath?: string;
  }
  function start(options: ChiiOptions): Promise<void>;
}
