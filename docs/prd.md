# Frio Certo — Documento de Requisitos do Produto (PRD)

> **Autor:** @pm (Morgan) · **Versão:** 0.3 (rascunho para revisão do dono) · **Data:** 2026-11-21
> **Base:** `docs/project-brief.md`, `planoprd.md`, protótipo `climatizacao-prototipo02.html` e decisões do dono.
> **Regra:** nada aqui é inventado (Constituição AIOX, Art. IV). O que ainda não foi decidido está marcado **[A DEFINIR]** e não vira história de desenvolvimento até ser decidido.

---

## Metas e Contexto

### Metas
- Zero conflito de agenda nos atendimentos marcados pelo sistema.
- Cliente final consegue agendar um serviço pelo WhatsApp do início ao fim, sem o técnico parar o trabalho.
- Técnico executa e fecha a OS pelo celular (checklist, fotos, assinatura, PDF).
- Nenhuma manutenção preventiva vence sem aviso.
- Recebimentos controlados, com cobrança por Pix ou checkout Asaas.

### Contexto
O público é o **prestador de serviço autônomo** de refrigeração e climatização. Técnicos de refrigeração perdem clientes por marcar atendimentos no mesmo horário e por demorar a responder enquanto estão em serviço. Também não têm tempo para organizar agenda, preços, cadastros e cobranças. O protótipo aprovado (`climatizacao-prototipo02.html`) validou as telas e os fluxos de gestão e de atendimento por IA, mas não tem backend, login, permissões nem IA real.

O Frio Certo transforma esse protótipo em produto: painel de gestão em Next.js, backend e agentes em Python, dados no Supabase com RLS, arquivos no Cloudflare R2 e atendimento no WhatsApp via uazapi, com agentes OpenAI coordenados por um orquestrador. Nesta fase atende **uma única empresa**.

### Histórico de Alterações

| Data | Versão | Descrição | Autor |
|------|--------|-----------|-------|
| 2026-11-15 | 0.1 | Primeiro rascunho a partir do brief | @pm (Morgan) |
| 2026-11-15 | 0.2 | Pendências 1 a 6 respondidas pelo dono: orçamento pelos agentes de atendimento, Vision fora do MVP, fluxo de OS pelos agentes, fontes de verdade da agenda, controles da IA, setup de instância uazapi (Épico 7 reescrito com base em `docs/Uazapi/`) | @pm (Morgan) |
| 2026-11-21 | 0.3 | Decisões do dono sobre o planejamento: nova ordem e renumeração dos épicos (11 épicos, alinhados aos 3 módulos de liberação); OS (criação e aprovação) no Módulo 1; lembrete 24 h antes da visita; agentes especialistas num épico próprio depois da base de conhecimento; transbordo com atendente único; horário de atendimento humano; agentes 24/7 | @pm (Morgan) |

---

## Requisitos

### Funcionais

**Acesso e permissões**
- **FR1:** O sistema deve ter login de usuários.
- **FR2:** Deve existir um usuário **Developer** (dono do sistema) com acesso a todas as funcionalidades, sem precisar de cadastro de usuário nem de perfil.
- **FR3:** A **Área Developer** deve ser visível somente para o usuário Developer e concentrar as configurações do sistema, incluindo o controle da IA.
- **FR4:** O módulo **Perfil** deve permitir criar perfis com permissão granular (RBAC) por funcionalidade e por operação: criar, visualizar, editar e excluir.
- **FR5:** Usuários comuns devem ser cadastrados e vinculados a um perfil; cada tela e ação respeita as permissões do perfil.

**Cadastros**
- **FR6:** Cadastro da **empresa**: nome (marca exibida no app), responsável, chave Pix e **horário de funcionamento** (dias e horários).
- **FR7:** Cadastro de **serviços e peças** em **modal**, com categoria e preço. Cada serviço deve informar a **duração do atendimento** e o **tempo até a liberação da agenda**. Essa mesma base de serviços e valores **alimenta a base de conhecimento do RAG** (FR41) — preço e serviço ficam num lugar só.
- **FR8:** Um item de catálogo usado em alguma OS não pode ser excluído.
- **FR9:** Cadastro de **técnicos** com nome, telefone, cor na agenda e **jornada de trabalho**.
- **FR10:** Cadastro de **clientes** (pessoa física ou empresa) com telefone/WhatsApp e endereço preenchido automaticamente pelo CEP.
- **FR11:** Cadastro de **equipamentos** vinculados ao cliente: tipo, marca, BTUs, número de série, local no imóvel e periodicidade da preventiva.
- **FR12:** O sistema deve calcular a próxima preventiva de cada equipamento e classificá-lo como em dia, vencendo em até 15 dias ou vencido.

**Agenda e Ordens de Serviço**
- **FR13:** A agenda deve funcionar de forma **semelhante ao Google Agenda** (visões de dia, semana e mês, com eventos), mostrar os atendimentos por técnico e permitir reagendar arrastando o atendimento.
- **FR14:** A disponibilidade tem **três fontes de verdade**: (1) o horário de funcionamento da empresa (FR6), (2) a jornada de cada técnico (FR9), registrada como **eventos de jornada** na agenda, e (3) a própria agenda. A agenda deve oferecer **apenas horários livres**, considerando a duração do serviço e o tempo de liberação da agenda, sem sobrepor atendimentos do mesmo técnico.
- **FR15:** Criar **OS** com cliente, tipo (Instalação, Preventiva, Corretiva, Orçamento/Visita), técnico, data e hora, problema relatado, equipamentos e itens do catálogo.
- **FR16:** A OS deve seguir os status Pendente → Agendada → Em andamento → Concluída, ou Cancelada.
- **FR17:** A execução da OS deve registrar checklist, estado dos filtros, fotos de antes e depois e a assinatura do cliente com o nome de quem assinou.
- **FR18:** Ao concluir uma OS, o sistema deve gerar o relatório em PDF e permitir enviá-lo ao cliente pelo WhatsApp.
- **FR19:** Ao concluir uma preventiva, o sistema deve atualizar a data da próxima preventiva do equipamento.
- **FR20:** A OS deve manter o histórico de tudo o que aconteceu com ela.
- **FR21:** A tela **Meu dia** deve mostrar ao técnico, no celular, os atendimentos do dia e permitir executá-los (FR17).

