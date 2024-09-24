import { Injectable } from '@nestjs/common';
import { CreateRestaurantIndexMigration } from './create-restaurant-index.migration';

@Injectable()
export class MigrationRunnerService {
  constructor(private readonly createRestaurantIndexMigration: CreateRestaurantIndexMigration) {}

  // Run all migrations
  async runMigrations() {
    await this.createRestaurantIndexMigration.up();
  }

  // Rollback all migrations
  async rollbackMigrations() {
    await this.createRestaurantIndexMigration.down();
  }

  // Run the migration to copy data from MongoDB to Elasticsearch
  async migrateData() {
    await this.createRestaurantIndexMigration.migrateDataToElastic();
  }
}
