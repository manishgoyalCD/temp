import { registerAs } from '@nestjs/config';

export default registerAs(
    'elastic',
    (): Record<string, any> => ({
        host: process.env.ELASTIC_SEARCH_HOSTNAME || 'localhost',
        port: process.env.ELASTIC_SEARCH_PORT || 9200,
        username: process.env.ELASTIC_SEARCH_USERNAME || '',
        password: process.env.ELASTIC_SEARCH_PASSWORD || '',
        index: {
            restaurant: process.env.ELASTIC_SEARCH_RESTAURANT_INDEX,
            dishes: process.env.ELASTIC_SEARCH_DISHES_INDEX,
            location: process.env.ELASTIC_SEARCH_LOCATION_INDEX
        }
    })
);
