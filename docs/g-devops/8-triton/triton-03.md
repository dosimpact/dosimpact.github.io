---
sidebar_position: 3
---

# NVIDIA Triton Inference Server 2
- [NVIDIA Triton Inference Server 2](#nvidia-triton-inference-server-2)
  - [vLLM](#vllm)
  - [Triton grpc service](#triton-grpc-service)


## vLLM
vLLM 이란?  
- LLM 추론 속도를 미친 듯이 끌어올리기 위해 탄생한 오픈소스 서빙 엔진  
- 기존 방식보다 최대 10~20배 더 빠른 처리량(Throughput)을 보여주며 LLM 서빙 업계의 표준  
- 핵심 기술: **PagedAttention**
  - LLM은 답변을 생성할 때 이전에 나온 단어들을 기억하기 위해 KV Cache라는 메모리를 사용  
  - 문제 : 이 메모리가 미리 크게 할당되거나 낭비되는 경우가 많아 GPU 메모리가 금방 소진  
  - 메모리를 '페이지' 단위로 쪼개서 필요할 때만 동적으로 할당
- -> 한 번에 수십 명의 요청을 동시에 처리해도 GPU가 버팀, 
- **Continuous Batching** : 빈자리가 생기면 즉시 다음 요청을 끼워 넣어 GPU 풀사용  


Triton이 LLM을 지원하는 방식  
- **TensorRT-LLM Backend** (권장): NVIDIA가 LLM 추론 가속을 위해 만든 전용 라이브러리
  - Llama 3, Mistral, Falcon 등 최신 모델에 대해 최고의 성능을 내며, Triton과 직접 연동됩니다.
- **vLLM Backend**: 오픈소스 LLM 서빙 엔진으로 유명한 vLLM을 Triton 내부에서 실행
  - 사용이 간편하고 PagedAttention 같은 기능을 그대로 쓸 수 있음  


## Triton grpc service

https://github.com/triton-inference-server/common/blob/main/protobuf/grpc_service.proto


GRPC 서비스 인터페이스 요약

- **서비스 이름**: `GRPCInferenceService` – Triton Inference Server용 gRPC API

---

서버 / 모델 상태

- **ServerLive** – 서버 프로세스가 살아있는지(헬스체크) 확인
- **ServerReady** – 서버가 요청을 처리할 준비가 되었는지 확인
- **ModelReady** – 특정 모델이 로드·초기화되어 추론 가능한 상태인지 확인

---

메타데이터 / 설정 / 통계

- **ServerMetadata** – 서버 이름, 버전, 지원 확장 기능 등 메타데이터 조회
- **ModelMetadata** – 모델의 플랫폼, 버전, 입·출력 텐서 정보 등의 메타데이터 조회
- **ModelConfig** – 모델 설정 정보(`config`) 조회
- **ModelStatistics** – 모델별/버전별 추론 성능·카운트·메모리 사용 통계 조회

---

추론

- **ModelInfer** – 단일(비스트리밍) 추론 요청 수행
- **ModelStreamInfer** – 양방향 스트림 기반으로 연속 추론 요청/응답 처리

---

모델 리포지토리 관리

- **RepositoryIndex** – 모델 리포지토리 내 모델 목록·상태 인덱스 조회
- **RepositoryModelLoad** – 리포지토리에서 특정 모델 로드 또는 재로드
- **RepositoryModelUnload** – 메모리에서 특정 모델 언로드

---

공유 메모리 관리 (System / CUDA)

- **SystemSharedMemoryStatus** – 등록된 시스템 공유 메모리 영역들의 상태 조회
- **SystemSharedMemoryRegister** – 시스템 공유 메모리 영역 등록
- **SystemSharedMemoryUnregister** – 시스템 공유 메모리 영역 해제(단일 또는 전체)

- **CudaSharedMemoryStatus** – 등록된 CUDA 공유 메모리 영역들의 상태 조회
- **CudaSharedMemoryRegister** – CUDA 공유 메모리 영역 등록
- **CudaSharedMemoryUnregister** – CUDA 공유 메모리 영역 해제(단일 또는 전체)

---

트레이스 / 로그 설정

- **TraceSetting** – 서버(또는 특정 모델)의 트레이스 설정 변경 및 현재 값 조회
- **LogSettings** – 서버 로그 관련 설정 변경 및 현재 값 조회