**Orçamentos e Financeiro**
- **FR22:** Criar **orçamento** com cliente, itens do catálogo e observações; status Rascunho → Enviado → Aprovado ou Recusado.
- **FR23:** Enviar o orçamento em PDF pelo WhatsApp; um orçamento aprovado deve virar OS com um clique.
- **FR24:** O **financeiro** deve listar valores a receber e recebidos e permitir registrar recebimento (forma de pagamento e data).
- **FR25:** O usuário pode **contratar o checkout Asaas** para cobrar os clientes; se não contratar, o sistema usa somente a **chave Pix** cadastrada.

**WhatsApp e atendimento**
- **FR26:** Um **modal de instância** deve permitir ao cliente do sistema conectar o próprio número de WhatsApp pela uazapi: o sistema cria a instância, configura o webhook, exibe o QR Code e confirma a conexão (detalhes na História 1.7 e no Épico 2, com base em `docs/Uazapi/`). Esse número é o **WhatsApp institucional** da empresa.
- **FR27:** A **caixa de atendimento** deve listar as conversas, com filtros (Todas, Abertas, Aguardando cliente, Resolvidas) e o painel de dados do contato (cadastro, equipamentos, OS, financeiro).
- **FR28:** O atendente deve poder responder, adicionar nota interna, transferir a conversa e **pausar ou retomar a IA** em um contato.

**Agentes de IA**
- **FR29:** Um **agente orquestrador** deve interpretar cada mensagem de forma **híbrida** (palavras-chave + significado) e encaminhá-la ao agente especialista correto.
- **FR30:** O **agente técnico** deve responder dúvidas consultando a **base de conhecimento** da empresa (RAG híbrido).
- **FR31:** **Contato × cliente.** Todo número que fala com a automação pela primeira vez é gravado apenas como **contato** (ID + número), para registrar a passagem pela automação. Ele **só vira cliente** quando a conversa resulta em OS ou visita. **Cliente antigo** é quem já teve OS ou visita.
- **FR32:** O **agente de novos clientes** deve conduzir a conversa do contato. **Proteção contra concorrentes:** antes de informar qualquer valor, o agente solicita **nome e endereço do local do serviço**, com a justificativa de buscar o melhor preço. O **documento** (CPF/CNPJ) e o restante do cadastro só são solicitados quando a conversa leva a uma OS ou visita; aí o agente cria o cliente e a OS.
- **FR33:** O **agente de clientes antigos** deve identificar o cliente pelo telefone, conduzir a conversa e **criar a OS**.
- **FR34:** Os **agentes de atendimento** (novos e antigos) também fazem **orçamentos**, a partir da base de serviços e valores (FR7).
- **FR35:** Para agendar, os agentes devem consultar a agenda (FR14) e a base de serviços (FR7) e informar horário e valor reais. O **sistema escolhe o técnico** com horário livre.
- **FR36:** Toda OS criada por agente nasce com status **Pendente** e precisa ser **aprovada por uma pessoa** antes de virar Agendada.
- **FR37:** Pelo **WhatsApp institucional**, o sistema avisa o técnico sobre OS nova e envia **lembrete ao cliente 24 horas antes** da visita, pedindo a confirmação.
- **FR38:** O **agente financeiro** deve atender **somente clientes antigos**, sobre contas a receber.
- **FR39:** O **transbordo humano** é acionado, por qualquer agente, quando: o **serviço ou o valor não existe** na base de serviços nem em nenhuma outra base do sistema; a **dúvida não tem resposta confiável** na base de conhecimento (RAG); ou o cliente **pede para falar com uma pessoa**. Também cobre assuntos financeiros enquanto o agente financeiro não estiver liberado (Módulo 3).
- **FR40:** O transbordo vai sempre para um **atendente humano único**, cadastrado com **nome e número**. Ele responde por todo transbordo (financeiro, novos clientes, clientes antigos e dúvidas fora da base), recebe um **aviso no próprio número pelo WhatsApp institucional** e **responde pela caixa de atendimento** do app. A IA fica pausada no contato até o atendente devolver.
- **FR44:** O **horário de atendimento humano** é cadastrado em **modal**, numa **aba própria ("Horário de atendimento") da página Base de Conhecimento**, conforme a necessidade do cliente do sistema. Esse horário vale **somente para o transbordo** (perguntas fora da base e pedido de atendimento humano feito pelo lead). Ele é diferente do horário de funcionamento da empresa (FR6), que alimenta a agenda.
- **FR45:** **Transbordo fora do horário de atendimento humano:** a IA informa o horário de atendimento, a conversa fica na caixa de atendimento como **"Aguardando atendente"** e o atendente recebe o aviso **na hora** mesmo assim; ele decide se responde.

**Base de conhecimento**
- **FR41:** A base de conhecimento (RAG híbrido) é formada pela **base de serviços e valores** (FR7) e por outros dados da empresa que o usuário inclui ou digita (horários de funcionamento etc.).

**Controle da IA (Área Developer)**
- **FR42:** A Área Developer deve ter estes controles da IA: (1) chaves e conexões (OpenAI, uazapi, Asaas, R2), (2) modelo por agente (GPT-4o ou GPT-4o mini), (3) ligar e desligar cada agente, (4) instruções (prompt) de cada agente, (5) palavras-chave do orquestrador, (6) regra do transbordo, (7) limite de gasto da OpenAI e (8) registros das decisões da IA e do custo por conversa.

**Painel**
- **FR43:** O painel deve mostrar indicadores (faturamento, OS em andamento e concluídas), agenda do dia, preventivas a vencer, recebimentos pendentes e OS sem agendamento.

