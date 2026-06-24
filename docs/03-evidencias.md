# 3. Evidências da execução

**Status final da atividade: ✅ EXECUÇÃO COMPLETA.** O ambiente OpenChoreo foi
instalado, validado e a aplicação de exemplo (`react-starter`) foi implantada e
acessada com sucesso a partir do navegador do host macOS.

## 3.1. Logs de comandos ([`../evidencias/logs/`](../evidencias/logs/))

| Arquivo | Conteúdo |
|---|---|
| [`01-pull-image.txt`](../evidencias/logs/01-pull-image.txt) | `docker pull` da imagem quick-start (inclui a queda/retomada do daemon) |
| [`02-install.txt`](../evidencias/logs/02-install.txt) | Saída completa do `install.sh` (criação do k3d + Helm releases) |
| [`03-validate-status.txt`](../evidencias/logs/03-validate-status.txt) | `validate-installation.sh` (`All validations passed!`) + `kubectl get pods -A` |
| [`04-recursos-openchoreo.txt`](../evidencias/logs/04-recursos-openchoreo.txt) | `helm list`, `kubectl get projects/environments/components`, nodes, cluster |
| [`05-deploy-react-starter.txt`](../evidencias/logs/05-deploy-react-starter.txt) | `deploy-react-starter.sh` (Component/Workload/Deployment/HTTPRoute) |
| [`06-acesso-http.txt`](../evidencias/logs/06-acesso-http.txt) | `curl` do host macOS → **HTTP 200** no app e no Backstage |
| [`07-component-react-starter.txt`](../evidencias/logs/07-component-react-starter.txt) | Component/workload/httproutes + `check-status.sh` (todos `[READY]`) |

## 3.2. Capturas de tela ([`../evidencias/screenshots/`](../evidencias/screenshots/))

| Arquivo | O que mostra |
|---|---|
| [`01-react-starter-app.png`](../evidencias/screenshots/01-react-starter-app.png) | **A aplicação de exemplo em execução** no navegador (`:19080`) |
| [`02-backstage-portal.png`](../evidencias/screenshots/02-backstage-portal.png) | Tela de login do OpenChoreo Portal (Backstage) |
| [`03-backstage-logged-in.png`](../evidencias/screenshots/03-backstage-logged-in.png) | Portal autenticado mostrando **Cluster Data Planes (1) · Connected** |
| [`04-backstage-catalog.png`](../evidencias/screenshots/04-backstage-catalog.png) | Catálogo com o **Project** `Default Project` |
| [`05-backstage-project-component.png`](../evidencias/screenshots/05-backstage-project-component.png) | Project com o **Component `react-starter`**, **Environments** e **Deployment Pipeline** (Dev→Staging→Prod) |

## 3.3. Principais marcos comprovados

- **Cluster k3d** `openchoreo-quick-start` — 1 node `Ready`, K3s v1.32.9.
- **Helm releases (v1.1.1)**: cert-manager, external-secrets, kgateway, openbao,
  thunder, openchoreo-control-plane, openchoreo-data-plane — todos `deployed`.
- **23 pods** no total, todos `Running` (cert-manager, external-secrets,
  control plane, data plane, thunder, openbao, kube-system).
- **Recursos da plataforma**: Project `default`; Environments `development`,
  `staging`, `production`; Component `react-starter` no projeto `default`.
- **Aplicação de exemplo**: `Deployment is available`, `HTTPRoute is ready`,
  resposta **HTTP 200** com o HTML do React App.
- **Portal**: login bem-sucedido como `admin@openchoreo.dev` e navegação até o
  componente implantado.

## 3.4. URLs geradas

| Recurso | URL |
|---|---|
| Aplicação de exemplo (`react-starter`, env. development) | `http://http-react-starter-development-default-cde5190f.openchoreoapis.localhost:19080` |
| Backstage / OpenChoreo Portal | `http://openchoreo.localhost:8080/` |
| OpenChoreo API | `http://api.openchoreo.localhost:8080/` |
| Thunder Identity Provider | `http://thunder.openchoreo.localhost:8080/` |
