"use strict";(self.webpackChunkdosimpact_blog=self.webpackChunkdosimpact_blog||[]).push([[4018],{3905:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>h});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var l=r.createContext({}),u=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},c=function(e){var t=u(e.components);return r.createElement(l.Provider,{value:t},e.children)},p="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,l=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),p=u(n),m=a,h=p["".concat(l,".").concat(m)]||p[m]||d[m]||i;return n?r.createElement(h,o(o({ref:t},c),{},{components:n})):r.createElement(h,o({ref:t},c))}));function h(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,o=new Array(i);o[0]=m;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s[p]="string"==typeof e?e:a,o[1]=s;for(var u=2;u<i;u++)o[u]=n[u];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},2358:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>o,default:()=>d,frontMatter:()=>i,metadata:()=>s,toc:()=>u});var r=n(7462),a=(n(7294),n(3905));const i={sidebar_position:10},o="Supabase DDL",s={unversionedId:"g-fe/next/next010-1",id:"g-fe/next/next010-1",title:"Supabase DDL",description:"Row Level Security - RLS",source:"@site/docs/g-fe/5-next/next010-1.md",sourceDirName:"g-fe/5-next",slug:"/g-fe/next/next010-1",permalink:"/docs/g-fe/next/next010-1",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/g-fe/5-next/next010-1.md",tags:[],version:"current",sidebarPosition:10,frontMatter:{sidebar_position:10},sidebar:"frontEnd",previous:{title:"Supabase install",permalink:"/docs/g-fe/next/next009"},next:{title:"Supabase Client",permalink:"/docs/g-fe/next/next010-2"}},l={},u=[{value:"Row Level Security - RLS",id:"row-level-security---rls",level:3},{value:"anonClient/adminClient + RLS",id:"anonclientadminclient--rls",level:3},{value:"middleware",id:"middleware",level:2},{value:"example of tables",id:"example-of-tables",level:2},{value:"todos",id:"todos",level:3},{value:"stripe",id:"stripe",level:3}],c={toc:u},p="wrapper";function d(e){let{components:t,...n}=e;return(0,a.kt)(p,(0,r.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"supabase-ddl"},"Supabase DDL"),(0,a.kt)("h3",{id:"row-level-security---rls"},"Row Level Security - RLS"),(0,a.kt)("p",null,"RLS\ub294 \ud14c\uc774\ube14 \ub2e8\uc704\ub85c \uc801\uc6a9\uc2dc\ud0ac \uc218 \uc788\ub2e4.  "),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("p",{parentName:"li"},"enable\uc744 \ud558\ub294\uac83\uc744 \uac15\ub825\ud558\uac8c \ucd94\ucc9c.  ")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("p",{parentName:"li"},"RLS enalbe \ub418\uba74 RLS \uc815\ucc45\uc744 \ub9cc\ub4e4\uc5b4\uc57c \ud14c\uc774\ube14\uc744 \uc870\ud68c\ud560 \uc218 \uc788\ub2e4.  ")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("p",{parentName:"li"},'*"\ub204\uad6c\ub098 \uadf8 \ud14c\uc774\ube14\uc744 \uc77d\uc744 \uc218 \uc788\uc5b4 \ub77c\ub294 \uc815\ucc45"')),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("p",{parentName:"li"},"authenticated : \uc778\uc99d\ub41c \uc0ac\uc6a9\uc790\ub9cc ")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("p",{parentName:"li"},"anon : \ub204\uad6c\ub098  ")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("p",{parentName:"li"},"service_role : \uc5b4\ub4dc\ubbfc "))),(0,a.kt)("h3",{id:"anonclientadminclient--rls"},"anonClient/adminClient + RLS"),(0,a.kt)("p",null,"INSERT - anon - true : anonClient\uc4f0\uae30 \uac00\ub2a5",(0,a.kt)("br",{parentName:"p"}),"\n","INSERT - authenticated - true : anonClient\uac00 \ub85c\uadf8\uc778 \ud574\uc57c \uc4f0\uae30 \uac00\ub2a5",(0,a.kt)("br",{parentName:"p"}),"\n","INSERT : adminClient\ub294 RLS \uc815\ucc45\uc5d0 \uc601\ud5a5\uc5c6\uc774 \uc4f0\uae30 \uac00\ub2a5   "),(0,a.kt)("p",null,"*service_role \uc65c \uc788\ub294\uac70\uc9c0..?!\n// INSERT - service_role - true : adminClient \uc4f0\uae30 \uac00\ub2a5  "),(0,a.kt)("h2",{id:"middleware"},"middleware"),(0,a.kt)("p",null,"\ubbf8\ub4e4\uc6e8\uc5b4  "),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"\ud2b9\uc815 \uacbd\ub85c\uc5d0 \ub300\ud574\uc11c \ubbf8\ub4e4\uc6e8\uc5b4\ub97c \ud1b5\uacfc\uc2dc\ud0ac \uc218 \uc788\ub2e4.  "),(0,a.kt)("li",{parentName:"ul"},"\uc608\ub97c\ub4e4\uc5b4 \ub85c\uadf8\uc778 \ub41c \uc0ac\uc6a9\uc790\ub9cc \ub4e4\uc5b4\uc62c \uc218 \uc788\ub294 \uacbd\ub85c, ",(0,a.kt)("ul",{parentName:"li"},(0,a.kt)("li",{parentName:"ul"},"\ub85c\uadf8\uc778 \uc548\ub428, \ub85c\uadf8\uc778 \uc138\uc158 \ud480\ub9bc -> \ub2e4\uc2dc \ub85c\uadf8\uc778\ud558\ub77c\uace0 \ub85c\uadf8\uc778 \ud398\uc774\uc9c0\ub85c \ub9ac\ub2e4\uc774\ub809\ud2b8  ")))),(0,a.kt)("h2",{id:"example-of-tables"},"example of tables"),(0,a.kt)("h3",{id:"todos"},"todos"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-sql"},'--\n-- For use with:\n-- https://github.com/supabase/supabase/tree/master/examples/todo-list/sveltejs-todo-list or\n-- https://github.com/supabase/examples-archive/tree/main/supabase-js-v1/todo-list\n--\n\ncreate table todos (\n  id bigint generated by default as identity primary key,\n  user_id uuid references auth.users not null,\n  task text check (char_length(task) > 3),\n  is_complete boolean default false,\n  inserted_at timestamp with time zone default timezone(\'utc\'::text, now()) not null\n);\nalter table todos enable row level security;\n\ncreate policy "Individuals can create todos." on todos for\n    insert with check (auth.uid() = user_id);\n\ncreate policy "Individuals can view their own todos. " on todos for\n    select using (auth.uid() = user_id);\n\ncreate policy "Individuals can update their own todos." on todos for\n    update using (auth.uid() = user_id);\n\ncreate policy "Individuals can delete their own todos." on todos for\n    delete using (auth.uid() = user_id);\n\n')),(0,a.kt)("h3",{id:"stripe"},"stripe"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-sql"},"/**\n* USERS\n* Note: This table contains user data. Users should only be able to view and update their own data.\n*/\ncreate table users (\n  -- UUID from auth.users\n  id uuid references auth.users not null primary key,\n  full_name text,\n  avatar_url text,\n  -- The customer's billing address, stored in JSON format.\n  billing_address jsonb,\n  -- Stores your customer's payment instruments.\n  payment_method jsonb\n);\nalter table users\n  enable row level security;\ncreate policy \"Can view own user data.\" on users\n  for select using (auth.uid() = id);\ncreate policy \"Can update own user data.\" on users\n  for update using (auth.uid() = id);\n\n/**\n* This trigger automatically creates a user entry when a new user signs up via Supabase Auth.\n*/\ncreate function public.handle_new_user()\nreturns trigger as\n$$\n  begin\n    insert into public.users (id, full_name, avatar_url)\n    values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');\n    return new;\n  end;\n$$\nlanguage plpgsql security definer;\n\ncreate trigger on_auth_user_created\n  after insert on auth.users\n  for each row\n    execute procedure public.handle_new_user();\n\n/**\n* CUSTOMERS\n* Note: this is a private table that contains a mapping of user IDs to Strip customer IDs.\n*/\ncreate table customers (\n  -- UUID from auth.users\n  id uuid references auth.users not null primary key,\n  -- The user's customer ID in Stripe. User must not be able to update this.\n  stripe_customer_id text\n);\nalter table customers enable row level security;\n-- No policies as this is a private table that the user must not have access to.\n\n/**\n* PRODUCTS\n* Note: products are created and managed in Stripe and synced to our DB via Stripe webhooks.\n*/\ncreate table products (\n  -- Product ID from Stripe, e.g. prod_1234.\n  id text primary key,\n  -- Whether the product is currently available for purchase.\n  active boolean,\n  -- The product's name, meant to be displayable to the customer. Whenever this product is sold via a subscription, name will show up on associated invoice line item descriptions.\n  name text,\n  -- The product's description, meant to be displayable to the customer. Use this field to optionally store a long form explanation of the product being sold for your own rendering purposes.\n  description text,\n  -- A URL of the product image in Stripe, meant to be displayable to the customer.\n  image text,\n  -- Set of key-value pairs, used to store additional information about the object in a structured format.\n  metadata jsonb\n);\nalter table products\n  enable row level security;\ncreate policy \"Allow public read-only access.\" on products\n  for select using (true);\n\n/**\n* PRICES\n* Note: prices are created and managed in Stripe and synced to our DB via Stripe webhooks.\n*/\ncreate type pricing_type as enum ('one_time', 'recurring');\ncreate type pricing_plan_interval as enum ('day', 'week', 'month', 'year');\ncreate table prices (\n  -- Price ID from Stripe, e.g. price_1234.\n  id text primary key,\n  -- The ID of the prduct that this price belongs to.\n  product_id text references products,\n  -- Whether the price can be used for new purchases.\n  active boolean,\n  -- A brief description of the price.\n  description text,\n  -- The unit amount as a positive integer in the smallest currency unit (e.g., 100 cents for US$1.00 or 100 for \xa5100, a zero-decimal currency).\n  unit_amount bigint,\n  -- Three-letter ISO currency code, in lowercase.\n  currency text check (char_length(currency) = 3),\n  -- One of `one_time` or `recurring` depending on whether the price is for a one-time purchase or a recurring (subscription) purchase.\n  type pricing_type,\n  -- The frequency at which a subscription is billed. One of `day`, `week`, `month` or `year`.\n  interval pricing_plan_interval,\n  -- The number of intervals (specified in the `interval` attribute) between subscription billings. For example, `interval=month` and `interval_count=3` bills every 3 months.\n  interval_count integer,\n  -- Default number of trial days when subscribing a customer to this price using [`trial_from_plan=true`](https://stripe.com/docs/api#create_subscription-trial_from_plan).\n  trial_period_days integer,\n  -- Set of key-value pairs, used to store additional information about the object in a structured format.\n  metadata jsonb\n);\nalter table prices\n  enable row level security;\ncreate policy \"Allow public read-only access.\" on prices\n  for select using (true);\n\n/**\n* SUBSCRIPTIONS\n* Note: subscriptions are created and managed in Stripe and synced to our DB via Stripe webhooks.\n*/\ncreate type subscription_status as enum ('trialing', 'active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'unpaid');\ncreate table subscriptions (\n  -- Subscription ID from Stripe, e.g. sub_1234.\n  id text primary key,\n  user_id uuid references auth.users not null,\n  -- The status of the subscription object, one of subscription_status type above.\n  status subscription_status,\n  -- Set of key-value pairs, used to store additional information about the object in a structured format.\n  metadata jsonb,\n  -- ID of the price that created this subscription.\n  price_id text references prices,\n  -- Quantity multiplied by the unit amount of the price creates the amount of the subscription. Can be used to charge multiple seats.\n  quantity integer,\n  -- If true the subscription has been canceled by the user and will be deleted at the end of the billing period.\n  cancel_at_period_end boolean,\n  -- Time at which the subscription was created.\n  created timestamp with time zone default timezone('utc'::text, now()) not null,\n  -- Start of the current period that the subscription has been invoiced for.\n  current_period_start timestamp with time zone default timezone('utc'::text, now()) not null,\n  -- End of the current period that the subscription has been invoiced for. At the end of this period, a new invoice will be created.\n  current_period_end timestamp with time zone default timezone('utc'::text, now()) not null,\n  -- If the subscription has ended, the timestamp of the date the subscription ended.\n  ended_at timestamp with time zone default timezone('utc'::text, now()),\n  -- A date in the future at which the subscription will automatically get canceled.\n  cancel_at timestamp with time zone default timezone('utc'::text, now()),\n  -- If the subscription has been canceled, the date of that cancellation. If the subscription was canceled with `cancel_at_period_end`, `canceled_at` will still reflect the date of the initial cancellation request, not the end of the subscription period when the subscription is automatically moved to a canceled state.\n  canceled_at timestamp with time zone default timezone('utc'::text, now()),\n  -- If the subscription has a trial, the beginning of that trial.\n  trial_start timestamp with time zone default timezone('utc'::text, now()),\n  -- If the subscription has a trial, the end of that trial.\n  trial_end timestamp with time zone default timezone('utc'::text, now())\n);\nalter table subscriptions\n  enable row level security;\ncreate policy \"Can only view own subs data.\" on subscriptions\n  for select using (auth.uid() = user_id);\n\n/**\n * REALTIME SUBSCRIPTIONS\n * Only allow realtime listening on public tables.\n */\ndrop publication if exists supabase_realtime;\ncreate publication supabase_realtime\n  for table products, prices;\n\n")))}d.isMDXComponent=!0}}]);