### Não Funcionais

- **NFR1:** Toda a interface e as mensagens dos agentes em **português do Brasil**.
- **NFR2:** Web **responsiva**: gestão no computador e uso pelo técnico no celular.
- **NFR3:** Todas as tabelas do Supabase com **RLS** ativado; o acesso respeita as permissões do perfil (FR4).
- **NFR4:** Segredos (chaves OpenAI, uazapi, Supabase, Asaas, R2) somente em variáveis de ambiente, **nunca no repositório**.
- **NFR5:** Fotos e PDFs armazenados no **Cloudflare R2**, não no banco.
- **NFR6:** Um **cron** deve manter o Supabase (plano free) ativo, evitando a pausa por inatividade.
- **NFR7:** Os agentes **nunca inventam** preço nem horário: sempre consultam catálogo e agenda.
- **NFR8:** Dados pessoais de clientes tratados com cuidado de privacidade **[A DEFINIR com o @architect o nível de exigência, ex.: LGPD]**.
- **NFR9:** Metas de desempenho e de tempo de resposta da IA **[A DEFINIR]**.
- **NFR10:** O **token administrativo da uazapi** e os **tokens das instâncias** ficam somente no backend; o navegador nunca chama a uazapi diretamente.
- **NFR11:** O webhook da uazapi deve responder **200 OK imediatamente** e processar a mensagem em segundo plano (exigência da uazapi para evitar reenvios e bloqueio).
- **NFR12:** Envios pelo WhatsApp devem simular comportamento humano (atraso entre mensagens e status "digitando"), para reduzir o risco de bloqueio do número.
- **NFR13:** Os agentes de IA (respostas pela base de conhecimento, orçamento e marcação de serviços) funcionam **24 horas por dia, 7 dias por semana**. Só o transbordo segue o horário de atendimento humano (FR44).

---

## Objetivos de Design da Interface

### Visão Geral de UX
Seguir o **protótipo aprovado** `climatizacao-prototipo02.html`: painel limpo, menu lateral por seções (Operação, Cadastros, Comercial, Canais, Sistema), tema claro e escuro.

### Principais Paradigmas de Interação
- Listas com busca e filtros; formulários em modal.
- Agenda com arrastar e soltar.
- Execução de OS no celular com fotos e assinatura na tela.
- Caixa de atendimento em três colunas: conversas, conversa aberta, dados do contato.

### Telas e Visões Principais
Login · Painel · Meu dia · Agenda · Ordens de serviço · Atendimento · Canais (instância WhatsApp) · Transbordo · Clientes · Equipamentos · Serviços e peças · Técnicos · Orçamentos · Financeiro · Configurações · Perfis e usuários · Área Developer.

### Acessibilidade: [A DEFINIR]

### Identidade Visual
A do protótipo. Nome da marca editável em Configurações.

### Dispositivos e Plataformas: Web Responsiva

---

## Premissas Técnicas

### Estrutura do Repositório: Monorepo
Um único repositório no GitHub com três pastas, que são também os três serviços no Easypanel (aprovado pelo dono em 2026-11-21):

| Pasta / serviço | Conteúdo |
|---|---|
| `frontend` | Next.js + pacotes `@friocerto/theme`, `icons`, `ui` e `modules` |
| `backend` | API Python (FastAPI), monólito modular com uma pasta por módulo |
| `worker` | Webhook do WhatsApp, agentes de IA e tarefas agendadas (Python) |

### Arquitetura de Serviços
- **Frontend:** Next.js (serviço `frontend`).
- **Backend:** Python com FastAPI, monólito modular; os módulos são ligados por configuração (serviço `backend`).
- **Agentes de IA, WhatsApp e tarefas agendadas:** Python, processo separado (serviço `worker`).
- **Multi-tenant futuro:** toda tabela nasce com `empresa_id` (valor fixo na fase 1).
- **Banco:** Supabase com RLS e pgvector.
- **Arquivos:** Cloudflare R2.
- **Hospedagem:** VPS Hostinger com Easypanel.
- **Integrações:** uazapi (WhatsApp), OpenAI (GPT-4o e GPT-4o mini; Vision só no futuro), Asaas (checkout), ViaCEP (endereço).

### Liberação por Módulo
O sistema é desenvolvido completo, mas liberado por módulo, de forma cumulativa (catálogo em `frontend/packages/modules/src/catalog.ts`):

| Módulo | Inclui | Épicos que o liberam |
|---|---|---|
| 1 — Atendimento / Agendamento | WhatsApp, agentes, cadastros, agenda e **OS (criação e aprovação)** | 1 a 8 |
| 2 — + Ordem de Serviço | Equipamentos e **execução** da OS (Meu dia, checklist, fotos, assinatura, PDF) | 9 |
| 3 — + Orçamento / Financeiro | Orçamentos, contas a receber, Pix/Asaas e agente financeiro | 10 |

> **Decisão do dono (2026-11-21):** a criação e a aprovação da OS ficam no Módulo 1, porque os agentes criam OS Pendente. A execução da OS fica no Módulo 2.

### Requisitos de Teste
**[A DEFINIR com o @architect]** — o método AIOX exige testes para toda funcionalidade nova e quality gate do @qa antes do push.

### Premissas Técnicas Adicionais
- **OpenAI Vision fica fora do MVP.** Será usado numa funcionalidade futura, ainda em análise pelo dono: **entrada de compras via OCR**.
- **uazapi:** servidor próprio do dono (`UAZAPI_BASE_URL`, ex.: `https://optus.uazapi.com`), versão uazapiGO v2. Referências em `docs/Uazapi/`.
- Divisão de uso entre GPT-4o e GPT-4o mini por agente **[A DEFINIR com o @architect]**.
- Autenticação: provedor a definir pelo @architect.

---

## Lista de Épicos

