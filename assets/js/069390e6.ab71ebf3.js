"use strict";(self.webpackChunkdosimpact_blog=self.webpackChunkdosimpact_blog||[]).push([[7271],{3905:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>y});var r=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},l=Object.keys(e);for(r=0;r<l.length;r++)n=l[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(r=0;r<l.length;r++)n=l[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var s=r.createContext({}),p=function(e){var t=r.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},u=function(e){var t=p(e.components);return r.createElement(s.Provider,{value:t},e.children)},m="mdxType",c={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,l=e.originalType,s=e.parentName,u=i(e,["components","mdxType","originalType","parentName"]),m=p(n),d=o,y=m["".concat(s,".").concat(d)]||m[d]||c[d]||l;return n?r.createElement(y,a(a({ref:t},u),{},{components:n})):r.createElement(y,a({ref:t},u))}));function y(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var l=n.length,a=new Array(l);a[0]=d;var i={};for(var s in t)hasOwnProperty.call(t,s)&&(i[s]=t[s]);i.originalType=e,i[m]="string"==typeof e?e:o,a[1]=i;for(var p=2;p<l;p++)a[p]=n[p];return r.createElement.apply(null,a)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},7735:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>a,default:()=>c,frontMatter:()=>l,metadata:()=>i,toc:()=>p});var r=n(7462),o=(n(7294),n(3905));const l={sidebar_position:5},a="NestJS TypeORM Entity 1",i={unversionedId:"g-be/nest/ne003-typeorm-03",id:"g-be/nest/ne003-typeorm-03",title:"NestJS TypeORM Entity 1",description:"Entity \uc608\uc2dc",source:"@site/docs/g-be/1-nest/ne003-typeorm-03.md",sourceDirName:"g-be/1-nest",slug:"/g-be/nest/ne003-typeorm-03",permalink:"/docs/g-be/nest/ne003-typeorm-03",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/g-be/1-nest/ne003-typeorm-03.md",tags:[],version:"current",sidebarPosition:5,frontMatter:{sidebar_position:5},sidebar:"backEnd",previous:{title:"NestJS TypeOrmModule",permalink:"/docs/g-be/nest/ne003-typeorm-02"}},s={},p=[{value:"Entity \uc608\uc2dc",id:"entity-\uc608\uc2dc",level:2},{value:"TypeOrmModule\uc758 entities \ucd94\uac00",id:"typeormmodule\uc758-entities-\ucd94\uac00",level:2}],u={toc:p},m="wrapper";function c(e){let{components:t,...n}=e;return(0,o.kt)(m,(0,r.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"nestjs-typeorm-entity-1"},"NestJS TypeORM Entity 1"),(0,o.kt)("head",null,(0,o.kt)("meta",{name:"keywords",content:"NestJS,TypeORM"})),(0,o.kt)("h2",{id:"entity-\uc608\uc2dc"},"Entity \uc608\uc2dc"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"import {\n  Entity,\n  PrimaryGeneratedColumn,\n  UpdateDateColumn,\n  CreateDateColumn,\n  DeleteDateColumn,\n  VersionColumn,\n  Column,\n  Index,\n} from 'typeorm';\n\n@Entity()\nexport class CrawlingTargetEntity {\n  @PrimaryGeneratedColumn()\n  id: number;\n\n  @CreateDateColumn({ type: 'timestamptz' })\n  createdAt: Date;\n\n  @UpdateDateColumn({ type: 'timestamptz' })\n  updatedAt: Date;\n\n  @DeleteDateColumn({ type: 'timestamptz' })\n  deletedAt: Date;\n\n  @VersionColumn()\n  version: number;\n\n  @Column({ type: 'varchar', length: 15, nullable: true })\n  svc: string; \n\n  @Index()\n  @Column({ type: 'varchar', length: 63, nullable: true })\n  dirId: string; \n\n  @Index({ unique: true })\n  @Column({ type: 'varchar', length: 255, nullable: true })\n  docId: number; \n\n  @Column({ type: 'varchar', length: 255, nullable: true })\n  url: string;\n\n  @Column({ type: 'boolean', default: false, nullable: true })\n  isCrawled: boolean;\n\n  @Column({ type: 'boolean', default: false, nullable: true })\n  isRewrited: boolean;\n}\n\n")),(0,o.kt)("h2",{id:"typeormmodule\uc758-entities-\ucd94\uac00"},"TypeOrmModule\uc758 entities \ucd94\uac00"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"import { Module } from '@nestjs/common';\nimport { AppController } from './app.controller';\nimport { AppService } from './app.service';\nimport { HelloModule } from './hello/hello.module';\nimport { UsersModule } from './users/users.module';\nimport { ConfigModule } from '@nestjs/config';\nimport * as Joi from 'joi';\nimport { TypeOrmModule } from '@nestjs/typeorm';\nimport { CrawlingTargetEntity } from './crawlingTarget/entities/crawlingTarget.entity';\n\n@Module({\n  imports: [\n    TypeOrmModule.forRoot({\n      type: 'postgres',\n      url: process.env.DATABASE_URL,\n      synchronize: process.env.NODE_ENV === 'dev' ? true : false,\n      logging: true,\n      ...(process.env.DATABASE_IS_SSL === '1' && {\n        ssl: { rejectUnauthorized: process.env.DATABASE_NO_USE_CA === '1' },\n      }),\n      entities: [CrawlingTargetEntity],\n    }),\n    HelloModule,\n    UsersModule,\n  ],\n  controllers: [AppController],\n  providers: [AppService],\n})\nexport class AppModule {}\n\n")))}c.isMDXComponent=!0}}]);