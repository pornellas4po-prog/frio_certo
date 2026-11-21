# Project Brief: Frio Certo

> **Autor:** @analyst (Alex) · **Versão:** 0.1 (rascunho para revisão do dono) · **Data:** 2026-11-15
> **Fontes:** `planoprd.md` (briefing do dono), protótipo aprovado `climatizacao-prototipo02.html` e decisões do dono registradas em conversa (2026-11-15).
> Itens marcados com **[A DEFINIR]** não foram decididos ainda e não devem ser tratados como requisito.
> **Atualização (2026-11-15):** as questões em aberto 1, 2 e 3 foram respondidas pelo dono e estão registradas no `docs/prd.md` v0.2 (seção "Pendências resolvidas"). O PRD é a fonte de verdade a partir daqui.

---

## Resumo Executivo

O **Frio Certo** é um aplicativo de gestão para profissionais técnicos de refrigeração e climatização (instalação e manutenção de ar-condicionado). O objetivo é que o técnico **não perca clientes por conflito de agenda nem por falta de tempo** para organizar a rotina. A principal porta de entrada é o **WhatsApp**: agentes de IA atendem o cliente, consultam agenda e tabela de serviços, informam horário e valor, e criam a ordem de serviço (OS) sem o técnico precisar parar o trabalho. O cadastro manual pelo painel continua disponível. O Instagram entra depois.

## Declaração do Problema

- O técnico perde clientes porque **marca dois atendimentos no mesmo horário** ou porque **demora para responder** enquanto está em serviço.
- Ele **não tem tempo hábil para parar e montar a rotina**: conferir agenda, consultar preços, cadastrar cliente, abrir OS, cobrar.
- Hoje esse trabalho é manual e espalhado (WhatsApp pessoal, papel, memória), o que gera esquecimento de manutenções preventivas e de recebimentos.

## Solução Proposta

1. **Painel de gestão** (web, responsivo) com agenda sem conflito, ordens de serviço, cadastros, orçamentos e financeiro — fluxo já validado no protótipo.
2. **Atendimento automático via WhatsApp** com um **agente orquestrador** que entende a mensagem (palavras-chave + significado, modo híbrido) e chama o **agente especialista** certo.
3. **Agenda inteligente**: cada serviço cadastrado informa a duração do atendimento e o tempo até a agenda ser liberada; a agenda só oferece horários realmente livres.
4. **Transbordo humano**: quando o cliente pede ou quando a IA não sabe responder, a conversa passa para uma pessoa.

## Usuários-Alvo

### Segmento Primário: Dono da empresa de climatização (técnico-proprietário)
- Pequena empresa ou técnico autônomo de refrigeração.
- Faz atendimento em campo e, ao mesmo tempo, cuida de agenda, orçamento e cobrança.
- Precisa que o atendimento ao cliente aconteça mesmo quando está ocupado.

### Segmento Secundário: Técnicos de campo e atendentes
- **Técnico:** usa a tela "Meu dia" no celular para ver a rota do dia e executar a OS (checklist, fotos, assinatura).
- **Atendente:** recebe as conversas transferidas pela IA (transbordo) e trata casos especiais.

> Nesta fase o sistema atende **um único cliente** (uma empresa). Ver Restrições.

## Metas e Métricas de Sucesso

### Objetivos de Negócio
- Eliminar conflitos de agenda nos atendimentos marcados pelo sistema.
- Responder o cliente no WhatsApp sem depender da disponibilidade do técnico.
- Não deixar manutenção preventiva vencer sem aviso.

### Métricas de Sucesso do Usuário
- O técnico consegue ver e executar o dia inteiro pelo celular.
- O cliente consegue agendar um serviço pelo WhatsApp do início ao fim sem intervenção humana.

### KPIs
- Conflitos de agenda gerados pelo sistema: **meta zero**.
- % de conversas resolvidas pela IA sem transbordo **[A DEFINIR meta]**.
- Tempo médio da primeira resposta no WhatsApp **[A DEFINIR meta]**.
- Preventivas vencidas sem aviso: **meta zero**.

## Escopo do MVP

### Funcionalidades Essenciais (Must Have)
- **Área Developer:** visível só para o dono do sistema; configurações gerais e controle da IA. O usuário developer acessa tudo sem passar por cadastro de usuário/perfil.
- **Perfil (RBAC granular):** perfis com permissão por funcionalidade e por operação (criar, ver, editar, excluir).
- **Cadastros:** empresa, serviços e peças (com duração e tempo de liberação da agenda), técnicos, clientes (endereço por CEP), equipamentos (controle de preventiva).
- **Agenda e Ordens de Serviço:** agenda sem conflito, OS com tipos e status, checklist, fotos antes/depois, assinatura do cliente, relatório em PDF, tela "Meu dia" do técnico.
- **Orçamentos:** criação, envio em PDF, aprovação e conversão em OS.
- **Financeiro:** contas a receber, registro de recebimento; **checkout Asaas opcional**, ou apenas **chave Pix** cadastrada pelo usuário.
- **WhatsApp via uazapi:** modal para o próprio cliente do sistema conectar (instanciar) o número dele.
- **Agentes de IA:** orquestrador, técnico (base de conhecimento), atendimento de novos clientes, atendimento de clientes antigos, financeiro e transbordo humano. Os agentes de atendimento **criam as OS**.
- **Base de conhecimento (RAG híbrido):** alimentada pelo usuário com dados da empresa (serviços, horários de funcionamento etc.).
- **Caixa de atendimento:** conversas, dados do contato, transferência, pausa da IA por contato.
- **Painel:** indicadores, agenda do dia, preventivas a vencer, recebimentos pendentes.

