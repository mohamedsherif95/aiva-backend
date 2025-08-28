import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEntities1756373147925 implements MigrationInterface {
    name = 'UpdateEntities1756373147925'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_26d8aec71ae9efbe468043cd2b9"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_6bb58f2b6e30cb51a6504599f41"`);
        await queryRunner.query(`ALTER TABLE "accounts" DROP CONSTRAINT "FK_3000dad1da61b29953f07476324"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6bb58f2b6e30cb51a6504599f4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_26d8aec71ae9efbe468043cd2b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3000dad1da61b29953f0747632"`);
        await queryRunner.query(`ALTER TABLE "transactionCategories" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "transactionCategories" DROP COLUMN "type"`);
        await queryRunner.query(`CREATE TYPE "public"."transactionCategories_type_enum" AS ENUM('income', 'expense')`);
        await queryRunner.query(`ALTER TABLE "transactionCategories" ADD "type" "public"."transactionCategories_type_enum" NOT NULL DEFAULT 'expense'`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_86e965e74f9cc66149cf6c90f64" FOREIGN KEY ("categoryId") REFERENCES "transactionCategories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_26d8aec71ae9efbe468043cd2b9" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "accounts" ADD CONSTRAINT "FK_3aa23c0a6d107393e8b40e3e2a6" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accounts" DROP CONSTRAINT "FK_3aa23c0a6d107393e8b40e3e2a6"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_26d8aec71ae9efbe468043cd2b9"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_86e965e74f9cc66149cf6c90f64"`);
        await queryRunner.query(`ALTER TABLE "transactionCategories" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."transactionCategories_type_enum"`);
        await queryRunner.query(`ALTER TABLE "transactionCategories" ADD "type" character varying NOT NULL DEFAULT 'expense'`);
        await queryRunner.query(`ALTER TABLE "transactionCategories" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`CREATE INDEX "IDX_3000dad1da61b29953f0747632" ON "accounts" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_26d8aec71ae9efbe468043cd2b" ON "transactions" ("categoryId") `);
        await queryRunner.query(`CREATE INDEX "IDX_6bb58f2b6e30cb51a6504599f4" ON "transactions" ("accountId") `);
        await queryRunner.query(`ALTER TABLE "accounts" ADD CONSTRAINT "FK_3000dad1da61b29953f07476324" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_6bb58f2b6e30cb51a6504599f41" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_26d8aec71ae9efbe468043cd2b9" FOREIGN KEY ("categoryId") REFERENCES "transactionCategories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
