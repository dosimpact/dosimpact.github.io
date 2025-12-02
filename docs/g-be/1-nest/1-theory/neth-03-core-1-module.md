---
sidebar_position: 3
---

# NestJS - 모듈  

Nest.js의 모듈 개념   

📌 모듈은 여러 맥락에서 나오는 용어이다.  
- 흔이 아는 ES6 모듈과 CommonJS 모듈, 여기서 모듈은 파일 단위의 격리을 의미함, 파일 단위 의존성 및 재사용을 관리한다.  
- NestJS의 모듈은 프레임워크가 객체 수준의 격리(유지보수) 및 의존성, 재사용을 관리한다.  
- NestJS의 모듈 시스템이 없다면, 규모가 커질수록 테스트, 재사용성, 유지보수(격벽)가 어려워진다.
  - 테스트 => 어떤 코드들은 테스트가 완성되었으니 믿고 써도 되는 단위  
  - => 재사용성, 기능 격리(설계)가 자동으로 완성된다. 
- NestJS의 모듈은 다수의 인스턴스들을 묶음 관리하는 단위이며 컨테이너라고도 부른다.  


📌 NestJS 모듈 시스템

모듈 = 클래스이다. (인스턴스 아님)  
- 모듈은 설계도 역할  
- 실제 인스턴스는 Provider(Service, Repository 등)만 생성됨  
  - 1, 모듈 클래스는 인스턴스화되지 않음 - 설계도 역할만
  - 2, forRoot - 전역 싱글톤 Provider 생성 (DataSource 등)
  - 3, forFeature - 전역 리소스 재사용 + 부분 Provider 생성 (Repository 등)
  - 4, register - 독립적인 Provider 생성 (매번 새로 생성)
  - 5, 실제 인스턴스는 Provider만 생성됨 (Service, Repository, Controller 등)



1, forRoot() - 전역 싱글톤 설정  
- 앱 전체에서 하나의 인스턴스만 생성  
- 전역 DI 컨테이너에 등록, 다른 모듈에서 공유  

```typescript
// TypeOrmModule 구현
@Module({})
export class TypeOrmModule {
  static forRoot(options: DbOptions): DynamicModule {
    return {
      module: TypeOrmModule,  // 클래스 참조 (인스턴스 아님)
      global: true,           // 전역 등록
      providers: [
        {
          provide: DataSource,
          useFactory: async () => {
            // DataSource 인스턴스 생성 (싱글톤)
            const dataSource = new DataSource({
              type: options.type,
              host: options.host,
              port: options.port,
              database: options.database
            });
            await dataSource.initialize();
            return dataSource;
          }
        }
      ],
      exports: [DataSource]
    };
  }
}
---
// 사용 예시
// AppModule - 한 번만 호출
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      database: 'mydb'
    })
  ]
})
export class AppModule {}

// 생성되는 것:
// ✓ DataSource 인스턴스 1개 (전역 싱글톤)
// ✗ TypeOrmModule 인스턴스 (생성 안 됨)
```

2, forFeature() - 부분 리소스 등록

개념
- forRoot의 전역 인스턴스를 재사용
- 각 모듈에 필요한 Repository는 모듈별로 독립적인 Repository 인스턴스 생성  

```typescript
@Module({})
export class TypeOrmModule {
  static forFeature(entities: EntityClass[]): DynamicModule {
    return {
      module: TypeOrmModule,
      providers: entities.map(entity => ({
        provide: `${entity.name}Repository`,
        useFactory: (dataSource: DataSource) => {
          // forRoot의 DataSource를 주입받아 Repository 생성
          return dataSource.getRepository(entity);
        },
        inject: [DataSource]  // 전역 DataSource 주입
      })),
      exports: entities.map(entity => `${entity.name}Repository`)
    };
  }
}
// 사용 예시, UserModule
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Profile])
  ]
})
export class UserModule {}
// --- ProductModule
@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category])
  ]
})
export class ProductModule {}

// 생성되는 것:
// ✓ Repository<User> 인스턴스 (UserModule용)
// ✓ Repository<Profile> 인스턴스 (UserModule용)
// ✓ Repository<Product> 인스턴스 (ProductModule용)
// ✓ Repository<Category> 인스턴스 (ProductModule용)
// → 모두 같은 DataSource 사용 (공유)
```

1. register() - 독립 인스턴스
- 호출할 때마다 새로운 인스턴스 생성
- 모듈 간 공유 안 함
- 각 모듈이 독립적인 설정 보유

