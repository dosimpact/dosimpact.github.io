"use strict";(self.webpackChunkdosimpact_blog=self.webpackChunkdosimpact_blog||[]).push([[3684],{3905:(e,t,a)=>{a.d(t,{Zo:()=>u,kt:()=>N});var n=a(67294);function i(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function r(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function s(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?r(Object(a),!0).forEach((function(t){i(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):r(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function o(e,t){if(null==e)return{};var a,n,i=function(e,t){if(null==e)return{};var a,n,i={},r=Object.keys(e);for(n=0;n<r.length;n++)a=r[n],t.indexOf(a)>=0||(i[a]=e[a]);return i}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(n=0;n<r.length;n++)a=r[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(i[a]=e[a])}return i}var l=n.createContext({}),d=function(e){var t=n.useContext(l),a=t;return e&&(a="function"==typeof e?e(t):s(s({},t),e)),a},u=function(e){var t=d(e.components);return n.createElement(l.Provider,{value:t},e.children)},p="mdxType",c={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var a=e.components,i=e.mdxType,r=e.originalType,l=e.parentName,u=o(e,["components","mdxType","originalType","parentName"]),p=d(a),m=i,N=p["".concat(l,".").concat(m)]||p[m]||c[m]||r;return a?n.createElement(N,s(s({ref:t},u),{},{components:a})):n.createElement(N,s({ref:t},u))}));function N(e,t){var a=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var r=a.length,s=new Array(r);s[0]=m;var o={};for(var l in t)hasOwnProperty.call(t,l)&&(o[l]=t[l]);o.originalType=e,o[p]="string"==typeof e?e:i,s[1]=o;for(var d=2;d<r;d++)s[d]=a[d];return n.createElement.apply(null,s)}return n.createElement.apply(null,a)}m.displayName="MDXCreateElement"},36343:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>l,contentTitle:()=>s,default:()=>c,frontMatter:()=>r,metadata:()=>o,toc:()=>d});var n=a(87462),i=(a(67294),a(3905));const r={sidebar_position:3},s="Supabase DDL",o={unversionedId:"g-fe/next+supa/next3-DDL-2",id:"g-fe/next+supa/next3-DDL-2",title:"Supabase DDL",description:"- Supabase DDL",source:"@site/docs/g-fe/6-next+supa/next3-DDL-2.md",sourceDirName:"g-fe/6-next+supa",slug:"/g-fe/next+supa/next3-DDL-2",permalink:"/docs/g-fe/next+supa/next3-DDL-2",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/g-fe/6-next+supa/next3-DDL-2.md",tags:[],version:"current",sidebarPosition:3,frontMatter:{sidebar_position:3},sidebar:"frontEnd",previous:{title:"Supabase Concepts",permalink:"/docs/g-fe/next+supa/next1-concept"},next:{title:"Supabase DDL Template",permalink:"/docs/g-fe/next+supa/next3-DDL-3"}},l={},d=[{value:"Basic",id:"basic",level:2},{value:"\ud83d\udccc Datatype",id:"-datatype",level:3},{value:"\ud83d\udccc \uceec\ub7fc \uc124\uc815",id:"-\uceec\ub7fc-\uc124\uc815",level:3},{value:"Snippets",id:"snippets",level:3},{value:"\ud83d\udccc Todo Table DDL (without RLS)",id:"-todo-table-ddl-without-rls",level:2},{value:"\ud83d\udccc Todo Table DML (without RLS)",id:"-todo-table-dml-without-rls",level:2},{value:"REST API",id:"rest-api",level:3},{value:"\ucc38\uace0) \ub2e4\ub978 \uc2a4\ud0a4\ub9c8 \uc870\ud68c\ud558\ub294 \ubc95",id:"\ucc38\uace0-\ub2e4\ub978-\uc2a4\ud0a4\ub9c8-\uc870\ud68c\ud558\ub294-\ubc95",level:3},{value:"Todos with RLS (in editor)",id:"todos-with-rls-in-editor",level:2},{value:"DDL with editor",id:"ddl-with-editor",level:3}],u={toc:d},p="wrapper";function c(e){let{components:t,...r}=e;return(0,i.kt)(p,(0,n.Z)({},u,r,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"supabase-ddl"},"Supabase DDL"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#supabase-ddl"},"Supabase DDL"),(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#basic"},"Basic"),(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#-datatype"},"\ud83d\udccc Datatype")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#-%EC%BB%AC%EB%9F%BC-%EC%84%A4%EC%A0%95"},"\ud83d\udccc \uceec\ub7fc \uc124\uc815")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#snippets"},"Snippets")))),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#-todo-table-ddl-without-rls"},"\ud83d\udccc Todo Table DDL (without RLS)")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#-todo-table-dml-without-rls"},"\ud83d\udccc Todo Table DML (without RLS)"),(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#rest-api"},"REST API")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#%EC%B0%B8%EA%B3%A0-%EB%8B%A4%EB%A5%B8-%EC%8A%A4%ED%82%A4%EB%A7%88-%EC%A1%B0%ED%9A%8C%ED%95%98%EB%8A%94-%EB%B2%95"},"\ucc38\uace0) \ub2e4\ub978 \uc2a4\ud0a4\ub9c8 \uc870\ud68c\ud558\ub294 \ubc95")))),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#todos-with-rls-in-editor"},"Todos with RLS (in editor)"),(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#ddl-with-editor"},"DDL with editor"))))))),(0,i.kt)("h2",{id:"basic"},"Basic"),(0,i.kt)("h3",{id:"-datatype"},"\ud83d\udccc Datatype"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"boolean"),(0,i.kt)("li",{parentName:"ul"},"integer = int4 / bigint = int8 / numeric -- \uc790\ub3d9 / numeric(5, 2) -- \ucd5c\ub300 5\uc790\ub9ac \uc22b\uc790, \uc18c\uc218\uc810 \uc774\ud558 2\uc790\ub9ac  "),(0,i.kt)("li",{parentName:"ul"},"varchar(32), text  "),(0,i.kt)("li",{parentName:"ul"},"uuid"),(0,i.kt)("li",{parentName:"ul"},"timestamp with time zone  "),(0,i.kt)("li",{parentName:"ul"},"json, jsonb\nRef : ",(0,i.kt)("a",{parentName:"li",href:"https://supabase.com/docs/guides/database/tables?queryGroups=database-method&database-method=sql&queryGroups=language&language=js#data-types"},"https://supabase.com/docs/guides/database/tables?queryGroups=database-method&database-method=sql&queryGroups=language&language=js#data-types"),"    ")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-sql"},'  "isNotified" boolean\n  "id" integer\n  "id" bigint\n  "price" numeric\n  "title" VARCHAR(255)\n  "website" text\n  "id" uuid\n  "updated_at" timestamp with time zone\n    "content" json \n  "content" jsonb \n')),(0,i.kt)("h3",{id:"-\uceec\ub7fc-\uc124\uc815"},"\ud83d\udccc \uceec\ub7fc \uc124\uc815"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"PK, FK, CONSTRAINT  "),(0,i.kt)("li",{parentName:"ul"},"generated by default as identity"),(0,i.kt)("li",{parentName:"ul"},"DEFAULT false | gen_random_uuid() | now()"),(0,i.kt)("li",{parentName:"ul"},"NOT NULL"),(0,i.kt)("li",{parentName:"ul"},"UNIQUE  ")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-sql"},'-- PK, FK, CONSTRAINT  \n  "id" bigint generated by default as identity primary key\n  \n  "id" bigint generated by default as identity NOT NULL\n  CONSTRAINT "gpts_quration_id_pk" PRIMARY KEY("id")\n\n  "id" uuid DEFAULT gen_random_uuid() NOT NULL\n    CONSTRAINT "suggestion_id_pk" PRIMARY KEY("id")\n\n\n  ALTER TABLE public.chat\n  ADD CONSTRAINT "chat_userId_profiles_id_fk"\n  FOREIGN KEY ("userId") \n  REFERENCES public.profiles(id) \n  ON DELETE NO ACTION ON UPDATE NO ACTION;\n\n-- generated by default as identity\n  "logId" uuid DEFAULT gen_random_uuid() NOT NULL\n\n-- DEFAULT false | gen_random_uuid() | now()\n  "isResolved" boolean DEFAULT false\n    "id" uuid DEFAULT gen_random_uuid()\n    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,\n\n-- NOT NULL\n  "userId" uuid NOT NULL\n    "documentCreatedAt" timestamp with time zone NOT NULL,\n    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,\n    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,\n    "deletedAt" timestamp with time zone NULL\n\n-- UNIQUE  \n  "username" text unique\n')),(0,i.kt)("h3",{id:"snippets"},"Snippets"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-sql"},'-- bigint pk \n    "id" bigint generated by default as identity NOT NULL,\n    CONSTRAINT "gpts_quration_id_pk" PRIMARY KEY("id")\n\n-- uuid pk\n    "id" uuid DEFAULT gen_random_uuid() NOT NULL,\n    CONSTRAINT "suggestion_id_pk" PRIMARY KEY("id")\n\n-- PL/pgSQL Block fk\nDO $$ BEGIN\n    ALTER TABLE public.chat\n    ADD CONSTRAINT "chat_userId_profiles_id_fk"\n    FOREIGN KEY ("userId") REFERENCES public.profiles(id) ON DELETE NO ACTION ON UPDATE NO ACTION;\nEXCEPTION\n    WHEN duplicate_object THEN NULL;\nEND $$; \n\n-- timestamps\n    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,\n    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,\n    "deletedAt" timestamp with time zone NULL\n')),(0,i.kt)("h2",{id:"-todo-table-ddl-without-rls"},"\ud83d\udccc Todo Table DDL (without RLS)"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-Sql"},"CREATE TABLE todos (\n    id uuid DEFAULT gen_random_uuid(),  -- UUID\ub85c \uace0\uc720 \uc2dd\ubcc4\uc790\n    -- id uuid PRIMARY KEY DEFAULT gen_random_uuid()\n    user_id uuid NOT NULL,  -- \uc0ac\uc6a9\uc790 ID (\ud544\uc218)\n    -- user_id uuid REFERENCES auth.users(id) NOT NULL\n    title varchar(32) NOT NULL UNIQUE,  -- \ud560 \uc77c \uc81c\ubaa9 (\uace0\uc720, \ud544\uc218)\n    description text,  -- \ud560 \uc77c \uc124\uba85 (\uc120\ud0dd\uc801)\n    is_completed boolean DEFAULT false,  -- \uc644\ub8cc \uc5ec\ubd80 (\uae30\ubcf8\uac12 false)\n    priority integer CHECK (priority >= 1 AND priority <= 5),  -- \uc6b0\uc120\uc21c\uc704 (1~5)\n    due_date timestamp with time zone,  -- \ub9c8\uac10\uc77c\n    created_at timestamp with time zone DEFAULT now(),  -- \uc0dd\uc131 \uc2dc\uac04\n    updated_at timestamp with time zone DEFAULT now(),  -- \uc5c5\ub370\uc774\ud2b8 \uc2dc\uac04\n    metadata jsonb,  -- \ucd94\uac00 \uba54\ud0c0\ub370\uc774\ud130\n    CONSTRAINT todos_pkey PRIMARY KEY (id),  -- \uae30\ubcf8 \ud0a4 \uc81c\uc57d \uc870\uac74\n    CONSTRAINT todos_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)  -- \uc678\ub798 \ud0a4 \uc81c\uc57d \uc870\uac74\n);\n---\nCREATE TABLE todos (\n    id uuid DEFAULT gen_random_uuid(),  \n    title varchar(32) NOT NULL,  \n    description text,  \n    is_completed boolean DEFAULT false,  \n    created_at timestamp with time zone DEFAULT now(),  \n    updated_at timestamp with time zone DEFAULT now(),  \n    CONSTRAINT todos_pkey PRIMARY KEY (id),  \n);\n")),(0,i.kt)("h2",{id:"-todo-table-dml-without-rls"},"\ud83d\udccc Todo Table DML (without RLS)"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},'[READ]\nselect * from public."todos";\n\n-- id\ub97c \ub0b4\ub9bc\ucc28 \uc21c\uc73c\ub85c public."todos" \uc870\ud68c \ud574\uc918\nselect  * from public."todos" order by id desc;\n\n-- public."todos" \uc5d0\uc11c deleted_at\uc774 null \uc778\uac83\ub9cc \ubaa8\ub450 \uc870\ud68c\ud574\nselect  * from  public."todos" where  deleted_at is null;\n\n-- \ube68\ub798\ub77c\ub294 \ub2e8\uc5b4\uac00 \ud3ec\ud568\ub418\ub294 \uc870\uac74\uc744 \ucd94\uac00\ud574\uc918  \nselect * from  public."todos" where  deleted_at is null and title like \'%\ube68\ub798%\';\n\n[CREATE]\ninsert into  public."todos" (title) values  (\'\ube68\ub798\ub97c \uc138\ud0c1\ud558\uae30\');\n\n[UPDATE]\n-- title \uac12\uc744 \uc5c5\ub370\uc774\ud2b8\ud558\ub294 sql \uad6c\ubb38 \ub9cc\ub4e4\uc5b4\uc918\nupdate public."todos" set title = \'\uc2e0\ubc1c \uc138\ud0c1 2\' where  id = 5;\n\n-- updated_at \uc744 \ud604\uc7ac\uc2dc\uac04\uc73c\ub85c \uc5c5\ub370\uc774\ud2b8 \ud558\ub294 update \uad6c\ubb38 \ub9cc\ub4e4\uc5b4\uc918\nupdate public."todos" set  title = \'\uc2e0\ubc1c \uc138\ud0c1 2\', updated_at = current_timestamp where  id = 5;\n\n[Delete]\n-- \ud2b9\uc815 \ud589\uc744 \uc9c0\uc6b0\ub294 \uad6c\ubb38 \ub9cc\ub4e4\uc5b4\uc918\ndelete from public."todos" where id = 5;\n')),(0,i.kt)("h3",{id:"rest-api"},"REST API"),(0,i.kt)("p",null,(0,i.kt)("img",{alt:"Alt text",src:a(92779).Z,width:"2880",height:"1178"})),(0,i.kt)("p",null,"Check API Docs"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},'Read all rows\ncurl \'https://YOURS.supabase.co/rest/v1/todos?select=*\' \\\n-H "apikey: SUPABASE_KEY"\n\nRead specific columns\ncurl \'https://YOURS.supabase.co/rest/v1/todos?select=some_column,other_column\' \\\n-H "apikey: SUPABASE_KEY"\n\nRead referenced tables\ncurl \'https://YOURS.supabase.co/rest/v1/todos?select=some_column,other_table(foreign_key)\' \\\n-H "apikey: SUPABASE_KEY"\n\nWith pagination\ncurl \'https://YOURS.supabase.co/rest/v1/todos?select=*\' \\\n-H "apikey: SUPABASE_KEY" \\\n-H "Range: 0-9"\n\nWith filtering\ncurl \'https://YOURS.supabase.co/rest/v1/todos?id=eq.1&select=*\' \\\n-H "apikey: SUPABASE_KEY" \\\n-H "Range: 0-9"\n')),(0,i.kt)("h3",{id:"\ucc38\uace0-\ub2e4\ub978-\uc2a4\ud0a4\ub9c8-\uc870\ud68c\ud558\ub294-\ubc95"},"\ucc38\uace0) \ub2e4\ub978 \uc2a4\ud0a4\ub9c8 \uc870\ud68c\ud558\ub294 \ubc95"),(0,i.kt)("p",null,"Ref : ",(0,i.kt)("a",{parentName:"p",href:"https://supabase.com/docs/guides/api/using-custom-schemas"},"https://supabase.com/docs/guides/api/using-custom-schemas")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"1.\nSettings > Exposed schemas\uc5d0 \ub178\ucd9c\ud560  \ucd94\uac00\ud558\uae30\n\n---\n2.\nGRANT USAGE ON SCHEMA myschema TO anon, authenticated, service_role;\nGRANT ALL ON ALL TABLES IN SCHEMA myschema TO anon, authenticated, service_role;\nGRANT ALL ON ALL ROUTINES IN SCHEMA myschema TO anon, authenticated, service_role;\nGRANT ALL ON ALL SEQUENCES IN SCHEMA myschema TO anon, authenticated, service_role;\nALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA myschema GRANT ALL ON TABLES TO anon, authenticated, service_role;\nALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA myschema GRANT ALL ON ROUTINES TO anon, authenticated, service_role;\nALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA myschema GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;\n\n---\n3.\ncurl --location 'https://ID.supabase.co/rest/v1/todos?select=*' \\\n--header 'apikey: KEY' \\\n--header 'Accept-Profile: ai_chat_test'\n\n---\n4.\n// Initialize the JS client\nimport { createClient } from '@supabase/supabase-js'\nconst supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { db: { schema: 'myschema' } })\n\n// Make a request\nconst { data: todos, error } = await supabase.from('todos').select('*')\n\n// You can also change the target schema on a per-query basis\nconst { data: todos, error } = await supabase.schema('myschema').from('todos').select('*')\n\n")),(0,i.kt)("h2",{id:"todos-with-rls-in-editor"},"Todos with RLS (in editor)"),(0,i.kt)("h3",{id:"ddl-with-editor"},"DDL with editor"),(0,i.kt)("p",null,(0,i.kt)("img",{alt:"Alt text",src:a(93269).Z,width:"639",height:"471"})),(0,i.kt)("table",null,(0,i.kt)("thead",{parentName:"table"},(0,i.kt)("tr",{parentName:"thead"},(0,i.kt)("th",{parentName:"tr",align:null},"Add foreign key relation"),(0,i.kt)("th",{parentName:"tr",align:null},"Foreign Keys"))),(0,i.kt)("tbody",{parentName:"table"},(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},(0,i.kt)("img",{alt:"Alt text",src:a(86686).Z,width:"665",height:"944"})),(0,i.kt)("td",{parentName:"tr",align:null},(0,i.kt)("img",{alt:"Alt text",src:a(92316).Z,width:"670",height:"814"}))))))}c.isMDXComponent=!0},93269:(e,t,a)=>{a.d(t,{Z:()=>n});const n=a.p+"assets/images/image-4-bb75712d74abdcf639aaa7a5cc92e89c.png"},92779:(e,t,a)=>{a.d(t,{Z:()=>n});const n=a.p+"assets/images/image-6-06d19164206984e1d862d81333b5598e.png"},86686:(e,t,a)=>{a.d(t,{Z:()=>n});const n=a.p+"assets/images/image-3-30037089a67d2b14f8302285ae90a54f.png"},92316:(e,t,a)=>{a.d(t,{Z:()=>n});const n=a.p+"assets/images/image-4-a4391d4cbfb82565d28593e557e63ea5.png"}}]);