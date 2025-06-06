# 🧪 Tokenizer API

Una API en NestJS que genera y almacena tokens temporales para transacciones, con Redis como base de datos en memoria. Arquitectura basada en Hexagonal + Docker + Kubernetes.

---

## 🚀 Tecnologías

- [NestJS](https://nestjs.com/)
- [Redis](https://redis.io/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Kubernetes](https://kubernetes.io/)
- [Minikube](https://minikube.sigs.k8s.io/)

---

## 📦 Requisitos previos

- Node.js v20+
- Docker & Docker Compose
- (Opcional) Minikube + kubectl para simular un entorno EKS

---

## 📁 Estructura
├── src/
├── Dockerfile
├── docker-compose.yml
├── .env
└── k8s/
├── redis-deployment.yaml
└── tokenizer-deployment.yaml


---

## 📄 Variables de entorno (`.env`)

Crea un archivo `.env` en la raíz:

```env
PORT=3000
API_KEY=pk_test_Tsef2b3c4d5e6
REDIS_HOST=redis
REDIS_PORT=6379
```

# 1 Construir y levantar los servicios
docker-compose up --build

## La API estará disponible en:
http://localhost:3000

### Las urls disponibles serán
    http://localhost:3000/data-card/register (POST)
    http://localhost:3000/data-card/get-data (GET)
    

# 2 Simular despliegue en EKS en Kubernetes con Minikube
## 1 Iniciar Minikube 
minikube start

eval $(minikube docker-env)

## 2 Construir la imagen para minikube
docker build -t tokenizer-api .

## 3 Aplicar los manifiestos
kubectl apply -f k8s/redis-deployment.yaml
kubectl apply -f k8s/tokenizer-deployment.yaml

## 4 Acceder a la API
minikube service tokenizer-service

## Esto abrirá la URL en tu navegador. Si no lo hace, ejecuta:

minikube service tokenizer-service --url

## Puedes verificar los pods y servicios con:
kubectl get pods
kubectl get svc
kubectl logs deployment/tokenizer-api
