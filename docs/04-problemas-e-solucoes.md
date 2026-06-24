# 4. Problemas encontrados e soluções adotadas

Registro honesto dos obstáculos enfrentados durante a instalação e de como foram
resolvidos. Apesar dos percalços, a execução foi concluída integralmente.

## 4.1. Daemon do Docker parado no início

- **Problema:** o Docker estava instalado, mas o daemon não estava em execução
  (`Cannot connect to the Docker daemon`).
- **Solução:** `open -a Docker` e espera ativa até o `docker ps` responder
  (~21 s). Confirmação dos recursos com `docker info`.

## 4.2. Queda do Docker Desktop durante o `docker pull`

- **Problema:** durante o download da imagem `quick-start` (~vários layers, arm64),
  o pull falhou com `unexpected EOF` e, em seguida, o **daemon do Docker Desktop
  caiu por completo** (o socket `~/.docker/run/docker.sock` desapareceu e não havia
  mais processos do Docker Desktop).
- **Causa provável:** instabilidade do Docker Desktop sob pressão de I/O/memória ao
  baixar e descompactar uma imagem grande em uma máquina com 16 GB de RAM total.
- **Solução:** reinício do Docker Desktop (`open -a Docker`) e **retomada do pull**.
  Como o `docker pull` é resumível, as camadas já baixadas foram reaproveitadas e o
  download concluiu na tentativa seguinte. Foi implementado um laço de retry com
  re-verificação/relaunch do daemon para tornar o processo robusto.
- **Evidência:** [`../evidencias/logs/01-pull-image.txt`](../evidencias/logs/01-pull-image.txt).

## 4.3. `install.sh` recusa execução como root

- **Problema:** ao acionar o script via `docker exec ... bash -lc './install.sh ...'`,
  o comando entra como **root** por padrão, e o script aborta:
  `[ERROR] This script should not be run as root.`
- **Solução:** executar como o usuário `openchoreo`, conforme o próprio script
  orienta: `docker exec -u openchoreo openchoreo-quick-start bash -lc './install.sh --version v1.1.1'`.
  Todos os scripts subsequentes (`validate-installation.sh`, `check-status.sh`,
  `deploy-react-starter.sh`) também foram executados com `-u openchoreo`.

## 4.4. Falha no *preload* de imagens (não-fatal)

- **Problema:** a etapa `Preloading Docker images for faster deployments...`
  terminou em `[WARNING] Image preloading failed - continuing with installation`.
- **Impacto:** apenas desempenho — as imagens são baixadas sob demanda no momento
  do deploy, deixando o primeiro deploy um pouco mais lento.
- **Solução:** nenhuma ação necessária; a instalação prosseguiu e foi validada com
  sucesso. Registrado apenas para transparência.

## 4.5. Risco antecipado: `--network=host` no Docker Desktop (macOS)

- **Contexto:** o fluxo oficial usa `--network=host`, que no macOS se refere à VM
  interna do Docker (não ao host). A documentação recomenda Colima por isso. Era o
  **principal risco técnico** levantado na análise de requisitos
  ([`01-requisitos-infraestrutura.md`](01-requisitos-infraestrutura.md), seção 1.3).
- **Resultado:** o risco **não se concretizou**. A versão v1.1.1 do quick-start
  trata explicitamente o caso "Docker Desktop on Mac" no seu `entrypoint`
  (ajuste de permissões do socket via grupo `root`) e usa **k3d**, cujo
  *serverlb* publica as portas (`8080`, `19080`, …) que o Docker Desktop
  encaminha para o `localhost` do macOS. Os domínios `*.localhost` resolvem para
  `127.0.0.1`. Resultado: **HTTP 200** no app e no portal a partir do host.
- **Evidência:** [`../evidencias/logs/06-acesso-http.txt`](../evidencias/logs/06-acesso-http.txt)
  e as capturas em [`03-evidencias.md`](03-evidencias.md).

## 4.6. Limitação de RAM (7,7 GiB) — contorno consciente

- **Problema/análise:** o Docker estava com 7,7 GiB, abaixo dos 8 GB recomendados
  para o cenário completo (build + observability).
- **Solução/estratégia:** instalar **apenas o núcleo** (`./install.sh --version v1.1.1`,
  sem `--with-build`/`--with-observability`). O núcleo cabe nos 4 GB exigidos e foi
  suficiente para implantar e acessar a aplicação de exemplo. Os planos *Workflow*
  e *Observability* aparecem como `[NOT INSTALLED]` no `check-status.sh` — esperado.
- **Próximo passo (se necessário):** para habilitar build a partir do código-fonte
  (`./build-deploy-greeter.sh`) ou observabilidade, bastaria **aumentar a memória
  da VM do Docker Desktop para ≥ 8–10 GiB** (Settings → Resources) em uma máquina
  com folga, e reexecutar o `install.sh` (idempotente) com as flags adicionais.

## 4.7. Resumo

| # | Problema | Severidade | Status |
|---|---|---|---|
| 4.1 | Daemon Docker parado | Baixa | Resolvido |
| 4.2 | Queda do Docker no pull | **Média** | Resolvido (retry/relaunch) |
| 4.3 | install.sh como root | Baixa | Resolvido (`-u openchoreo`) |
| 4.4 | Preload de imagens falhou | Baixa | Não-fatal, ignorado |
| 4.5 | `--network=host` no macOS | Risco | Não se concretizou |
| 4.6 | RAM abaixo do ideal | Média | Contornado (instalação do núcleo) |