1. **Épico 1 — Fundação e Arquitetura:** arquitetura, projeto, banco, login, Área Developer, publicação no servidor e validação do contrato da uazapi.
2. **Épico 2 — WhatsApp e Caixa de Atendimento:** instância uazapi, recebimento e envio de mensagens e caixa de atendimento.
3. **Épico 3 — Base dos Agentes e Transbordo:** controle da IA, orquestrador, atendente único de transbordo, horário de atendimento humano e esqueleto dos agentes especialistas.
4. **Épico 4 — Perfis e Usuários:** RBAC granular.
5. **Épico 5 — Cadastros do Atendimento:** empresa, serviços e peças, técnicos e clientes.
6. **Épico 6 — Agenda e OS:** agenda sem conflito e OS (criação e aprovação).
7. **Épico 7 — Base de Conhecimento:** RAG híbrido alimentado pelo usuário.
8. **Épico 8 — Agentes Especialistas:** agente técnico, novos clientes, clientes antigos e fluxo de criação de OS. **Libera o Módulo 1.**
9. **Épico 9 — Execução da OS:** equipamentos, Meu dia, PDF e próxima preventiva. **Libera o Módulo 2.**
10. **Épico 10 — Orçamentos e Financeiro:** orçamentos, recebimentos, Pix, Asaas e agente financeiro. **Libera o Módulo 3.**
11. **Épico 11 — Painel e Alertas:** indicadores e avisos.

> **Por que essa ordem (decisão do dono, 2026-11-21):** o WhatsApp e a base dos agentes vêm logo depois da fundação. Até os agentes especialistas ficarem prontos (Épico 8), os especialistas passam tudo ao atendente humano, então o atendimento pelo WhatsApp já funciona sem a IA inventar preço ou horário (NFR7). Os agentes especialistas dependem de cadastros, agenda, OS e base de conhecimento, por isso ficam no Épico 8.
> **Pós-MVP:** canal Instagram.

### Correspondência com a numeração da v0.2

| v0.2 | v0.3 | v0.2 | v0.3 |
|---|---|---|---|
| — (nova) | 1.1 Arquitetura | 4.1 | 6.1 |
| 1.1 | 1.2 | 4.2 | 6.2 |
| 1.2 | 1.3 | 4.3 | 6.3 |
| 1.3 | 1.4 | 4.4 | 9.2 |
| 1.4 | 1.5 | 4.5 | 9.3 |
| 1.5 | 1.6 | 5.1 | 10.1 |
| 7.1 | 1.7 | 5.2 | 10.2 |
| 7.2 a 7.7 | 2.1 a 2.6 | 5.3 | 10.3 |
| 8.8 | 3.1 | 6.1 | 7.1 |
| 8.1 | 3.2 | 6.2 | 7.2 |
| 8.7 | 3.3 | 8.5 | 8.1 |
| — (nova) | 3.4 Horário de atendimento humano | 8.2 | 8.2 |
| — (nova) | 3.5 Esqueleto dos especialistas | 8.3 | 8.3 |
| 2.1 a 2.3 | 4.1 a 4.3 | 8.4 | 8.4 |
| 3.1 a 3.4 | 5.1 a 5.4 | 8.6 | 10.4 |
| 3.5 | 9.1 | 9.1 e 9.2 | 11.1 e 11.2 |

---

## Épico 1 — Fundação e Arquitetura

**Objetivo:** deixar o projeto rodando de ponta a ponta — arquitetura definida, repositório, banco com RLS, login, Área Developer, publicação no servidor e contrato da uazapi validado — para que todos os épicos seguintes tenham onde ser construídos.

### História 1.1 — Arquitetura e especificação de frontend
Como **dono do sistema**, quero as decisões técnicas pendentes resolvidas antes do código, para não refazer trabalho.

**Critérios de aceite**
1. @architect cria `docs/architecture.md` resolvendo as premissas marcadas **[A DEFINIR com o @architect]** (provedor de autenticação, requisitos de teste, nível de privacidade/LGPD, divisão GPT-4o/mini por agente e integração Asaas).
2. @ux-design-expert cria `docs/front-end-spec.md` (ver "Prompt para o UX Expert").

### História 1.2 — Estrutura do projeto
Como **dono do sistema**, quero o projeto organizado (frontend Next.js, backend e worker Python no mesmo repositório), para começar o desenvolvimento com padrão definido.

**Critérios de aceite**
1. Frontend, backend e worker sobem localmente com um comando documentado no README.
2. Variáveis de ambiente documentadas em `.env.example`, sem segredos no repositório.

> O frontend (Next.js e pacotes de tema, ícones, componentes e módulos) já existe desde o PR #3.

### História 1.3 — Banco de dados e manutenção do plano free
Como **dono do sistema**, quero o Supabase configurado com RLS e o cron ativo, para ter um banco seguro que não entra em pausa.

**Critérios de aceite**
1. Projeto Supabase conectado ao backend.
2. RLS ativado por padrão nas tabelas criadas; toda tabela com `empresa_id`.
3. Cron executando periodicamente para manter o projeto ativo.

### História 1.4 — Login e usuário Developer
Como **dono do sistema**, quero entrar com meu usuário Developer e ter acesso a tudo, sem precisar de cadastro de perfil.

**Critérios de aceite**
1. Tela de login funcional.
2. O usuário Developer acessa todas as funcionalidades sem perfil vinculado.

### História 1.5 — Área Developer
Como **dono do sistema**, quero uma área exclusiva com as configurações do sistema e o controle da IA.

**Critérios de aceite**
1. A área só aparece e só pode ser acessada pelo usuário Developer.
2. Contém a estrutura para as configurações do sistema e da IA (os controles da IA são detalhados na História 3.1).

### História 1.6 — Publicação no servidor
Como **dono do sistema**, quero o projeto publicado na VPS Hostinger via Easypanel, para acessar pela internet.

**Critérios de aceite**
1. Os serviços `frontend`, `backend` e `worker` publicados no Easypanel.
2. Página de verificação de saúde respondendo.
3. URL pública do webhook disponível para o Épico 2.

