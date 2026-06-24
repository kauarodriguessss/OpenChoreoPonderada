# 2. Processo de instalação executado

Plataforma instalada: **OpenChoreo v1.1.1**, em modo *single-cluster*, usando o
container *quick-start* oficial sobre **Docker Desktop (macOS, Apple Silicon)**.

> Todos os comandos abaixo foram realmente executados nesta máquina. As saídas
> completas estão em [`../evidencias/logs/`](../evidencias/logs/) e o índice das
> evidências em [`03-evidencias.md`](03-evidencias.md).

## 2.1. Preparação do ambiente

```bash
# Docker Desktop estava instalado porém com o daemon parado — foi iniciado:
open -a Docker
# Espera até o daemon responder:
docker ps        # -> daemon UP

# Recursos alocados ao Docker (confirmação):
docker info --format 'CPUs: {{.NCPU}} | MemBytes: {{.MemTotal}}'
# -> CPUs: 10 | MemBytes: 8217059328  (~7,7 GiB)
```

`kind`/`helm` **não** precisaram ser instalados no host: o container quick-start já
embute `k3d v5.8.3`, `helm v3.19.2` e `kubectl v1.32.10`.

## 2.2. Obtenção da imagem quick-start

```bash
docker pull ghcr.io/openchoreo/quick-start:v1.1.1
```

> O primeiro `pull` foi interrompido por um `unexpected EOF` e, na sequência, o
> **daemon do Docker Desktop caiu** (socket desapareceu). Foi reiniciado com
> `open -a Docker` e o `pull` retomado com sucesso (camadas em cache reaproveitadas).
> Detalhes em [`04-problemas-e-solucoes.md`](04-problemas-e-solucoes.md).

## 2.3. Subida do container quick-start

O fluxo oficial é interativo (`docker run -it ...`). Para permitir automação e
captura de logs, o container foi iniciado em segundo plano (mantendo o TTY vivo) e
os scripts auxiliares foram acionados via `docker exec`:

```bash
docker run -d -it --name openchoreo-quick-start \
  -v /var/run/docker.sock:/var/run/docker.sock \
  --network=host \
  -e OPENCHOREO_VERSION=v1.1.1 \
  ghcr.io/openchoreo/quick-start:v1.1.1
```

## 2.4. Instalação do OpenChoreo

```bash
# IMPORTANTE: o install.sh recusa execução como root.
# Deve rodar como o usuário 'openchoreo':
docker exec -u openchoreo openchoreo-quick-start bash -lc './install.sh --version v1.1.1'
```

O script `install.sh`, de forma idempotente:

1. cria o cluster **k3d** `openchoreo-quick-start` (1 server, K3s v1.32.9);
2. instala via **Helm**: `cert-manager`, `external-secrets`, `kgateway`,
   `openbao`, `thunder` (Identity Provider), `openchoreo-control-plane` e
   `openchoreo-data-plane` (todos v1.1.1);
3. cria as credenciais da CLI e imprime as URLs de acesso.

Saída final (resumo):

```
[SUCCESS] OpenChoreo installation completed successfully!
  Backstage UI:  http://openchoreo.localhost:8080/   (admin@openchoreo.dev / Admin@123)
  OpenChoreo API: http://api.openchoreo.localhost:8080/
  Thunder IdP:    http://thunder.openchoreo.localhost:8080/
```

## 2.5. Validação da instalação

```bash
docker exec -u openchoreo openchoreo-quick-start bash -lc './validate-installation.sh'
docker exec -u openchoreo openchoreo-quick-start bash -lc './check-status.sh'
docker exec -u openchoreo openchoreo-quick-start bash -lc 'kubectl get pods -A'
```

Resultado: **`All validations passed!`** — todos os pods `Running`; planos
*Infrastructure*, *Control Plane* e *Data Plane* `[READY]`. Os planos opcionais
*Workflow* e *Observability* ficaram `[NOT INSTALLED]` (decisão consciente devido
ao limite de RAM — ver [`01-requisitos-infraestrutura.md`](01-requisitos-infraestrutura.md)).

## 2.6. Implantação da aplicação de exemplo

```bash
docker exec -u openchoreo openchoreo-quick-start bash -lc './deploy-react-starter.sh'
```

Saída (resumo):

```
[SUCCESS] Component 'react-starter' created
[SUCCESS] Workload 'react-starter' created
[SUCCESS] ReleaseBinding synced with Release
[SUCCESS] Deployment is available
[SUCCESS] HTTPRoute is ready
🌍 http://http-react-starter-development-default-cde5190f.openchoreoapis.localhost:19080
```

## 2.7. Verificação de acesso (host macOS)

```bash
curl -s -o /dev/null -w "HTTP %{http_code}\n" \
  http://http-react-starter-development-default-cde5190f.openchoreoapis.localhost:19080
# -> HTTP 200  (HTML real do React App)

curl -s -o /dev/null -w "HTTP %{http_code}\n" http://openchoreo.localhost:8080/
# -> HTTP 200  (OpenChoreo Portal / Backstage)
```

O acesso pelo navegador do macOS foi confirmado tanto via `curl` quanto via
capturas de tela (ver [`03-evidencias.md`](03-evidencias.md)), incluindo **login
no portal** (`admin@openchoreo.dev`) e navegação até o componente implantado.

## 2.8. Comandos de inspeção da plataforma

```bash
docker exec -u openchoreo openchoreo-quick-start bash -lc 'kubectl get projects -A'
docker exec -u openchoreo openchoreo-quick-start bash -lc 'kubectl get environments -A'
docker exec -u openchoreo openchoreo-quick-start bash -lc 'kubectl get components -A'
docker exec -u openchoreo openchoreo-quick-start bash -lc 'helm list -A'
```

## 2.9. Limpeza (referência, não executada)

```bash
docker exec -u openchoreo openchoreo-quick-start bash -lc './deploy-react-starter.sh --clean'
docker exec -u openchoreo openchoreo-quick-start bash -lc './uninstall.sh'
docker rm -f openchoreo-quick-start
```
