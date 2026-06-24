# Atividade Ponderada — Instalação do OpenChoreo

Documentação completa do processo de instalação, análise de requisitos de
infraestrutura e tentativa de implantação da aplicação de exemplo da plataforma
**OpenChoreo** (Internal Developer Platform open-source da WSO2).

## O que é o OpenChoreo

O [OpenChoreo](https://openchoreo.dev) é uma **Internal Developer Platform (IDP)**
open-source, construída sobre Kubernetes. Ele oferece uma camada de abstração
("plataforma") acima do Kubernetes para que times de desenvolvimento façam o
deploy e a operação de aplicações sem precisar lidar diretamente com a
complexidade de manifests, redes, observabilidade e governança de baixo nível.

A plataforma organiza o trabalho em torno de conceitos de alto nível —
**Projects**, **Components**, **Environments**, **Deployment Tracks**,
**Data Planes** — e expõe um portal de desenvolvedor baseado em **Backstage**.

## Estrutura do repositório

| Caminho | Conteúdo |
|---|---|
| [`docs/01-requisitos-infraestrutura.md`](docs/01-requisitos-infraestrutura.md) | Análise dos requisitos de hardware/software e do ambiente local |
| [`docs/02-instalacao.md`](docs/02-instalacao.md) | Passo a passo executado, com comandos e saídas |
| [`docs/03-evidencias.md`](docs/03-evidencias.md) | Índice das evidências coletadas |
| [`docs/04-problemas-e-solucoes.md`](docs/04-problemas-e-solucoes.md) | Problemas encontrados e soluções/contornos adotados |
| [`docs/05-componentes-plataforma.md`](docs/05-componentes-plataforma.md) | Descrição dos principais componentes da plataforma |
| [`evidencias/`](evidencias/) | Logs, saídas de comandos e capturas coletadas |
| [`evidencias/video/`](evidencias/video/) | Artefatos auxiliares usados na gravação da demonstração |

## Vídeo de demonstração

- [Demonstração da instalação e implantação do OpenChoreo](https://drive.google.com/file/d/1BJbHhxQHgV8b1FgQ0DDkE307m1KwHHv4/view?usp=sharing)

## Resumo do ambiente utilizado

- **Máquina:** MacBook Pro (Apple Silicon, M1 Pro), 10 núcleos, 16 GB RAM, arquitetura `arm64`
- **Sistema:** macOS 26.5.1
- **Runtime de contêineres:** Docker Desktop 29.3.1 (VM com 10 CPUs / 7,7 GiB alocados)
- **Ferramentas:** `kubectl` v1.34.1, Docker; instalação do OpenChoreo via container *quick-start* oficial (`ghcr.io/openchoreo/quick-start:v1.1.1`)

> O status final da implantação (sucesso total, parcial ou bloqueio por limitação
> de hardware) está documentado em [`docs/03-evidencias.md`](docs/03-evidencias.md)
> e [`docs/04-problemas-e-solucoes.md`](docs/04-problemas-e-solucoes.md).
