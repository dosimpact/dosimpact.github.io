---
sidebar_position: 10
---

# kafka with docker


## single node

```yml
networks:
  kafka_network:

volumes:
  Kafka00_Standalone:
    driver: local

services:
  Kafka00Service:
    image: bitnami/kafka:3.5.1-debian-11-r72
    restart: always
    container_name: Kafka00Container
    ports:
      - '9094:9094'
    environment:
      - KAFKA_CFG_AUTO_CREATE_TOPICS_ENABLE=true
      # KRaft settings
      - KAFKA_CFG_CONTROLLER_QUORUM_VOTERS=0@Kafka00Service:9093
      - KAFKA_CFG_NODE_ID=0
      - KAFKA_CFG_PROCESS_ROLES=controller,broker
      # Listeners
      - ALLOW_PLAINTEXT_LISTENER=yes
      # 프로듀스나 컨슈머에 제공할 주소, 로컬 PC에서 접근할 때 127.0.0.1:10000 를 이용한다
      - KAFKA_CFG_LISTENERS=PLAINTEXT://:9092,CONTROLLER://:9093,EXTERNAL://:9094
      - KAFKA_CFG_ADVERTISED_LISTENERS=PLAINTEXT://Kafka00Service:9092,EXTERNAL://127.0.0.1:9094
      - KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP=CONTROLLER:PLAINTEXT,EXTERNAL:PLAINTEXT,PLAINTEXT:PLAINTEXT
      - KAFKA_CFG_CONTROLLER_LISTENER_NAMES=CONTROLLER
      - KAFKA_CFG_INTER_BROKER_LISTENER_NAME=PLAINTEXT
    networks:
      - kafka_network
    volumes:
      - "Kafka00_Standalone:/bitnami/kafka"
  
  KafkaWebUiService:
    image: provectuslabs/kafka-ui:latest
    restart: always
    container_name: KafkaWebUiContainer
    ports:
      - '8080:8080'
    environment:
      - KAFKA_CLUSTERS_0_NAME=Kafka-V35
      - KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS=Kafka00Service:9092
      - DYNAMIC_CONFIG_ENABLED=true
      - KAFKA_CLUSTERS_0_AUDIT_TOPICAUDITENABLED=true
      - KAFKA_CLUSTERS_0_AUDIT_CONSOLEAUDITENABLED=true
      #- KAFKA_CLUSTERS_0_METRICS_PORT=9999
    networks:
      - kafka_network

# ref : Docker Compose 로 Silicon Mac에서 KRaft, Kafka Cluster 구축하기
# https://breezymind.com/silicon-mac-kafka-cluster-docker-compose/

```

## cluster nodes

