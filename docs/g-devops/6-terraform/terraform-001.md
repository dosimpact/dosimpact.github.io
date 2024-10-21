---
sidebar_position: 6
---

# Terraform 

## Terraform?  

Terraform은 HashiCorp에서 개발한 오픈 소스 기반의 인프라스트럭처 자동화 도구  
- “Infrastructure as Code (IaC)” 개념을 구현한 도구 
- 클라우드 서비스 제공자(AWS, Google Cloud, Azure 등)나 온프레미스 데이터 센터에서 인프라를 프로비저닝하고 관리  
- Make your infrastructure auditable  
- You can keep your infrastructure change history in a version control  
system like GIT  

## 테라폼 vs Ansible  
- Terraform: 인프라 자원 관리 및 배포에 중점을 둠 (클라우드 인프라, 네트워크 등).  
```hcl
provider "aws" {
  region = "us-west-2"
}

resource "aws_instance" "example" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"
}
```

- Ansible: 서버 구성 관리, 소프트웨어 설치, 태스크 자동화 등에 중점을 둠.    
```yml
- hosts: webservers
  become: true
  tasks:
    - name: Install Nginx
      apt:
        name: nginx
        state: present
```

참고 : hcl = HashiCorp Configuration Language   
- HashiCorp의 다양한 인프라 관리 도구에서 사용하는 언어, (특히 테라폼)  


## Terraform 설치(MacOS)

```
brew tap hashicorp/tap
brew install hashicorp/tap/terraform
terraform version
```

github : https://github.com/wardviaene/terraform-course 


## Terraform 실행  

1.console
- 테라폼은 디렉터리 내 모든 파일들을 읽어서 하나의 코드로 만든다.  
- terraform console 로 시작할 수 있다.  
- 파일이름은 상관없다. 엔트리포인트도 없다.  

```
# main.tf
variable "myvar" {
  type    = string
  default = "hello terraform"
}

variable "mymap" {
  type = map(string)
  default = {
    "mykey" = "my value"
  }
}

variable "mylist" {
  type    = list(number)
  default = [1, 2, 3]
}
---
terraform console # 실행 
var.myvar # 변수는 var 객체안에 모여있다.  
```

2.init

```hcl
provider "aws" {

}

variable "AWS_REGION" {
  type = string
}

resource "aws_instance" "example" {
  ami           = var.AMIS[var.AWS_REGION]
  instance_type = "t2.micro"
}
---
terraform init  # 공급자가 변경될때마다 초기화를 해야한다. 관련 변수들이 들어온다.  
```

## AWS 연동  

프로그래매틱 방식으로 AWS 관리할 수 있는 권한을 만들어야 한다. 

### 1.IAM 유저 만들기  

access key : AKIAU5LH5U3L2LMYKAFJ / secret key : A5**q

1.1 사용자를 하나 만든다. 

![alt](./img/iam-1.png)  
- 사용자를 만들면서, admin access 사용자 그룹을 하나 만든다.

![alt](./img/iam-2.png)  
- 만들어진 사용자

![Alt text](image.png)
![alt](./img/iam-3.png)  
- 사용자에게 프로그래매틱 방식으로 엑세스 키를 제공하자.  

1.2 인바운드 규칙 편접

![Alt text](image-1.png)  
- EC2 기본 규칙에, 현재 내 IP를 인바운드 규칙으로 허용하자.  


## EC 만들어보기 (first-steps)  
>https://github.com/wardviaene/terraform-course/tree/master/first-steps  

1.instance.tf
```
provider "aws" {
  access_key = "AKIAU5LH5U3L2LMYKAFJ"
  secret_key = "A5o4h5YKJ+xxxxxxxx"
  region     = "ap-northeast-2"
}

resource "aws_instance" "example" {
  ami           = "ami-042e76978adeb8c48"
  instance_type = "t2.micro"
}
---

```

2.
AMI(Amazon Machine Image)
>https://cloud-images.ubuntu.com/locator/ec2/  

AWS AMI(Amazon Machine Image)는 Amazon Web Services에서 제공하는 가상 머신 템플릿
- region마다 지원하는 이미지가 다르다.  
- 원하는 ami를 찾아서 위에 업데이트 하자.  

3.
first-steps

```
# 초기화 혹은 provider 변경이 있다면 init명령어 수행하기  
terraform init
terraform plan
terraform apply

# 프로덕션 환경에서는 굉장히 조심해서 사용할것
terraform destroy

# 프로덕션 환경에서는 output 파일을 꼭 사용해라.  
terraform plan -out out.terraform # 최종 output 파일 만들기   
terraform apply out.terraform # 적용  
```

## 유용한 명령어

$ terraform plan # 계획
$ terraform apply # 계획 & 적용의 단축키 - 프로덕션 환경에서는 사용하지 마세요.
$ terraform plan -out out.terraform # 테라폼 계획과 계획 작성을 출력 파일에 저장
$ terraform apply out.terraform # 출력 파일을 사용하여 테라폼 계획 적용
$ terraform show # 현재 테라폼 상태 표시
$ cat terraform.tfstate # 제이슨(JSON) 형식으로 상태 표시
