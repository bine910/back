import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { MigrationInterface, QueryRunner } from "typeorm";

export class LoadSeedSql1860000000001 implements MigrationInterface {
  name = "LoadSeedSql1860000000001";

  public async up(queryRunner: QueryRunner): Promise<void> {
    const seedFilePath = this.resolveSeedFilePath();
    const seedSql = await readFile(seedFilePath, "utf-8");

    await queryRunner.query(seedSql);
  }

  public async down(): Promise<void> {
    // No-op: seed.sql contains destructive + data setup statements.
  }

  private resolveSeedFilePath(): string {
    const candidatePaths = [
      resolve(__dirname, "../../../seed.sql"),
      resolve(__dirname, "../../../../seed.sql"),
      join(process.cwd(), "seed.sql"),
      join(process.cwd(), "back", "seed.sql"),
    ];

    const seedFilePath = candidatePaths.find((candidate) => existsSync(candidate));
    if (!seedFilePath) {
      throw new Error("Cannot find seed.sql to run seed migration.");
    }

    return seedFilePath;
  }
}