```yml
networks:
  kafka_network:

volumes:
  Kafka00:
    driver: local
  Kafka01:
    driver: local
  Kafka02:
    driver: local
    
services:
##Kafka 00    
  Kafka00Service:
    image: bitnami/kafka:3.5.1-debian-11-r72
    restart: unless-stopped
    container_name: Kafka00Container
    ports:
      - '10000:9094'
    environment:
      - KAFKA_CFG_AUTO_CREATE_TOPICS_ENABLE=true
      # KRaft settings
      - KAFKA_CFG_BROKER_ID=0
      - KAFKA_CFG_NODE_ID=0
      # KRAFT_CLUSTER_ID 설정으로 모든 브로커가 동일한 ID를 가진다
      - KAFKA_KRAFT_CLUSTER_ID=HsDBs9l6UUmQq7Y5E6bNlw
      - KAFKA_CFG_CONTROLLER_QUORUM_VOTERS=0@Kafka00Service:9093,1@Kafka01Service:9093,2@Kafka02Service:9093
      - KAFKA_CFG_PROCESS_ROLES=controller,broker
      # Listeners
      - ALLOW_PLAINTEXT_LISTENER=yes
      # 브로커가 내부적으로 통신하는 주소
      - KAFKA_CFG_LISTENERS=PLAINTEXT://:9092,CONTROLLER://:9093,EXTERNAL://:9094
      # 프로듀스나 컨슈머에 제공할 주소, 로컬 PC에서 접근할 때 127.0.0.1:10000 를 이용한다
      - KAFKA_CFG_ADVERTISED_LISTENERS=PLAINTEXT://Kafka00Service:9092,EXTERNAL://127.0.0.1:10000
      - KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP=CONTROLLER:PLAINTEXT,EXTERNAL:PLAINTEXT,PLAINTEXT:PLAINTEXT
      - KAFKA_CFG_CONTROLLER_LISTENER_NAMES=CONTROLLER
      - KAFKA_CFG_INTER_BROKER_LISTENER_NAME=PLAINTEXT
      # Clustering
      - KAFKA_CFG_OFFSETS_TOPIC_REPLICATION_FACTOR=3
      - KAFKA_CFG_TRANSACTION_STATE_LOG_REPLICATION_FACTOR=3
      - KAFKA_CFG_TRANSACTION_STATE_LOG_MIN_ISR=2
    networks:
      - kafka_network
    volumes:
      - "Kafka00:/bitnami/kafka"
##Kafka 01
  Kafka01Service:
    image: bitnami/kafka:3.5.1-debian-11-r72
    restart: unless-stopped
    container_name: Kafka01Container
    ports:
      - '10001:9094'
    environment:
      - KAFKA_CFG_AUTO_CREATE_TOPICS_ENABLE=true
      # KRaft settings
      - KAFKA_CFG_BROKER_ID=1
      - KAFKA_CFG_NODE_ID=1
      - KAFKA_KRAFT_CLUSTER_ID=HsDBs9l6UUmQq7Y5E6bNlw
      - KAFKA_CFG_CONTROLLER_QUORUM_VOTERS=0@Kafka00Service:9093,1@Kafka01Service:9093,2@Kafka02Service:9093
      - KAFKA_CFG_PROCESS_ROLES=controller,broker
      # Listeners
      - ALLOW_PLAINTEXT_LISTENER=yes
      - KAFKA_CFG_LISTENERS=PLAINTEXT://:9092,CONTROLLER://:9093,EXTERNAL://:9094
      - KAFKA_CFG_ADVERTISED_LISTENERS=PLAINTEXT://Kafka01Service:9092,EXTERNAL://127.0.0.1:10001
      - KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP=CONTROLLER:PLAINTEXT,EXTERNAL:PLAINTEXT,PLAINTEXT:PLAINTEXT
      - KAFKA_CFG_CONTROLLER_LISTENER_NAMES=CONTROLLER
      - KAFKA_CFG_INTER_BROKER_LISTENER_NAME=PLAINTEXT
      # Clustering
      - KAFKA_CFG_OFFSETS_TOPIC_REPLICATION_FACTOR=3
      - KAFKA_CFG_TRANSACTION_STATE_LOG_REPLICATION_FACTOR=3
      - KAFKA_CFG_TRANSACTION_STATE_LOG_MIN_ISR=2
    networks:
      - kafka_network
    volumes:
      - "Kafka01:/bitnami/kafka"
##Kafka 02
  Kafka02Service:
    image: bitnami/kafka:3.5.1-debian-11-r72
    restart: unless-stopped
    container_name: Kafka02Container
    ports:
      - '10002:9094'
    environment:
      - KAFKA_CFG_AUTO_CREATE_TOPICS_ENABLE=true
      # KRaft settings
      - KAFKA_CFG_BROKER_ID=2
      - KAFKA_CFG_NODE_ID=2
      - KAFKA_KRAFT_CLUSTER_ID=HsDBs9l6UUmQq7Y5E6bNlw
      - KAFKA_CFG_CONTROLLER_QUORUM_VOTERS=0@Kafka00Service:9093,1@Kafka01Service:9093,2@Kafka02Service:9093
      - KAFKA_CFG_PROCESS_ROLES=controller,broker
      # Listeners
      - ALLOW_PLAINTEXT_LISTENER=yes
      - KAFKA_CFG_LISTENERS=PLAINTEXT://:9092,CONTROLLER://:9093,EXTERNAL://:9094
      - KAFKA_CFG_ADVERTISED_LISTENERS=PLAINTEXT://Kafka02Service:9092,EXTERNAL://127.0.0.1:10002
      - KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP=CONTROLLER:PLAINTEXT,EXTERNAL:PLAINTEXT,PLAINTEXT:PLAINTEXT
      - KAFKA_CFG_CONTROLLER_LISTENER_NAMES=CONTROLLER
      - KAFKA_CFG_INTER_BROKER_LISTENER_NAME=PLAINTEXT
      # Clustering
      - KAFKA_CFG_OFFSETS_TOPIC_REPLICATION_FACTOR=3
      - KAFKA_CFG_TRANSACTION_STATE_LOG_REPLICATION_FACTOR=3
      - KAFKA_CFG_TRANSACTION_STATE_LOG_MIN_ISR=2
    networks:
      - kafka_network
    volumes:
      - "Kafka02:/bitnami/kafka"
      
  KafkaWebUiService:
    image: provectuslabs/kafka-ui:latest
    restart: unless-stopped
    container_name: KafkaWebUiContainer
    ports:
      - '8080:8080'
    environment:
      - KAFKA_CLUSTERS_0_NAME=Local-Kraft-Cluster
      - KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS=Kafka00Service:9092,Kafka01Service:9092,Kafka02Service:9092
      - DYNAMIC_CONFIG_ENABLED=true
      - KAFKA_CLUSTERS_0_AUDIT_TOPICAUDITENABLED=true
      - KAFKA_CLUSTERS_0_AUDIT_CONSOLEAUDITENABLED=true
      #- KAFKA_CLUSTERS_0_METRICS_PORT=9999
    networks:
      - kafka_network

```