### História 1.7 — Validar o contrato da uazapi (spike)
Como **desenvolvedor**, quero confirmar no servidor uazapi do dono quais endpoints e headers valem, para não construir em cima de documentação divergente.

**Referências:** `docs/Uazapi/` (5 arquivos, fornecidos pelo dono em 2026-11-15). Eles vêm de projetos anteriores e de versões diferentes da uazapi, então **há divergências de endpoints**:

| Ponto | Opção A (uazapiGO v2 — `contrato-uazapi.md`, `configuracao-instancia-uazapi.md`) | Opção B (`instancia_uazapi.md`, `DICA_GEMS_GEMINI_UAZAPI.txt`) |
|---|---|---|
| Criar instância | `POST /instance/init` | `POST /instance/create` |
| Header de instância | `token` | `apikey` (legado v1) |
| Configurar webhook | **[a confirmar]** | `POST /webhook/set/{instance}` |
| Gerar QR Code | `POST /instance/connect` (corpo vazio) | `GET /instance/connect/{instance}` |
| Ver status | `GET /instance/status` | `GET /instance/connectionState/{instance}` |
| Enviar texto | `POST /send/text` | `POST /message/sendText/{instance}` |

> A Opção A é a indicada como canônica (uazapiGO v2) nas referências. O header do token admin é `admintoken`, em minúsculas e sem "Bearer".

**Critérios de aceite**
1. Testados no servidor do dono: criar instância, configurar webhook, gerar QR Code, ver status, enviar texto, desconectar e excluir.
2. Resultado registrado em `docs/Uazapi/contrato-validado.md` (endpoint, header, corpo e resposta de cada operação), resolvendo a tabela de divergências.
3. Nenhum token real gravado no repositório.

---

## Épico 2 — WhatsApp e Caixa de Atendimento

**Objetivo:** conectar o WhatsApp institucional pela uazapi e receber e responder as mensagens dentro do sistema.

**Fluxo do setup de instância (resumo das referências):**
```
Modal "Conectar WhatsApp" → backend cria a instância (token admin)
  → recebe o token da instância → configura o webhook
  → pede a conexão (corpo vazio = QR Code) → modal mostra o QR Code
  → status "connecting" → cliente escaneia → status "connected" → modal fecha
```

> Os endpoints usados neste épico são os validados na História 1.7.

### História 2.1 — Cadastro de instância e acesso seguro à uazapi
Como **dono do sistema**, quero que todas as chamadas à uazapi passem pelo backend, para proteger o token administrativo e os tokens das instâncias.

**Critérios de aceite**
1. Tabela de instâncias no Supabase (com RLS) guardando nome, número, ID e token da instância na uazapi, status, QR Code, webhook configurado e nome do perfil conectado.
2. Backend Python com as operações: criar, conectar, ver status, desconectar e excluir instância.
3. O token administrativo fica só em variável de ambiente (`UAZAPI_ADMIN_TOKEN`); o token da instância nunca vai para o navegador (NFR10).
4. Operações de instância registradas em log de auditoria.

### História 2.2 — Modal "Conectar WhatsApp"
Como **cliente do sistema**, quero conectar meu número de WhatsApp pelo app, escaneando um QR Code.

**Critérios de aceite**
1. O modal pede o nome da instância e o número.
2. Ao confirmar, o sistema cria a instância, **configura o webhook antes de mostrar o QR Code** e exibe o QR Code.
3. O modal acompanha o status (consulta a cada 5 segundos e/ou evento de conexão do webhook) e **fecha sozinho** quando o status vira "connected".
4. Se o QR Code expirar, aparece o botão **"Gerar novo QR Code"**.
5. Mensagens de erro claras (falha ao criar, token inválido, servidor fora do ar).

### História 2.3 — Gerenciar a instância
Como **cliente do sistema**, quero ver o status do meu WhatsApp e poder desconectar, reconectar ou trocar o número.

**Critérios de aceite**
1. Tela mostra status, número e nome do perfil conectado.
2. Desconectar faz o logout na uazapi; excluir faz **logout antes de excluir**, para não deixar sessão pendurada.
3. Ligar e desligar a IA para a instância.

### História 2.4 — Receber mensagens (webhook)
Como **sistema**, quero receber as mensagens e os eventos de conexão enviados pela uazapi.

**Critérios de aceite**
1. Rota de webhook identificada pelo token da instância (ex.: `POST /webhook/{token}`).
2. Responde **200 OK imediatamente** e processa em segundo plano (NFR11).
3. Normaliza os formatos v1 e v2 do payload: telefone (só dígitos com DDI), nome, texto, tipo de mídia e se a mensagem é minha.
4. Cria a tabela de **contatos** (FR31) e salva contato, conversa e mensagem.
5. Eventos de conexão atualizam o status da instância.

### História 2.5 — Enviar mensagens
Como **sistema**, quero enviar textos e arquivos pelo WhatsApp institucional.

**Critérios de aceite**
1. Envio de texto e de mídia (PDF de OS e de orçamento) pela uazapi, com o header da instância.
2. Atraso entre mensagens e status "digitando" (NFR12).
3. Usado pelas respostas da IA, pelos avisos ao técnico e ao atendente, pelos lembretes ao cliente (FR37) e pelas respostas manuais do atendente.

### História 2.6 — Caixa de atendimento
Como **atendente**, quero ver e tratar as conversas.

**Critérios de aceite**
1. Lista com filtros (Todas, Abertas, Aguardando cliente, Resolvidas) e o estado **"Aguardando atendente"** (FR45).
2. Painel com os dados do contato; cadastro, equipamentos, OS e financeiro aparecem quando os épicos correspondentes estiverem prontos.
3. Responder, adicionar nota interna, transferir e pausar/retomar a IA.

---

## Épico 3 — Base dos Agentes e Transbordo

**Objetivo:** colocar a estrutura de IA no ar — controles, orquestrador e transbordo para o atendente humano — para que o atendimento pelo WhatsApp funcione desde já, com um humano respondendo o que a IA ainda não sabe.