### Fora do Escopo do MVP
- **Instagram** (entra numa fase seguinte).
- **Múltiplas empresas (multi-tenant / SaaS).**
- Emissão de nota fiscal **[A DEFINIR se entra em alguma fase]**.

### Critérios de Sucesso do MVP
- Um cliente final pede um serviço no WhatsApp e termina com **OS agendada, sem conflito**, com valor informado a partir do catálogo.
- O técnico executa e conclui essa OS pelo celular, com fotos, assinatura e PDF.
- O recebimento é registrado (Pix ou Asaas).

## Visão Pós-MVP

### Funcionalidades da Fase 2
- Canal **Instagram Direct** na mesma caixa de atendimento.

### Visão de Longo Prazo
- **[A DEFINIR]** — possível evolução para atender várias empresas (multi-tenant).

### Oportunidades de Expansão
- **[A DEFINIR]**

## Considerações Técnicas

### Requisitos de Plataforma
- **Web responsiva** (computador para gestão; celular para o técnico em campo).
- Interface em **português do Brasil**.

### Preferências de Tecnologia (decididas pelo dono)
- **Frontend:** Next.js.
- **Backend e agentes:** Python.
- **Banco de dados:** Supabase (plano free) com **RLS**; **pgvector** para o RAG híbrido; **cron** para manter o projeto ativo (evitar pausa do plano free).
- **IA:** OpenAI — GPT-4o, GPT-4o mini e Vision.
- **Armazenamento de arquivos:** Cloudflare R2 (fotos, PDFs).
- **WhatsApp:** uazapi (API não oficial).
- **Hospedagem:** VPS Hostinger com Easypanel.
- **Versionamento:** GitHub. **Método:** AIOX.

### Considerações de Arquitetura
- Separação clara entre **frontend (Next.js)** e **backend/agentes (Python)** — detalhamento com o @architect.
- O protótipo `climatizacao-prototipo02.html` é a **referência visual e de fluxo**.

## Restrições e Premissas

### Restrições
- **Cliente único** nesta fase (single-tenant).
- **Supabase free:** limite de espaço e pausa por inatividade (mitigado pelo cron).
- **uazapi é API não oficial** do WhatsApp (ver Riscos).
- Dono com nível técnico **júnior**: documentação e decisões em linguagem simples.

### Premissas Principais
- O dono vai fornecer a **documentação técnica da uazapi** para o modal de instância.
- O dono vai cadastrar os dados da empresa que alimentam a base de conhecimento.
- Regras de negócio e de desenvolvimento adicionais serão fornecidas pelo dono **[A DEFINIR]**.

## Riscos e Questões em Aberto

### Riscos Principais
- **API não oficial do WhatsApp:** risco de bloqueio do número pela Meta e de instabilidade da conexão.
- **Plano free do Supabase:** limites podem ser atingidos com fotos/mensagens; pausa se o cron falhar.
- **Respostas erradas da IA** (preço, horário): mitigado por consulta obrigatória a agenda/catálogo e por transbordo humano.
- **Dados pessoais** de clientes (nome, telefone, endereço) exigem cuidado de privacidade.

### Questões em Aberto
1. **Quem faz orçamentos pelo WhatsApp?** O protótipo tem um "Agente Comercial"; o plano não. Os agentes de atendimento assumem?
2. **Uso do OpenAI Vision:** para quê exatamente (ex.: fotos enviadas pelo cliente)?
3. **Fluxo detalhado de criação de OS pelos agentes** (novos e antigos clientes) — a desenhar.
4. **Metas numéricas** dos KPIs de atendimento.
5. **Regras de negócio** do método que o dono ainda vai fornecer.
6. **Nota fiscal:** entra em alguma fase?

### Áreas que Precisam de Pesquisa
- Documentação da uazapi (instância, webhooks, envio/recebimento).
- Desenho do RAG híbrido (palavra-chave + vetorial) no pgvector.
- Integração do checkout Asaas.

## Apêndices

### A. Resumo da Pesquisa
- Análise do protótipo `climatizacao-prototipo02.html`: 15 módulos (Painel, Meu dia, Agenda, OS, Atendimento, Agentes, Canais, Transbordo, Clientes, Equipamentos, Catálogo, Técnicos, Orçamentos, Financeiro, Configurações). O protótipo não tem backend, login nem permissões; a IA é simulada.

### B. Contribuições do Dono
- Briefing em `planoprd.md` e decisões de 2026-11-15 (stack, uazapi, cliente único, RBAC, área Developer, Asaas/Pix, regras de agenda nos serviços).

### C. Referências
- `planoprd.md`
- `climatizacao-prototipo02.html`

## Próximos Passos

### Ações Imediatas
1. Dono revisa este brief e responde as Questões em Aberto.
2. @pm escreve o PRD (`docs/prd.md`) a partir deste brief.

### Passagem para o PM
Este brief contém o contexto completo do Frio Certo. @pm: criar o PRD seção por seção usando `prd-tmpl`, respeitando as decisões já tomadas e mantendo os itens **[A DEFINIR]** como pendências, sem inventar requisitos.
