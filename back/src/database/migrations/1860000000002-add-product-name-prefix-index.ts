import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProductNamePrefixIndex1860000000002
  implements MigrationInterface
{
  name = 'AddProductNamePrefixIndex1860000000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_products_active_lower_name_prefix" ON "products" (LOWER("name") text_pattern_ops) WHERE "is_active" = true`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_products_active_lower_name_prefix"`,
    );
  }
}
