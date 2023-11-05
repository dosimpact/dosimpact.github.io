---
sidebar_position: 2
---

# NestJS env 설정

<head>
  <meta name="keywords" content="NestJS"/>
</head>

## env 개요

- Node.js에서 기본적으로 dotenv를 사용했었다.  
- Nest JS 에서도 환경변수를 다루는 빌트인 ConfigModule이 있다. 내부적으로 dotenv를 사용한다.   
- cross-env 설치 : 크로스 플렛폼의 env에 대응할 수 있다.    
    (각 플랫폼 별로 환경 변수를 먹이는 명령어가 다르지만 cross-env를 사용하면 된다.)   
- Joi env에 타입 및 유효성 검사  


<br/>

## 설치

```
npm i --save @nestjs/config  cross-env joi
or
yarn add @nestjs/config  cross-env joi
```

<br/>

### package.json 변경

- NODE_ENV라는 환경변수가 주입되어 프로세스가 실행 된다.

```
    "build": "cross-env NODE_ENV=production nest build",
    "start:dev": "cross-env NODE_ENV=dev nest start --watch",
    "start:prod": "cross-env NODE_ENV=production node dist/main",
```

<br/>

### .env 파일 생성

- 환경변수 파일을 만들자.
- local, dev, stage, qa, test, prod 등 각 환경에 맞게 환경변수를 만들 수 있다.

```
// 환경 변수 설정 파일 만들기
// .env.dev
hello=world
PORT=3001
```

<br/>

## configMoudle 장착


```js
// app.module.ts
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

// NODE_ENV는 cross-env에 주입되어 보이지만, 나머지는 ConfigModule에 의해 관리된다.
console.log('-->process.env.NODE_ENV', process.env.NODE_ENV);// dev
console.log('-->process.env.hello', process.env.hello); // undefined
console.log('-->process.env.PORT', process.env.PORT); // undefined

@Module({
  imports: [
    ConfigModule.forRoot({
      // 글로벌 모듈 선언
      isGlobal: true, 
      // 환경변수에 따른 .env파일 관리
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.prod',
      // heroku등 외부 sass에 의해 환경변수가 관리되는 경우
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      // Joi validator
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'production').default('dev'),
        PORT: Joi.number().default(3000),
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

<br/>

### Joi

- joi , The most powerful schema description language and data validator for JavaScript.
- JS 모듈이고 index.d.ts 로 정의됨 > 임포트시 * 사용할것

```js
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'production').default('dev'),
        PORT: Joi.number().default(3000),
      }),
    }),
```

<br/>

## configMoudle 사용

global module로 선언을 했기떄문에, 서비스의 생성자에서 configService를 주입받을 수 있다.  

```js
// users.service.ts
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(private readonly config: ConfigService) {}

  findAll() {
    // -->this.config.get('hello') world
    console.log("-->this.config.get('hello')", this.config.get('hello'));

    return `This action returns all users`;
  }
}

```
<br/>

### main.ts에서 configService 사용

```js
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { log } from 'console';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  log('-->port', port); // 3001

  await app.listen(port || 3000);
}
bootstrap();

```

<br/>


## 요약 및 예제

요약
- cross-env로 NODE_ENV 주입
- DB 정보를 .env로 옮김
- joi 로 유효성 검사 실행
- DB 는 하나의 URL 로 만들어 두는 것을 추천 ( heroku 랑 같은 env value로 두면 편함 )


```js
import { Module } from '@nestjs/common';
import * as Joi from 'joi';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantsModule } from './restaurants/restaurants.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === "dev" ? ".env.dev" : ".env.test",
      ignoreEnvFile: process.env.NODE_ENV === 'prod', // 다른방법으로 env를 얻는다. heroku 설정등
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod'),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(), // 처음에는 string으로 들어옴
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
      })
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: true,//join(process.cwd(), 'src/schema.gql'),
    }),
    TypeOrmModule.forRoot({
      "type": "postgres",
      "host": process.env.DB_HOST,
      "port": +process.env.DB_PORT, // env 설정은 string으로 온다. + 를 붙이면 number가 된다.
      "username": process.env.DB_USERNAME,
      "password": process.env.DB_PASSWORD,
      "database": process.env.DB_NAME,
      "synchronize": true, // db연결과 동시에 model migration 실행
      "logging": true,
    }),
    RestaurantsModule,],
  controllers: [],
  providers: [],
})
export class AppModule { }

```
<br/>

## ref

https://docs.nestjs.com/techniques/configuration  
https://www.npmjs.com/package/cross-env  
https://www.npmjs.com/package/joi  

