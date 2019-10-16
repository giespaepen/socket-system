import bodyParser from "body-parser";

import { config } from "../config";
import { MIME_TYPE } from "../constants";

const rawBody = bodyParser.raw({
    inflate: true,
    limit: config.maxBodySize,
    type: MIME_TYPE,
});

export { rawBody };
