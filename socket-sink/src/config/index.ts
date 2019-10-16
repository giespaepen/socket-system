import { ApiVersion, createConfig, ICommonConfig } from "socket-common";

export interface IConfig extends ICommonConfig {
    maxBodySize: string;
}

// The default api version
const DEFAULT_API: ApiVersion = "v1";
const DEFAULT_PORT = 3000;

const config = {
    ...createConfig("socket-sink", DEFAULT_PORT),
    api: DEFAULT_API,
    maxBodySize: "10kb",
};

export { config };
