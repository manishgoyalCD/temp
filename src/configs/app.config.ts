import { registerAs } from '@nestjs/config';
import { version } from '../../package.json';

export default registerAs(
    'app',
    (): Record<string, any> => ({
        name: process.env.APP_NAME || 'ack',
        env: process.env.APP_ENV || 'development',
        language: process.env.APP_LANGUAGE || "en",
        appUrl: process.env.APP_URL,
        repoVersion: version,
        versioning: {
            enable: process.env.HTTP_VERSIONING_ENABLE === 'true' || false,
            prefix: 'v',
            version: process.env.HTTP_VERSION || '1',
        },

        globalPrefix: '/api',
        http: {
            enable: process.env.HTTP_ENABLE === 'true' || false,
            host: process.env.HTTP_HOST || 'localhost',
            port: Number.parseInt(process.env.HTTP_PORT) || 3000,
        },
        appHeaderKey: process.env.IS_APP_HEADER_KEY,
        jobEnable: process.env.JOB_ENABLE === 'true' || false,
    })
);