```typescript
@Module({})
export class LoggerModule {
  static register(options: LoggerOptions): DynamicModule {
    return {
      module: LoggerModule,
      providers: [
        {
          provide: 'LOGGER_OPTIONS',
          useValue: options  // 각 모듈마다 다른 옵션
        },
        {
          provide: LoggerService,
          useFactory: (opts) => {
            // 매번 새로운 LoggerService 인스턴스 생성
            return new LoggerService(opts);
          },
          inject: ['LOGGER_OPTIONS']
        }
      ],
      exports: [LoggerService]
    };
  }
}
// 사용 예시
// UserModule
@Module({
  imports: [
    LoggerModule.register({ level: 'debug', prefix: 'USER' })
  ]
})
export class UserModule {}

// PaymentModule
@Module({
  imports: [
    LoggerModule.register({ level: 'error', prefix: 'PAYMENT' })
  ]
})
export class PaymentModule {}

// 생성되는 것:
// ✓ LoggerService 인스턴스 1 (UserModule용, debug)
// ✓ LoggerService 인스턴스 2 (PaymentModule용, error)
// → 독립적, 공유 안 함
```

메모리 구조 시각화

```
전역 DI 컨테이너
├─ DataSource (싱글톤) ← forRoot로 생성
│
UserModule DI 컨테이너
├─ Repository<User> ← forFeature로 생성 (DataSource 참조)
├─ Repository<Profile> ← forFeature로 생성 (DataSource 참조)
├─ LoggerService (독립) ← register로 생성
├─ UserService
└─ UserController
│
ProductModule DI 컨테이너
├─ Repository<Product> ← forFeature로 생성 (DataSource 참조)
├─ LoggerService (독립) ← register로 생성
└─ ProductService
```

## 비교 표

| 메서드 | 인스턴스 생성 | 공유 여부 | 용도 |
|--------|-------------|----------|------|
| forRoot | 1개 (전역) | ✓ 전체 공유 | DB 연결, 설정 |
| forFeature | 모듈마다 생성 | ✓ 전역 리소스 재사용 | Repository, Schema |
| register | 호출마다 생성 | ✗ 독립 | Logger, Cache |


```js
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),  // 다른 모듈의 인스턴스를 가져와서 활용한다.  
    EmailModule,
    AuthModule
  ],
  // 이 모듈의 컨트롤러이며, 생성자를 통해 만든다.  
  controllers: [UserController],  
  // 이 모듈의 서비스이며, 생성자를 통해 만든다.  
  // - 혹여나 다른 모듈의 UserService가 있다라면 그것은 다른 인스턴스이다.
  // - 그러나, EmailModule은 같은 인스턴스를 바라보고 있다. 즉 같은 상태를 유지하고 있음.  
  providers: [
    UserService,          
    UserRepository
  ],
  // 다른 모듈에서 사용 가능하도록 공개하는 인스턴스  
  exports: [UserService]  
})
export class UserModule {}
```


📌 DI 컨테이너는 Dependency Injection Container의 약자
  - 인스턴스들을 담아두고 필요할 때 자동으로 꺼내서 주입해주는 시스템이라서 "컨테이너"라고 부른다.  

```
NestJS 애플리케이션
  │
  ├─ DI 컨테이너 (NestJS 프레임워크가 관리) // NestJS가 내부적으로 관리하는 인스턴스 저장소  
  │   ├─ 전역 컨테이너
  │   ├─ UserModule용 컨테이너
  │   ├─ ProductModule용 컨테이너
  │   └─ ...
  │
  └─ 모듈들 (설계도)                    // 내용: "어떤 Provider를 등록할지" 선언
      ├─ AppModule
      ├─ UserModule
      └─ ProductModule
```

정적 모듈과 동적 모듈  
- 동적 모듈을 모듈 생성시 런타임에 설정을 받아서 모듈 생성이 가능하다.  
- 대표적으로 databaseModule, db_host, db_port등의 정보는 런타임에 결정되므로 동적 모듈로 생성한다.   
- 동적으로 설정되는 모듈을 더 재사용성이 좋다.  


NestJS Dynamic Module 메서드 개념 정리  
- 정적, 동적 모듈을 만들 때 방법은 여러가지가 있다.  
- forRoot(): 본사에서 전체 매장이 사용할 커피머신, 레시피 설정 (한 번만)   
- forFeature(): 각 지점에서 필요한 메뉴만 추가 (지점마다 다름)  
- register(): 각 지점이 완전히 독립적인 커피머신 구매 (공유 안함)    

