import { ApiVersion, createConfig, ICommonConfig } from "socket-common";

// The default api version
const DEFAULT_API: ApiVersion = "v1";
const DEFAULT_PORT = 3001;

const config: ICommonConfig = {
    api: DEFAULT_API,
    port: DEFAULT_PORT,
    ...createConfig("socket-server", DEFAULT_PORT),
};

export { config };