## Test - kafka CLI

카프카 설치 경로 : /opt/bitnami/kafka
카프카 CLI 경로 : /opt/bitnami/kafka/bin

```
// 도커 환경이므로, 두개의 터미널로 각 컨테이너에 접속하자.
docker exec -it 53e6f8814563b6665440b04c07ccc29eb21674f12daffad68a478984c3f8f1af bash
docker exec -it 53e6f8814563b6665440b04c07ccc29eb21674f12daffad68a478984c3f8f1af bash

cd /opt/bitnami/kafka/bin

$ pwd
/opt/bitnami/kafka/bin

$ ls
connect-distributed.sh	      kafka-delegation-tokens.sh  kafka-mirror-maker.sh		      kafka-verifiable-consumer.sh
connect-mirror-maker.sh       kafka-delete-records.sh	  kafka-producer-perf-test.sh	      kafka-verifiable-producer.sh
connect-standalone.sh	      kafka-dump-log.sh		  kafka-reassign-partitions.sh	      trogdor.sh
kafka-acls.sh		      kafka-e2e-latency.sh	  kafka-replica-verification.sh       windows
kafka-broker-api-versions.sh  kafka-features.sh		  kafka-run-class.sh		      zookeeper-security-migration.sh
kafka-cluster.sh	      kafka-get-offsets.sh	  kafka-server-start.sh		      zookeeper-server-start.sh
kafka-configs.sh	      kafka-jmx.sh		  kafka-server-stop.sh		      zookeeper-server-stop.sh
kafka-console-consumer.sh     kafka-leader-election.sh	  kafka-storage.sh		      zookeeper-shell.sh
kafka-console-producer.sh     kafka-log-dirs.sh		  kafka-streams-application-reset.sh
kafka-consumer-groups.sh      kafka-metadata-quorum.sh	  kafka-topics.sh
kafka-consumer-perf-test.sh   kafka-metadata-shell.sh	  kafka-transactions.sh
```

### simple test

```
// greeting 토픽 생성
./kafka-topics.sh --create --topic greeting --bootstrap-server Kafka00Service:9092,Kafka01Service:9092,Kafka02Service:9092 --partitions 3 --replication-factor 2

// Producer, Consumer 테스트

// 아래 명령어를 입력하면, >라는 입력창이 나온다 여기에 입력하는 데이터 한줄한줄이 메시지가 된다. 
./kafka-console-producer.sh --topic greeting --bootstrap-server Kafka00Service:9092,Kafka01Service:9092,Kafka02Service:9092

// 위에서 생성한 메시지를 받기
./kafka-console-consumer.sh --topic greeting --from-beginning --bootstrap-server Kafka00Service:9092,Kafka01Service:9092,Kafka02Service:9092

```

## ref

https://breezymind.com/silicon-mac-kafka-cluster-docker-compose/
https://github.com/ArminShoeibi/KafkaDockerCompose/blob/main/docker-compose-cluster.yml
