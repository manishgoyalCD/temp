import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RestaurantDocument } from 'src/modules/restaurants/schemas/restaurant.schema';

@Injectable()
export class CreateRestaurantIndexMigration {
  private readonly indexName = 'restaurants';

  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    @InjectModel('Restaurant') private restaurantModel: Model<RestaurantDocument>,  // Inject MongoDB Model
  ) {}

  /**
   * Run migration - Create the index and mapping if it doesn't exist
   */
  async up() {
    const indexExists = await this.elasticsearchService.indices.exists({ index: this.indexName });
    if (!indexExists) {
      console.log(`Creating index: ${this.indexName}`);
      await this.elasticsearchService.indices.create({
        index: this.indexName,
        body: {
          mappings: {
            properties: {
              _id: { properties: { $oid: { type: 'keyword' } } },
              source_id: { type: 'keyword' },
              name: { type: 'text' },
              phone: { type: 'text' },
              website: { type: 'text' },
              image: { type: 'text' },
              city: { type: 'text' },
              state: { type: 'text' },
              address: { type: 'text' },
              plush_code: { type: 'keyword' },
              description: { type: 'text' },
              location: {
                properties: {
                  type: { type: 'keyword' },
                  coordinates: { type: 'geo_point' }
                }
              },
              images: {
                type: 'nested',
                properties: {
                  image: { type: 'text' }
                }
              },
              open_hours: { type: 'object' },
              amenties: {
                type: 'nested',
                properties: {
                  amenity: { type: 'text' }
                }
              },
              cuisines: {
                type: 'nested',
                properties: {
                  cuisine: { type: 'text' }
                }
              },
              dishes: { type: 'text' },
              
              price: {
                properties: {
                  min: { type: 'double' },
                  max: { type: 'double' },
                  currency: { type: 'keyword' }
                }
              },
              source: { type: 'keyword' },
              reviews_count: { type: 'integer' },
              likes_count: { type: 'integer' }
            }
          }
        }
      });
    } else {
      console.log(`Index ${this.indexName} already exists`);
    }
  }

  /**
   * Rollback migration - Delete the index
   */
  async down() {
    const indexExists = await this.elasticsearchService.indices.exists({ index: this.indexName });
    if (indexExists) {
      console.log(`Deleting index: ${this.indexName}`);
      await this.elasticsearchService.indices.delete({ index: this.indexName });
    }
  }


  /**
   * Migrate data from MongoDB to Elasticsearch
   */
  async migrateDataToElastic() {
    const restaurants = await this.restaurantModel.find().lean().exec();  // Fetch all MongoDB records

    for (const restaurant of restaurants) {
      await this.elasticsearchService.index({
        index: this.indexName,
        id: restaurant._id.toString(),  // Use MongoDB _id as Elasticsearch ID
        body: restaurant,
      });
      console.log(`Inserted restaurant with ID ${restaurant._id}`);
    }
  }

}
