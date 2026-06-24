# 5. Principais componentes da plataforma

Descrição, com base na documentação oficial e nos recursos observados durante a
instalação, dos principais elementos do OpenChoreo. A plataforma adota um modelo
de **Cells & Planes** e expõe abstrações de alto nível sobre o Kubernetes.

## 5.1. Projects

Um **Project** é a unidade de organização lógica de mais alto nível. Agrupa um
conjunto de componentes relacionados que, juntos, formam uma aplicação ou um
domínio de negócio (uma "cell"). É a fronteira natural para isolamento, governança
e ownership por um time. Equivale, conceitualmente, a um "produto" ou
"microsserviço-mãe" dentro da plataforma.

## 5.2. Components

Um **Component** é a unidade implantável: um serviço, uma API, uma aplicação web,
um worker, uma tarefa agendada, etc. Cada componente pertence a um Project e tem
um **tipo** (ex.: *Service*, *Web Application*, *Scheduled Task*). O componente
descreve **o que** roda; a plataforma cuida de **como** roda (containers,
networking, escalonamento). Na aplicação de exemplo, o `react-starter` é um
Component do tipo aplicação web.

## 5.3. Environments

Um **Environment** representa um estágio do ciclo de vida — tipicamente
`development`, `staging`, `production`. Um mesmo componente pode ser promovido
entre environments. Cada environment é mapeado para um **Data Plane** e impõe suas
próprias configurações, segredos e políticas. Isso padroniza o caminho do código
até a produção.

## 5.4. Deployment Tracks

Um **Deployment Track** é a "trilha" que conecta um Component a um fluxo de
entrega contínuo: define como uma nova versão (build/artefato) avança pelos
environments. É o mecanismo que materializa a promoção `dev → staging → prod`,
mantendo histórico de versões e permitindo rollback. Em outras palavras, é a
representação de CI/CD da plataforma para um determinado componente.

## 5.5. Data Planes

O **Data Plane** é o(s) cluster(s) Kubernetes onde as cargas de trabalho dos
usuários realmente executam. O OpenChoreo separa:

- **Control Plane** — onde vivem as APIs e os controllers do OpenChoreo (a
  inteligência da plataforma, os CRDs, a reconciliação);
- **Data Plane** — onde os componentes dos usuários são de fato implantados e
  servem tráfego.

Essa separação permite que um único control plane gerencie múltiplos data planes
(por região, por ambiente, por time), centralizando a governança e distribuindo a
execução. No setup *single-cluster* desta atividade, control plane e data plane
coexistem no mesmo cluster k3d, mas continuam sendo entidades lógicas distintas
(`ClusterDataPlane`).

## 5.6. Backstage (Developer Portal)

O **Backstage** é o portal de desenvolvedor (open-source, da CNCF) usado como
interface principal do OpenChoreo. Por ele, os desenvolvedores:

- visualizam e criam Projects e Components;
- acompanham deployments e o estado dos environments;
- acessam catálogo de software, documentação e métricas;
- interagem com a plataforma sem precisar usar `kubectl` diretamente.

É a camada de **self-service** que torna a IDP utilizável por times que não querem
operar Kubernetes manualmente. No quick-start, o portal fica acessível em
`http://openchoreo.localhost:8080/` (credenciais padrão: `admin@openchoreo.dev` /
`Admin@123`).

## 5.7. Como os componentes se encaixam (visão geral)

```
Backstage (portal / self-service)
        │
        ▼
Control Plane (APIs + controllers + CRDs do OpenChoreo)
        │  define Projects, Components, Environments, Deployment Tracks
        ▼
Data Plane(s)  ── executam os Components em cada Environment
        │
        ▼
Aplicações dos usuários servindo tráfego (ex.: react-starter)
```
