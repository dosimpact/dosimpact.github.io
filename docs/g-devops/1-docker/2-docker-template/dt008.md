---
sidebar_position: 8
---

# Redis Cluster


## docker-compose.yml


```yml
# docker-compose.yml
# docker compose up -d  
version: "3.7"
services:
  node1:
    container_name: node1
    image: redis
    volumes:
      - ./cluster/node01.conf:/etc/redis/redis.conf
    command: redis-server /etc/redis/redis.conf
    ports:
      - 7001:7001
      - 7002:7002
      - 7003:7003
      - 7004:7004
      - 7005:7005
      - 7006:7006
  node2:
    network_mode: "service:node1"
    container_name: node2
    image: redis
    volumes:
      - ./cluster/node02.conf:/etc/redis/redis.conf
    command: redis-server /etc/redis/redis.conf

  node3:
    network_mode: "service:node1"
    container_name: node3
    image: redis
    volumes:
      - ./cluster/node03.conf:/etc/redis/redis.conf
    command: redis-server /etc/redis/redis.conf

  node4:
    network_mode: "service:node1"
    container_name: node4
    image: redis
    volumes:
      - ./cluster/node04.conf:/etc/redis/redis.conf
    command: redis-server /etc/redis/redis.conf

  node5:
    network_mode: "service:node1"
    container_name: node5
    image: redis
    volumes:
      - ./cluster/node05.conf:/etc/redis/redis.conf
    command: redis-server /etc/redis/redis.conf

  node6:
    network_mode: "service:node1"
    container_name: node6
    image: redis
    volumes:
      - ./cluster/node06.conf:/etc/redis/redis.conf
    command: redis-server /etc/redis/redis.conf

  redis-cluster-entry:
    network_mode: "service:node1"
    image: redis
    container_name: redis-cluster
    command: redis-cli --cluster create 127.0.0.1:7001 127.0.0.1:7002 127.0.0.1:7003 127.0.0.1:7004 127.0.0.1:7005 127.0.0.1:7006 --cluster-replicas 1 --cluster-yes
    depends_on:
      - node1
      - node2
      - node3
      - node4
      - node5
      - node6
# docker compose up


```


## conf

```yml
# ./cluster/node01.conf
port 7001
#cluster 사용 여부
cluster-enabled yes 
#cluster 설정 파일 이름
cluster-config-file nodes.conf 
#timeout 시간 지정 (ms)
cluster-node-timeout 3000
#failover된 redis node 재실행 시 이전 데이터를 다시 로드해올 수 있음
appendonly yes
---
# ./cluster/node02.conf
port 7002
cluster-enabled yes
cluster-config-file nodes.conf
cluster-node-timeout 3000
appendonly yes
---
# ./cluster/node03.conf
port 7003
cluster-enabled yes
cluster-config-file nodes.conf
cluster-node-timeout 3000
appendonly yes
---
# ./cluster/node04.conf
port 7004
cluster-enabled yes
cluster-config-file nodes.conf
cluster-node-timeout 3000
appendonly yes
---
# ./cluster/node05.conf
port 7005
cluster-enabled yes
cluster-config-file nodes.conf
cluster-node-timeout 3000
appendonly yes
---
# ./cluster/node06.conf
port 7006
cluster-enabled yes
cluster-config-file nodes.conf
cluster-node-timeout 3000
appendonly yes
```