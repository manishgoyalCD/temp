import { registerAs } from '@nestjs/config';


export default registerAs(
    'redis',
    (): Record<string, any> => ({
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || '6379',
        name: process.env.REDIS_NAME || '0',
        user: process.env.REDIS_USER || null,
        password: process.env.REDIS_PASSWORD || null,
    })
);
