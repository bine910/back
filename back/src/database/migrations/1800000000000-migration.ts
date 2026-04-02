import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1800000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO users (id, email, password_hash, full_name, role) VALUES 
      (1, 'customer1@example.com', 'hashed_pw', 'Nguyễn Văn A', 'user'),
      (2, 'customer2@example.com', 'hashed_pw', 'Trần Thị B', 'user');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM users WHERE id IN (1, 2);
    `);
  }
}
//Migration1800000000000-migration