### História 3.1 — Controle da IA na Área Developer
Como **dono do sistema**, quero controlar a IA pela Área Developer.

**Critérios de aceite**
1. Chaves e conexões: OpenAI, uazapi, Asaas e R2, guardadas com segurança.
2. Modelo por agente (GPT-4o ou GPT-4o mini).
3. Ligar e desligar cada agente.
4. Editar as instruções (prompt) de cada agente sem mexer no código.
5. Editar as palavras-chave do orquestrador.
6. Regra do transbordo (nível de incerteza que aciona o atendente humano).
7. Limite de gasto da OpenAI por dia ou por mês.
8. Registros das decisões da IA e do custo por conversa.

### História 3.2 — Agente orquestrador
Como **sistema**, quero interpretar cada mensagem e chamar o agente certo.

**Critérios de aceite**
1. Classificação híbrida (palavras-chave + significado).
2. Encaminha para: técnico, novos clientes, clientes antigos, financeiro ou transbordo.

> **Pendência a cobrar neste épico:** criar a **persona de cada agente** (nome, personalidade e tom de voz).

### História 3.3 — Atendente único de transbordo
Como **prestador de serviço autônomo**, quero que todo atendimento que a IA não resolve vá para uma única pessoa.

**Critérios de aceite**
1. Cadastro de **um atendente humano** com **nome e número**.
2. Recebe o transbordo de qualquer agente, nos casos do FR39.
3. O atendente recebe um **aviso no próprio número pelo WhatsApp institucional** e **responde pela caixa de atendimento** do app.
4. A IA fica pausada no contato até o atendente devolver.

### História 3.4 — Horário de atendimento humano
Como **prestador de serviço autônomo**, quero definir em que horário atendo pessoalmente.

**Critérios de aceite**
1. Página **Base de Conhecimento** criada com a aba **"Horário de atendimento"**; as abas de conteúdo do RAG entram no Épico 7.
2. Modal para cadastrar dias e horários do atendimento humano (FR44).
3. O horário vale **somente para o transbordo**; os agentes funcionam 24/7 (NFR13).
4. Fora do horário: a IA informa o horário de atendimento, a conversa fica "Aguardando atendente" e o atendente é avisado na hora, decidindo se responde (FR45).

### História 3.5 — Esqueleto dos agentes especialistas
Como **sistema**, quero os agentes especialistas já ligados ao orquestrador, para que o atendimento funcione antes de eles terem regras de negócio.

**Critérios de aceite**
1. Agentes técnico, de novos clientes, de clientes antigos e financeiro existem e recebem a conversa do orquestrador.
2. Enquanto o Épico 8 (e, no caso do financeiro, o Épico 10) não estiver pronto, eles passam a conversa ao atendente único (História 3.3), respeitando o horário de atendimento (História 3.4).
3. Nenhum agente informa preço ou horário nesta fase (NFR7).

---

## Épico 4 — Perfis e Usuários

**Objetivo:** controlar quem vê e faz o quê, com perfis de permissão granular para cada funcionalidade e operação.

### História 4.1 — Cadastro de perfis com permissões
Como **administrador**, quero criar perfis definindo, para cada funcionalidade, se o perfil pode criar, visualizar, editar e excluir.

**Critérios de aceite**
1. CRUD de perfis.
2. Matriz de permissões cobrindo todas as funcionalidades do sistema e as quatro operações.

### História 4.2 — Cadastro de usuários
Como **administrador**, quero cadastrar usuários e vinculá-los a um perfil.

**Critérios de aceite**
1. CRUD de usuários com vínculo obrigatório a um perfil.
2. Usuário sem permissão não vê a tela nem o botão correspondente.

### História 4.3 — Permissões aplicadas no banco
Como **dono do sistema**, quero que as permissões também valham no banco (RLS), para que ninguém contorne a tela.

**Critérios de aceite**
1. As políticas de RLS respeitam o perfil do usuário.
2. O usuário Developer continua com acesso total.
3. As tabelas criadas nos Épicos 2 e 3 (instâncias, contatos, conversas, mensagens, configurações da IA e transbordo) passam a seguir essas políticas.

---

## Épico 5 — Cadastros do Atendimento

**Objetivo:** cadastrar tudo de que a agenda, as OS e os agentes precisam.

### História 5.1 — Dados da empresa
Como **dono**, quero cadastrar nome, responsável, chave Pix e horário de funcionamento da empresa.

**Critérios de aceite**
1. O nome cadastrado aparece como marca no app.
2. A chave Pix fica disponível para OS, orçamentos e financeiro.
3. O horário de funcionamento (dias e horários) é usado pela agenda (FR14).

### História 5.2 — Serviços e peças (modal)
Como **dono**, quero cadastrar serviços e peças num modal, com preço e, nos serviços, a duração e o tempo de liberação da agenda.

**Critérios de aceite**
1. CRUD em modal, com categoria e preço.
2. Serviços exigem duração e tempo de liberação da agenda.
3. Itens usados em OS não podem ser excluídos.
4. Os serviços e valores ficam disponíveis como base de conhecimento do RAG (Épico 7).

### História 5.3 — Técnicos e jornada
Como **dono**, quero cadastrar os técnicos com telefone, cor na agenda e jornada de trabalho.

**Critérios de aceite**
1. CRUD de técnicos.
2. A cor escolhida é usada na agenda.
3. A jornada de cada técnico gera eventos de jornada na agenda (FR14).

### História 5.4 — Clientes
Como **atendente**, quero cadastrar clientes com endereço preenchido pelo CEP.

**Critérios de aceite**
1. CRUD de pessoa física e empresa.
2. Ao digitar o CEP, o endereço é preenchido; se o CEP não for encontrado, o preenchimento é manual.
3. Atalhos para abrir o WhatsApp do cliente e o endereço no mapa.
4. Conversão de contato em cliente (FR31), usando a tabela de contatos da História 2.4.

