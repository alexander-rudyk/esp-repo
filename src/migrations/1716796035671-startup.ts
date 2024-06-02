import { MigrationInterface, QueryRunner } from 'typeorm';

export class Startup1716796035671 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.startTransaction();
    try {
      await queryRunner.query(
        'CREATE TABLE "file" ("id" SERIAL NOT NULL, "filename" character varying NOT NULL, "size" integer NOT NULL, "path" character varying NOT NULL, "mimetype" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "versionId" integer, CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id"))',
      );
      await queryRunner.query(
        'CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))',
      );
      await queryRunner.query(
        'CREATE TABLE "version" ("id" SERIAL NOT NULL, "version" character varying NOT NULL, "changelog" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdById" integer, "projectId" integer, CONSTRAINT "PK_4fb5fbb15a43da9f35493107b1d" PRIMARY KEY ("id"))',
      );
      await queryRunner.query(
        'CREATE TABLE "project" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "git_ref" character varying, "description" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdById" integer, CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id"))',
      );
      await queryRunner.query(
        'CREATE TABLE "project_right" ("id" SERIAL NOT NULL, "isCanDownload" boolean NOT NULL, "isCanUpload" boolean NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "projectId" integer, CONSTRAINT "PK_0effd81b7e716770122ca8458a7" PRIMARY KEY ("id"))',
      );
      await queryRunner.query(
        'ALTER TABLE "file" ADD CONSTRAINT "FK_26b78fa444c5772bcc6cfe19fa2" FOREIGN KEY ("versionId") REFERENCES "version"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
      );
      await queryRunner.query(
        'ALTER TABLE "version" ADD CONSTRAINT "FK_3f9853d88c2b571ea1dfe4367db" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
      );
      await queryRunner.query(
        'ALTER TABLE "version" ADD CONSTRAINT "FK_87cc47dae583fb8cc5e43e70009" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
      );
      await queryRunner.query(
        'ALTER TABLE "project" ADD CONSTRAINT "FK_678acfe7017fe8a25fe7cae5f18" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
      );
      await queryRunner.query(
        'ALTER TABLE "project_right" ADD CONSTRAINT "FK_9e2a03ef1265e9773674289e100" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
      );
      await queryRunner.query(
        'ALTER TABLE "project_right" ADD CONSTRAINT "FK_b008215e29e3aef142be8635ff9" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
      );
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.startTransaction();
    try {
      // Drop foreign key constraints
      await queryRunner.query(
        'ALTER TABLE "project_right" DROP CONSTRAINT "FK_b008215e29e3aef142be8635ff9"',
      );
      await queryRunner.query(
        'ALTER TABLE "project_right" DROP CONSTRAINT "FK_9e2a03ef1265e9773674289e100"',
      );
      await queryRunner.query(
        'ALTER TABLE "project" DROP CONSTRAINT "FK_678acfe7017fe8a25fe7cae5f18"',
      );
      await queryRunner.query(
        'ALTER TABLE "version" DROP CONSTRAINT "FK_87cc47dae583fb8cc5e43e70009"',
      );
      await queryRunner.query(
        'ALTER TABLE "version" DROP CONSTRAINT "FK_3f9853d88c2b571ea1dfe4367db"',
      );
      await queryRunner.query(
        'ALTER TABLE "file" DROP CONSTRAINT "FK_26b78fa444c5772bcc6cfe19fa2"',
      );

      // Drop tables
      await queryRunner.query('DROP TABLE "project_right"');
      await queryRunner.query('DROP TABLE "project"');
      await queryRunner.query('DROP TABLE "version"');
      await queryRunner.query('DROP TABLE "user"');
      await queryRunner.query('DROP TABLE "file"');

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    }
  }
}
