import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema20250828040000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create transactionCategories table
    await queryRunner.query(`
      CREATE TABLE "transactionCategories" (
        "id" SERIAL PRIMARY KEY,
        "name" character varying NOT NULL,
        "type" character varying NOT NULL DEFAULT 'expense',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    // Create users table
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" SERIAL PRIMARY KEY,
        "name" character varying NOT NULL,
        "email" character varying NOT NULL,
        "password" character varying NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")
      )
    `);

    // Create accounts table
    await queryRunner.query(`
      CREATE TABLE "accounts" (
        "id" SERIAL PRIMARY KEY,
        "name" character varying NOT NULL,
        "userId" integer NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "FK_3000dad1da61b29953f07476324" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);

    // Create transactions table
    await queryRunner.query(`
      CREATE TABLE "transactions" (
        "id" SERIAL PRIMARY KEY,
        "amount" decimal(10,2) NOT NULL,
        "description" character varying,
        "categoryId" integer NOT NULL,
        "accountId" integer NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "FK_26d8aec71ae9efbe468043cd2b9" FOREIGN KEY ("categoryId") REFERENCES "transactionCategories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT "FK_6bb58f2b6e30cb51a6504599f41" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);

    // Create indexes
    await queryRunner.query('CREATE INDEX "IDX_6bb58f2b6e30cb51a6504599f4" ON "transactions" ("accountId") ');
    await queryRunner.query('CREATE INDEX "IDX_26d8aec71ae9efbe468043cd2b" ON "transactions" ("categoryId") ');
    await queryRunner.query('CREATE INDEX "IDX_3000dad1da61b29953f0747632" ON "accounts" ("userId") ');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "transactions"');
    await queryRunner.query('DROP TABLE "accounts"');
    await queryRunner.query('DROP TABLE "users"');
    await queryRunner.query('DROP TABLE "transactionCategories"');
  }
}
