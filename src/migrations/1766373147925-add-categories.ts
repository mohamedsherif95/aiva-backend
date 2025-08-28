import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEntities1766373147925 implements MigrationInterface {
    name = 'UpdateEntities1766373147925'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`INSERT INTO "transactionCategories" ("name", "type") VALUES ('income', 'income')`);
        await queryRunner.query(`INSERT INTO "transactionCategories" ("name", "type") VALUES ('food', 'expense')`);
        await queryRunner.query(`INSERT INTO "transactionCategories" ("name", "type") VALUES ('transportation', 'expense')`);
        await queryRunner.query(`INSERT INTO "transactionCategories" ("name", "type") VALUES ('utilities', 'expense')`);
        await queryRunner.query(`INSERT INTO "transactionCategories" ("name", "type") VALUES ('entertainment', 'expense')`);
        await queryRunner.query(`INSERT INTO "transactionCategories" ("name", "type") VALUES ('shopping', 'expense')`);
        await queryRunner.query(`INSERT INTO "transactionCategories" ("name", "type") VALUES ('health', 'expense')`);
        await queryRunner.query(`INSERT INTO "transactionCategories" ("name", "type") VALUES ('education', 'expense')`);
        await queryRunner.query(`INSERT INTO "transactionCategories" ("name", "type") VALUES ('other', 'expense')`);
        }

    public async down(queryRunner: QueryRunner): Promise<void> {

        }

}