---

## Épico 6 — Agenda e OS

**Objetivo:** agendar sem conflito e criar e aprovar a OS (Módulo 1).

### História 6.1 — Cálculo de horários livres
Como **atendente**, quero que o sistema mostre só horários realmente livres para cada técnico.

**Critérios de aceite**
1. O cálculo usa as três fontes de verdade: horário de funcionamento, jornada do técnico (eventos de jornada) e agenda.
2. Considera a duração do serviço e o tempo de liberação da agenda.
3. Nunca oferece horário que sobreponha outro atendimento do mesmo técnico.

### História 6.2 — Criar e gerenciar OS
Como **atendente**, quero criar a OS com cliente, tipo, técnico, data, problema, equipamentos e itens.

**Critérios de aceite**
1. Os quatro tipos e os cinco status de OS.
2. Itens puxados do catálogo, com total calculado.
3. Histórico de alterações da OS.
4. Aprovação da OS Pendente por uma pessoa (FR36).

### História 6.3 — Agenda no estilo Google Agenda
Como **dono**, quero uma agenda parecida com o Google Agenda, com os atendimentos e as jornadas dos técnicos.

**Critérios de aceite**
1. Visões de dia, semana e mês, com a cor de cada técnico.
2. Eventos de jornada e de atendimento visíveis na agenda.
3. Arrastar um atendimento reagenda, respeitando a regra de horários livres (6.1).

---

## Épico 7 — Base de Conhecimento

**Objetivo:** dar ao agente técnico uma base confiável com os dados da empresa.

### História 7.1 — Alimentar a base
Como **dono**, quero que meus serviços e valores, e outras informações que eu incluir ou digitar, formem a base de conhecimento.

**Critérios de aceite**
1. A base de serviços e valores (História 5.2) entra automaticamente na base de conhecimento e é atualizada quando o serviço muda.
2. Abas na página Base de Conhecimento (criada na História 3.4) para incluir e digitar outros conteúdos (políticas etc.).
3. Conteúdo preparado para busca híbrida (pgvector).

### História 7.2 — Busca híbrida
Como **agente técnico**, quero encontrar a resposta certa combinando palavra-chave e significado.

**Critérios de aceite**
1. Busca por palavra-chave e vetorial combinadas.
2. Quando não houver resposta confiável, aciona o transbordo para o atendente único, respeitando o horário de atendimento humano.

---

## Épico 8 — Agentes Especialistas

**Objetivo:** atender o cliente automaticamente no WhatsApp, do primeiro "oi" à OS agendada. **Ao fim deste épico, o Módulo 1 pode ser liberado.**

### História 8.1 — Agente técnico
Como **cliente**, quero tirar dúvidas e receber respostas baseadas nos dados da empresa.

**Critérios de aceite**
1. Responde usando a base de conhecimento (Épico 7).
2. Sem resposta confiável, aciona o atendente único.

### História 8.2 — Agente de novos clientes
Como **contato novo**, quero ser atendido, receber orçamento e ter meu serviço agendado.

**Critérios de aceite**
1. Identifica que o telefone não é de um cliente e grava apenas o **contato** (ID + número).
2. Antes de informar qualquer valor, pede **nome e endereço do local do serviço** ("para buscar o melhor preço") — proteção contra concorrentes.
3. Faz o orçamento a partir da base de serviços e valores.
4. Só pede o **documento** (CPF/CNPJ) e completa o cadastro quando a conversa leva a uma OS ou visita.

### História 8.3 — Agente de clientes antigos
Como **cliente antigo**, quero ser reconhecido e agendar rapidamente.

**Critérios de aceite**
1. Identifica o cliente pelo telefone e cumprimenta pelo nome.
2. Mostra os equipamentos cadastrados e avisa sobre preventiva vencida — **ativo somente com o Módulo 2 liberado** (depende da História 9.1).
3. Faz orçamento e agenda a partir da base de serviços e da agenda.

### História 8.4 — Fluxo de criação de OS pelos agentes
Como **dono**, quero um fluxo único e seguro para os agentes criarem OS.

**Fluxo aprovado pelo dono:**
```
mensagem → orquestrador procura o telefone
  ├─ não é cliente → agente de novos clientes (grava só o contato)
  └─ é cliente → agente de clientes antigos
→ entende o serviço na base de serviços/RAG (não existe → atendente único)
→ pedido de valor de contato novo → pede nome + endereço antes do preço
→ consulta horários livres → oferece 2 ou 3 opções (sistema escolhe o técnico)
→ resumo (serviço, data e hora, endereço, valor) → cliente confirma
→ contato novo: pede documento e vira cliente
→ confere de novo o horário → cria OS com status PENDENTE
→ pessoa aprova → OS Agendada → aviso ao técnico + confirmação ao cliente
→ lembrete ao cliente 24 h antes da visita (WhatsApp institucional)
```

**Critérios de aceite**
1. A OS só é criada com horário livre confirmado (Épico 6) e serviço da base de serviços.
2. O horário é conferido de novo no momento de gravar a OS (evita dois clientes no mesmo horário).
3. Toda OS criada por agente nasce **Pendente** e aparece para aprovação humana.
4. Após a aprovação, o técnico é avisado e o cliente recebe a confirmação pelo WhatsApp institucional.
5. Lembrete ao cliente **24 horas antes** da visita, pedindo a confirmação.

---

## Épico 9 — Execução da OS

**Objetivo:** executar a OS completa pelo celular, do atendimento ao PDF. **Ao fim deste épico, o Módulo 2 pode ser liberado.**

### História 9.1 — Equipamentos e preventiva
Como **dono**, quero cadastrar os equipamentos dos clientes e acompanhar a situação da preventiva.

**Critérios de aceite**
1. CRUD de equipamentos vinculados a um cliente.
2. Situação calculada: em dia, vence em até 15 dias, vencida.
3. Filtro por situação.

