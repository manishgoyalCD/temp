import { ConfigService } from '@nestjs/config';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { RestaurantDocument } from 'src/modules/restaurants/schemas/restaurant.schema';

type dataResponse = {
  UnitPrice: number;
  Description: string;
  Quantity: number;
  Country: string;
  InvoiceNo: string;
  InvoiceDate: Date;
  CustomerID: number;
  StockCode: string;
};

@Injectable()
export class SearchService implements OnModuleInit {
  constructor(
    private readonly esService: ElasticsearchService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.createIndexWithMapping();
  }

  async createIndexWithMapping() {
    const index = 'restaurants';

    const isIndexExists = await this.esService.indices.exists({ index });
    
    if (!isIndexExists) {
      await this.esService.indices.create({
        index,
        body: {
          mappings: {
            properties: {
              _id: { type: 'keyword' },
              source_id: { type: 'keyword' },
              name: { type: 'text' },
              phone_no: { type: 'text' },
              website: { type: 'text' },
              image: { type: 'text' },
              city: { type: 'text' },
              state: { type: 'text' },
              address: { type: 'text' },
              plush_code: { type: 'keyword' },
              description: { type: 'text' },
              location: {
                  type: 'geo_point'
              },
              images: {
                type: 'nested',
                properties: {
                  image: { type: 'text' }
                }
              },
              opening_hours: { type: 'object' },
              amenities: {
                type: 'nested',
                properties: {
                  amenities: { type: 'text' }
                }
              },
              cuisines: {
                type: 'nested',
                properties: {
                  cuisines: { type: 'text' }
                }
              },
              dishes: {
                type: 'nested',
                properties: {
                  dishes: { type: 'text' }
                }
              },
              price: {
                properties: {
                  min: { type: 'double' },
                  max: { type: 'double' },
                  currency: { type: 'keyword' },
                  text: { type: 'text' },
                }
              },
              source: { type: 'keyword' },
              reviews_count: { type: 'integer' },
              likes_count: { type: 'integer' }
            }
          }
        }
      });
      console.log(`Created index ${index} with mapping`);
    } else {
      console.log(`Index ${index} already exists`);
    }
  }

  async insertRestaurantDocument(restaurant:RestaurantDocument) {
    const index = 'restaurants';
    try {
      const result = await this.esService.index({
        index,
        id: restaurant._id.toString(),  // Use the _id.$oid as the document ID
        body: {
          _id: restaurant._id.toString(),
          source_id: restaurant.source_id,
          name: restaurant.name,
          phone_no: restaurant.phone_no,
          website: restaurant.website,
          image: restaurant.image,
          city: restaurant.city,
          state: restaurant.state,
          address: restaurant.address,
          plush_code: restaurant.plush_code,
          description: restaurant.description,
          location: {
            type: restaurant.location.type,
            coordinates: restaurant.location.coordinates,
          },
          images: restaurant.images,
          opening_hours: restaurant.opening_hours,
          amenities: restaurant.amenities,
          cuisines: restaurant.cuisines,
          dishes: restaurant.dishes,
          price: {
            min: restaurant.price?.min,
            max: restaurant.price?.max,
            currency: restaurant.price?.currency,
          },
          source: restaurant.source,
          reviews_count: restaurant.reviews_count,
          likes_count: restaurant.likes_count
        }
      });

      console.log('Document inserted:', result);
    } catch (error) {
      console.error('Error inserting document:', error);
    }
  }

  async search(query) {
    let results = new Set();
    const response = await this.esService.search({
        "index": 'location',
        "size": 10,
        "query": {
        "bool": 
        {
            "should": 
            [
                {
                    "match_phrase_prefix": 
                    {
                        "city": 
                        {
                            "query": query
                        }
                    }
                },
                {
                    "match_phrase_prefix": 
                    {
                        "state": 
                        {
                            "query": query
                        }
                    }
                }
            
            ]
        }
    },
        "aggs" : 
        {
            "group_by_city" : 
            {
                "terms" : { "field" : "city.keyword","size":15,"order":{ "_key": "asc" } }
            }
        }   
    });
    return response
  }

  async search_city(query){
      const results = this.esService.search(
        {
          "size": 100,
          "query": {
            "match": {
              "state": query
            }
          },
          "aggs" : {
              "group_by_city" : {
                  "terms" : { "field" : "city.keyword","size":15,"order":{ "_key": "asc" } }
              }
          }
        }
      )
    return results
  }

  async search_zipcode(query){
    const results = this.esService.search(
      {
        "size": 100,
        "query": {
          "match_phrase_prefix": {
            "zipcode": query
          }
        },
        "aggs" : {
            "group_by_zipcode" : {
                "terms" : { "field" : "zipcode.keyword","size":15,"order":{ "_key": "asc" } }
            }
        }
      }
    )
  return results
  }

  async search_city_state(city,state) {
    let results = new Set();
    const response = await this.esService.search
    ({
        "size": 10,
        "query": {
        "bool": 
        {
            "must": 
            [
                {
                    "match_phrase_prefix": 
                    {
                        "city": 
                        {
                            "query": city
                        }
                    }
                },
                {
                    "match_phrase_prefix": 
                    {
                        "state": 
                        {
                            "query": state
                        }
                    }
                }
            
            ]
        }
    }
    });
    return response
}



}