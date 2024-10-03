import { ConfigService } from '@nestjs/config';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { RestaurantDocument } from 'src/modules/restaurants/schemas/restaurant.schema';
import { RestaurantSearchDto } from 'src/modules/restaurants/dto/restaurant-search.dto';
import { RESTAURANT_DEFAULT_DISTANCE, RESTAURANT_DEFAULT_PER_PAGE } from 'src/modules/restaurants/constants/restaurant.constant';
import { SearchHit, SearchTotalHits } from '@elastic/elasticsearch/lib/api/types';

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
  restaurantIndex: string
  dishesIndex: string

  constructor(
    private readonly esService: ElasticsearchService,
    private readonly configService: ConfigService,
  ) {
    this.restaurantIndex = this.configService.get<string>('elastic.index.restaurant')
    this.dishesIndex = this.configService.get<string>('elastic.index.dishes')
  }

  async onModuleInit() {
    await this.createIndexWithMapping();
  }

  async createIndexWithMapping() {

    const isIndexExists = await this.esService.indices.exists({ index: this.restaurantIndex });
    
    if (!isIndexExists) {
      await this.esService.indices.create({
        index: this.restaurantIndex,
        body: {
          mappings: {
            properties: {
              // _id: { type: 'keyword' },
              name: { type: 'text' },
              image: { type: 'text' },
              city: { type: 'text' },
              state: { type: 'text' },
              address: { type: 'text' },
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
      console.log(`Created index ${this.restaurantIndex} with mapping`);
    } else {
      console.log(`Index ${this.restaurantIndex} already exists`);
    }
  }

  async insertRestaurantDocument(restaurant:RestaurantDocument) {
    
    try {
      const result = await this.esService.index({
        index: this.restaurantIndex,
        id: restaurant._id.toString(),  // Use the _id.$oid as the document ID
        body: {
          // _id: restaurant._id.toString(),
          // source_id: restaurant.source_id,
          name: restaurant.name,
          // phone_no: restaurant.phone_no,
          // website: restaurant.website,
          image: restaurant.image,
          city: restaurant.city,
          state: restaurant.state,
          address: restaurant.address,
          // plush_code: restaurant.plush_code,
          description: restaurant.description,
          location: {
            type: restaurant.location.type,
            coordinates: restaurant.location.coordinates,
          },
          images: restaurant.images,
          opening_hours: restaurant.opening_hours,
          amenities: restaurant.amenties,
          cuisines: restaurant.cuisines,
          dishes: restaurant.dishes,
          price: restaurant.price,
          currency: restaurant.currency,
          source: restaurant.source,
          rating: restaurant.rating,
          reviews_count: restaurant.reviews_count,
          likes_count: restaurant.likes_count,
          overall_reviews: restaurant.overall_reviews
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


  async searchRestaurants(filters: RestaurantSearchDto) {
    const { page = 1, search, per_page = RESTAURANT_DEFAULT_PER_PAGE, dietary, location, distance = RESTAURANT_DEFAULT_DISTANCE, price_range, rating, skip, sort } = filters;
    console.log({ page, search, per_page, dietary, location, distance, price_range, rating, skip } );
    console.log(sort);
    
    const query: any = {
      from: (page-1) * per_page,
      size: per_page,
      query: {
        bool: {
          must: [],
          filter: [],
        },
      },
      sort: []
    };
    
    // 1. Dietary filter (terms query for an array of dietary restrictions)
    // if (dietary && dietary.length > 0) {
    //   query.query.bool.filter.push({
    //     terms: {
    //       'dietary.keyword': dietary,
    //     },
    //   });
    // }
    
    // 2. Search query for name, dishes, cuisines, amanities
    if (search) {
      query.query.bool.must.push({
        multi_match: {
          query: search,
          fields: ['name', 'dishes', 'cuisines', 'amanities']
        }
      });
    }
    
    if (location && distance) {
      query.query.bool.filter.push({
        geo_distance: {
          distance: `${distance}km`,
          location: { 
            lat: location.lat,
            lon: location.lon,
          },
        },
      });
    }
    
    // 3. Price
    if (price_range) {
      const priceFilter = {};
      if (price_range.min && price_range.max) {
        priceFilter['price'] = { gte: price_range.min, lte: price_range.max };
      } else if (price_range.min) {
        priceFilter['price'] = { gte: price_range.min };
      } else if (price_range.max) {
        priceFilter['price'] = { lte: price_range.max };
      }
      if (Object.keys(priceFilter).length > 0) {
        query.query.bool.filter.push({
          range: priceFilter
        });
      }
    }      
    
    // 4. Rating filter (range query for rating)
    if (rating !== undefined) {
      query.query.bool.filter.push({
        range: {
          rating: {
            gte: rating,
          },
        },
      });
    }
    
    // 5. Dynamic sort field for multiple fields
    if (sort) {
      Object.entries(sort).forEach(([field, value]) => {
        console.log([field, value]);
        const order = value < 0 ? 'desc' : 'asc'
        if (field == 'rating' || field == 'price') {
          query.sort.push({ [field]: { order } });
        } else if (field == 'location') {
          query.sort.push({ _geo_distance: {
              location: { lat: location.lat, lon: location.lon },
              order: order,
              unit: 'km',
              distance_type: 'plane',
              mode: 'min'
            }
          });
        }
      });
    }
    
    const result = await this.esService.search({
      index: this.restaurantIndex, 
      body: {
        _source: true,
        ...query,
      },
      from: (page - 1) * per_page, 
      size: per_page, 
    });
    
    const total: SearchTotalHits = result.hits.total as SearchTotalHits
    return {
      total: total.value, // Total number of hits
      page: page, 
      size: per_page,
      result: result.hits.hits.map((hit:any) => ({
        _id: hit._id,          
        ...(hit._source as Record<string, any> ? hit._source : {}),
      })),
    };
  }



}