### História 9.2 — Execução da OS e Meu dia
Como **técnico**, quero executar minhas OS do dia pelo celular.

**Critérios de aceite**
1. Tela Meu dia com os atendimentos do técnico.
2. Iniciar e finalizar o atendimento, com checklist e estado dos filtros.
3. Fotos de antes e depois salvas no R2.
4. Assinatura do cliente na tela, com o nome de quem assinou.

### História 9.3 — Relatório em PDF e próxima preventiva
Como **dono**, quero o PDF da OS concluída e a preventiva do equipamento atualizada.

**Critérios de aceite**
1. PDF com itens, checklist, fotos e assinatura.
2. Envio do PDF ao cliente pelo WhatsApp (História 2.5).
3. Ao concluir uma preventiva, a próxima data do equipamento é recalculada.

---

## Épico 10 — Orçamentos e Financeiro

**Objetivo:** fechar o ciclo comercial — orçar, aprovar, executar e receber. **Ao fim deste épico, o Módulo 3 pode ser liberado.**

### História 10.1 — Orçamentos
Como **atendente**, quero criar e enviar orçamentos e convertê-los em OS.

**Critérios de aceite**
1. Status Rascunho → Enviado → Aprovado ou Recusado.
2. PDF do orçamento enviado pelo WhatsApp (História 2.5).
3. Orçamento aprovado vira OS com um clique.
4. Indicadores de valores em aberto e taxa de aprovação.

### História 10.2 — Contas a receber
Como **dono**, quero ver o que tenho a receber e registrar os recebimentos.

**Critérios de aceite**
1. Lista de valores em aberto e recebidos, com filtro por forma de pagamento.
2. Registro de recebimento com forma e data.
3. Indicadores: recebido no mês e recebido por forma.

### História 10.3 — Pix ou checkout Asaas
Como **dono**, quero escolher entre cobrar com o checkout Asaas ou apenas com a minha chave Pix.

**Critérios de aceite**
1. Opção de contratar e configurar o checkout Asaas.
2. Sem Asaas, OS e orçamentos exibem a chave Pix cadastrada.
3. Detalhes da integração Asaas (confirmação automática de pagamento etc.) **[A DEFINIR com o @architect]** (História 1.1).

### História 10.4 — Agente financeiro
Como **cliente antigo**, quero saber o que tenho a pagar.

**Critérios de aceite**
1. Atende somente clientes antigos.
2. Informa os valores a receber e a forma de pagamento (Pix ou Asaas).
3. Sem o Módulo 3 liberado, os assuntos financeiros continuam indo para o atendente único (FR39).

---

## Épico 11 — Painel e Alertas

**Objetivo:** dar uma visão rápida do negócio e não deixar nada passar.

### História 11.1 — Painel
Como **dono**, quero ver o resumo do negócio ao abrir o sistema.

**Critérios de aceite**
1. Indicadores: faturamento, OS em andamento e concluídas no mês.
2. Agenda do dia, preventivas a vencer, recebimentos pendentes e OS sem agendamento.
3. Gráficos de faturamento (6 meses) e atendimentos por tipo.
4. Cada bloco aparece somente se o módulo correspondente estiver liberado.

### História 11.2 — Alertas
Como **dono**, quero ser avisado sobre preventivas, recebimentos e OS sem data.

**Critérios de aceite**
1. Central de alertas com esses três tipos.

---

## Resultado do Checklist

Ainda não executado. Próximo passo: o @po valida este PRD com o `po-master-checklist`, depois que o dono revisar.

## Próximos Passos

### Pendências resolvidas
**v0.2**
1. ✅ Orçamento pelo WhatsApp → agentes de atendimento (FR34).
2. ✅ OpenAI Vision → fora do MVP; futura entrada de compras via OCR.
3. ✅ Fluxo de criação de OS pelos agentes → História 8.4.
4. ✅ Horário de trabalho → três fontes de verdade (FR14).
5. ✅ Controles da IA → 8 controles (FR42, História 3.1).
6. ✅ Documentação da uazapi → `docs/Uazapi/`, Histórias 1.7 e Épico 2.

**v0.3 (2026-11-21)**
7. ✅ Ordem dos épicos alinhada aos 3 módulos de liberação (Lista de Épicos).
8. ✅ OS (criação e aprovação) no Módulo 1; execução no Módulo 2.
9. ✅ Antecedência do lembrete ao cliente → 24 horas (FR37, História 8.4).
10. ✅ Critério 2 da História 8.3 ativo somente com o Módulo 2.
11. ✅ Agentes especialistas num épico próprio (Épico 8), depois da base de conhecimento.
12. ✅ Transbordo com atendente único, avisado pelo WhatsApp e respondendo pela caixa (FR39, FR40, História 3.3).
13. ✅ Horário de atendimento humano na página Base de Conhecimento, válido só para o transbordo; agentes 24/7 (FR44, FR45, NFR13, História 3.4).

### Pendências em aberto
1. Regras de negócio adicionais do método (fornecidas pelo dono).
2. Com um atendente único, avaliar se a ação **"transferir a conversa"** (FR28, História 2.6) continua necessária.
3. **Futura, a cobrar no Épico 3:** persona de cada agente.
4. **Futura, em análise:** entrada de compras via OCR (OpenAI Vision).

### Prompt para o UX Expert
@ux-design-expert: usando este PRD e o protótipo `climatizacao-prototipo02.html`, crie a especificação de frontend (`docs/front-end-spec.md`), acrescentando as telas novas: Login, Perfis e Usuários, Área Developer, cadastro do atendente de transbordo e a aba "Horário de atendimento" da página Base de Conhecimento.

### Prompt para o Architect
@architect: usando este PRD, crie a arquitetura full-stack (`docs/architecture.md`) para Next.js + Python + Supabase (RLS, pgvector) + Cloudflare R2 + uazapi + OpenAI + Asaas, hospedada na VPS Hostinger com Easypanel, resolvendo as premissas marcadas **[A DEFINIR com o @architect]**.
