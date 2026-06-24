# 1. Análise dos requisitos de infraestrutura

## 1.1. Requisitos oficiais do OpenChoreo

Fonte: documentação oficial do projeto ([Quick Start Guide](https://openchoreo.dev/docs/getting-started/quick-start-guide/), versão **v1.1.1**).

| Cenário | CPU | RAM | Observações |
|---|---|---|---|
| Quick start (núcleo da IDP) | **2 vCPU** | **4 GB** | Apenas o control plane + data plane mínimos |
| Com `--with-build` / WorkflowPlane | **4 vCPU** | **8 GB** | Habilita build de imagens a partir do código-fonte |
| Single-cluster completo (build + observability) | **4 vCPU** | **8 GB+** | Inclui stack de observabilidade |

Outros pré-requisitos:

- **Docker Engine 26.0+** (a instalação cria um cluster **KinD** — Kubernetes in Docker — usando o socket do Docker do host).
- A instalação é feita por um **container *quick-start*** oficial que executa um
  script `install.sh`, o qual provisiona o cluster KinD e instala o OpenChoreo e
  suas dependências via **Helm charts**.
- O script é **idempotente** (pode ser reexecutado com segurança se interrompido).
- **Apple Silicon (Mac ARM):** a documentação **recomenda o Colima** com
  `--vm-type=vz --vz-rosetta` em vez do Docker Desktop, pois o fluxo depende de
  `--network=host`, que tem comportamento diferente no Docker Desktop do macOS.

## 1.2. Ambiente disponível para esta atividade

| Item | Valor |
|---|---|
| Modelo | MacBook Pro 18,1 (Apple M1 Pro) |
| Núcleos de CPU | 10 |
| Memória RAM total | **16 GB** |
| Arquitetura | `arm64` (Apple Silicon) |
| Sistema operacional | macOS 26.5.1 (build 25F80) |
| Disco livre | ~61 GB |
| Runtime de contêineres | Docker Desktop 29.3.1 |
| Recursos alocados ao Docker | **10 CPUs / 7,7 GiB RAM** |
| `kubectl` | v1.34.1 |
| `kind` / `helm` | Não instalados no host (são providos dentro do container quick-start) |

## 1.3. Confronto requisitos × ambiente (análise)

```
Núcleo da IDP (4 GB / 2 vCPU)      →  ATENDIDO  (Docker tem 7,7 GiB / 10 CPU)
Build + Observability (8 GB)       →  LIMÍTROFE (7,7 GiB < 8 GB recomendados)
```

**Conclusões da análise:**

1. **CPU não é gargalo.** A VM do Docker expõe 10 CPUs; o requisito máximo é 4 vCPU.

2. **A RAM é o fator crítico.** O Docker Desktop está configurado com **7,7 GiB**,
   logo abaixo dos **8 GB** recomendados para o cenário completo. O **núcleo da
   plataforma (4 GB)** cabe com folga; portanto a estratégia adotada foi instalar
   **primeiro o núcleo + a aplicação de exemplo** e só depois, se houvesse margem,
   tentar os add-ons de build/observabilidade.

3. **Risco de plataforma (macOS + Docker Desktop).** O fluxo oficial usa
   `docker run --network=host`. No Linux isso compartilha a pilha de rede do host;
   no **Docker Desktop para macOS**, `--network=host` se refere à VM interna do
   Docker, não ao host macOS. Isso pode impedir o container quick-start de alcançar
   o API server do cluster KinD e/ou de expor as portas `8080`/`19080` em
   `localhost`. Por isso a documentação recomenda Colima. **Este é o principal
   risco técnico identificado antes da execução** e foi monitorado durante a
   instalação (ver [`04-problemas-e-solucoes.md`](04-problemas-e-solucoes.md)).

4. **Disco.** ~61 GB livres são suficientes para as imagens do KinD, do
   OpenChoreo e da aplicação de exemplo.
