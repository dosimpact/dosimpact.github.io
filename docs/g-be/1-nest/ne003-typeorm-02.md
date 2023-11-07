---
sidebar_position: 4
---

# NestJS TypeOrmModule

<head>
  <meta name="keywords" content="NestJS,TypeORM"/>
</head>


## TypeORM 소개



장점

- Class Entity에 데이코레이터로 쉽게 모델링 혹은 타이핑이 가능하다.  
- Class Entity로 모델 정의 및 커스텀 함수로 추가,업데이트 전 비즈니스 로직 추가 가능  
- 레파지토리 커스터마이징 가능
- CRUD 일련의 기능을 묶을 수 있음
- NodeJS 백서버 뿐만 아니라, 브라우져 , React Native 에서도 직접 사용 가능
- 다양한 DB와 연동 가능 ( mysql, postgresql, .. )


단점 

- 0.3.17 라는 버전     
- 많은 기능 추가중 ( eg min, max, sum 기능 없음 ) > 쿼리빌더를 이용해야함   


## install

```
yarn add @nestjs/typeorm typeorm pg
```

```
# .env.dev
DATABASE_URL=postgres://<userid-postgres>:<password>@<host>:<port>/<dbname>
DATABASE_IS_SSL=0
DATABASE_NO_USE_CA=1
```

```ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HelloModule } from './hello/hello.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.prod',
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'production').default('dev'),
        PORT: Joi.number().default(3000),
        DATABASE_URL: Joi.string().required(),
        DATABASE_IS_SSL: Joi.number().required(),
        DATABASE_NO_USE_CA: Joi.number().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      synchronize: process.env.NODE_ENV === 'dev' ? true : false,
      logging: true,
      ...(process.env.DATABASE_IS_SSL === '1' && {
        ssl: { rejectUnauthorized: process.env.DATABASE_NO_USE_CA === '1' },
      }),
    }),
    HelloModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

```



## 참조 문서
https://typeorm.io/#/  
https://github.com/typeorm/typeorm/tree/master/docs.  
https://typeorm.io/#/many-to-one-one-to-many-relations.  
https://orkhan.gitbook.io/typeorm/ 
