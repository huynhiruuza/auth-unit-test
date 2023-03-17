import { MigrationInterface, QueryRunner } from "typeorm";

export class migrations1678947180243 implements MigrationInterface {
    name = 'migrations1678947180243'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "storage_files" ("id" SERIAL NOT NULL, "file_path" character varying NOT NULL, "origin_name" character varying NOT NULL, "mime_type" character varying NOT NULL, "checksum" character varying NOT NULL, "size" integer NOT NULL, "disk" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3f5d0395ab1f8358e812ac4fe28" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "access_tokens" ("id" SERIAL NOT NULL, "token" character varying NOT NULL, "refresh_token" character varying NOT NULL, "resource_owner_id" integer NOT NULL, "resource_owner_type" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_65140f59763ff994a0252488166" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_9f8f44257355360846bb3826ed" ON "access_tokens" ("token") `);
        await queryRunner.query(`CREATE INDEX "IDX_1eb4d35b4dfacd5c971cc02d8c" ON "access_tokens" ("refresh_token") `);
        await queryRunner.query(`CREATE TABLE "posts" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying, CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('Admin', 'Investigator')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "encrypted_password" character varying NOT NULL DEFAULT '', "email" character varying NOT NULL, "reset_password_token" character varying, "reset_password_sent_at" TIMESTAMP, "remember_created_at" TIMESTAMP, "current_sign_in_at" TIMESTAMP, "last_sign_in_at" TIMESTAMP, "current_sign_in_ip" character varying, "last_sign_in_ip" character varying, "sign_in_count" integer NOT NULL DEFAULT '0', "password" character varying, "password_confirmation" character varying, "locked_at" TIMESTAMP, "failed_attempts" integer NOT NULL DEFAULT '0', "unlock_token" character varying, "confirmation_token" character varying, "unconfirmed_email" character varying, "confirmed_at" TIMESTAMP, "confirmation_sent_at" TIMESTAMP, "role" "public"."users_role_enum" NOT NULL DEFAULT 'Admin', CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_ee6419219542371563e0592db51" UNIQUE ("reset_password_token"), CONSTRAINT "UQ_b800fd597d3e239f367bb8852df" UNIQUE ("unlock_token"), CONSTRAINT "UQ_00ef65cb563e7c32768f478d49b" UNIQUE ("confirmation_token"), CONSTRAINT "UQ_29f17c6c6424b532a3ee36e840e" UNIQUE ("unconfirmed_email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ace513fa30d485cfd25c11a9e4" ON "users" ("role") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_ace513fa30d485cfd25c11a9e4"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP TABLE "posts"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1eb4d35b4dfacd5c971cc02d8c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9f8f44257355360846bb3826ed"`);
        await queryRunner.query(`DROP TABLE "access_tokens"`);
        await queryRunner.query(`DROP TABLE "storage_files"`);
    }

}
