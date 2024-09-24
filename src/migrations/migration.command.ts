import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { MigrationRunnerService } from './elasticsearch/restaurant/migration-runner.service';

@Injectable()
export class MigrationCommand {
  constructor(private readonly migrationRunnerService: MigrationRunnerService) {}

  @Command({ command: 'migrate:up', describe: 'Run Elasticsearch migrations' })
  async runMigrations() {
    await this.migrationRunnerService.runMigrations();
  }

  @Command({ command: 'migrate:down', describe: 'Rollback Elasticsearch migrations' })
  async rollbackMigrations() {
    await this.migrationRunnerService.rollbackMigrations();
  }

  @Command({ command: 'migrate:data', describe: 'Migrate MongoDB data to Elasticsearch' })
  async migrateData() {
    await this.migrationRunnerService.migrateData();
  }

}
