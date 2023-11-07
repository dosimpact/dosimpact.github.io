---
sidebar_position: 5
---

# NestJS TypeORM Entity 1

<head>
  <meta name="keywords" content="NestJS,TypeORM"/>
</head>

## Entity 예시

```ts
import {
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  DeleteDateColumn,
  VersionColumn,
  Column,
  Index,
} from 'typeorm';

@Entity()
export class CrawlingTargetEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date;

  @VersionColumn()
  version: number;

  @Column({ type: 'varchar', length: 15, nullable: true })
  svc: string; 

  @Index()
  @Column({ type: 'varchar', length: 63, nullable: true })
  dirId: string; 

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  docId: number; 

  @Column({ type: 'varchar', length: 255, nullable: true })
  url: string;

  @Column({ type: 'boolean', default: false, nullable: true })
  isCrawled: boolean;

  @Column({ type: 'boolean', default: false, nullable: true })
  isRewrited: boolean;
}

```

## TypeOrmModule의 entities 추가

```ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HelloModule } from './hello/hello.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrawlingTargetEntity } from './crawlingTarget/entities/crawlingTarget.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      synchronize: process.env.NODE_ENV === 'dev' ? true : false,
      logging: true,
      ...(process.env.DATABASE_IS_SSL === '1' && {
        ssl: { rejectUnauthorized: process.env.DATABASE_NO_USE_CA === '1' },
      }),
      entities: [CrawlingTargetEntity],
    }),
    HelloModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

```