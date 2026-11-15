# Frio Certo — Documento de Requisitos do Produto (PRD)

> **Autor:** @pm (Morgan) · **Versão:** 0.1 (rascunho para revisão do dono) · **Data:** 2026-11-15
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
Técnicos de refrigeração perdem clientes por marcar atendimentos no mesmo horário e por demorar a responder enquanto estão em serviço. Também não têm tempo para organizar agenda, preços, cadastros e cobranças. O protótipo aprovado (`climatizacao-prototipo02.html`) validou as telas e os fluxos de gestão e de atendimento por IA, mas não tem backend, login, permissões nem IA real.

O Frio Certo transforma esse protótipo em produto: painel de gestão em Next.js, backend e agentes em Python, dados no Supabase com RLS, arquivos no Cloudflare R2 e atendimento no WhatsApp via uazapi, com agentes OpenAI coordenados por um orquestrador. Nesta fase atende **uma única empresa**.

### Histórico de Alterações

| Data | Versão | Descrição | Autor |
|------|--------|-----------|-------|
| 2026-11-15 | 0.1 | Primeiro rascunho a partir do brief | @pm (Morgan) |

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
- **FR6:** Cadastro da **empresa**: nome (marca exibida no app), responsável e chave Pix.
- **FR7:** Cadastro de **serviços e peças** com categoria e preço. Cada serviço deve informar a **duração do atendimento** e o **tempo até a liberação da agenda**.
- **FR8:** Um item de catálogo usado em alguma OS não pode ser excluído.
- **FR9:** Cadastro de **técnicos** com nome, telefone e cor na agenda.
- **FR10:** Cadastro de **clientes** (pessoa física ou empresa) com telefone/WhatsApp e endereço preenchido automaticamente pelo CEP.
- **FR11:** Cadastro de **equipamentos** vinculados ao cliente: tipo, marca, BTUs, número de série, local no imóvel e periodicidade da preventiva.
- **FR12:** O sistema deve calcular a próxima preventiva de cada equipamento e classificá-lo como em dia, vencendo em até 15 dias ou vencido.

**Agenda e Ordens de Serviço**
- **FR13:** A agenda deve mostrar os atendimentos por dia e por técnico e permitir reagendar arrastando o atendimento.
- **FR14:** A agenda deve oferecer **apenas horários livres**, considerando a duração do serviço e o tempo de liberação da agenda, sem sobrepor atendimentos do mesmo técnico.
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
- **FR26:** Um **modal de instância** deve permitir ao cliente do sistema conectar o próprio número de WhatsApp pela uazapi (detalhes conforme a documentação da uazapi, a ser fornecida pelo dono).
- **FR27:** A **caixa de atendimento** deve listar as conversas, com filtros (Todas, Abertas, Aguardando cliente, Resolvidas) e o painel de dados do contato (cadastro, equipamentos, OS, financeiro).
- **FR28:** O atendente deve poder responder, adicionar nota interna, transferir a conversa e **pausar ou retomar a IA** em um contato.

**Agentes de IA**
- **FR29:** Um **agente orquestrador** deve interpretar cada mensagem de forma **híbrida** (palavras-chave + significado) e encaminhá-la ao agente especialista correto.
- **FR30:** O **agente técnico** deve responder dúvidas consultando a **base de conhecimento** da empresa (RAG híbrido).
- **FR31:** O **agente de novos clientes** deve identificar que o contato não está cadastrado, solicitar os dados de cadastro, conduzir a conversa e **criar a OS**.
- **FR32:** O **agente de clientes antigos** deve identificar o cliente cadastrado, conduzir a conversa e **criar a OS**.
- **FR33:** Para agendar, os agentes devem consultar a agenda (FR14) e o catálogo de serviços (FR7) e informar horário e valor reais.
- **FR34:** O **agente financeiro** deve atender **somente clientes antigos**, sobre contas a receber.
- **FR35:** O **transbordo humano** deve transferir a conversa para uma pessoa quando o cliente pedir ou quando os agentes não souberem responder.
- **FR36:** O cadastro de **equipes de transbordo** deve ter nome, descrição e horário de funcionamento.

**Base de conhecimento**
- **FR37:** O usuário deve poder alimentar a base de conhecimento com dados da empresa (serviços prestados, horários de funcionamento etc.), incluindo e digitando conteúdo.

**Painel**
- **FR38:** O painel deve mostrar indicadores (faturamento, OS em andamento e concluídas), agenda do dia, preventivas a vencer, recebimentos pendentes e OS sem agendamento.

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
Um único repositório no GitHub com o frontend (Next.js) e o backend/agentes (Python) — estrutura final a confirmar com o @architect.

### Arquitetura de Serviços
- **Frontend:** Next.js.
- **Backend e agentes de IA:** Python (framework a definir pelo @architect).
- **Banco:** Supabase com RLS e pgvector.
- **Arquivos:** Cloudflare R2.
- **Hospedagem:** VPS Hostinger com Easypanel.
- **Integrações:** uazapi (WhatsApp), OpenAI (GPT-4o, GPT-4o mini, Vision), Asaas (checkout), ViaCEP (endereço).

### Requisitos de Teste
**[A DEFINIR com o @architect]** — o método AIOX exige testes para toda funcionalidade nova e quality gate do @qa antes do push.

### Premissas Técnicas Adicionais
- Uso do OpenAI Vision **[A DEFINIR]**.
- Divisão de uso entre GPT-4o e GPT-4o mini por agente **[A DEFINIR com o @architect]**.
- Autenticação: provedor a definir pelo @architect.

---

## Lista de Épicos

1. **Épico 1 — Fundação:** projeto, banco, login, Área Developer e publicação no servidor.
2. **Épico 2 — Perfis e Usuários:** RBAC granular.
3. **Épico 3 — Cadastros:** empresa, serviços e peças, técnicos, clientes e equipamentos.
4. **Épico 4 — Agenda e Ordens de Serviço:** agenda sem conflito, OS completa e Meu dia.
5. **Épico 5 — Orçamentos e Financeiro:** orçamentos, recebimentos, Pix e Asaas.
6. **Épico 6 — Base de Conhecimento:** RAG híbrido alimentado pelo usuário.
7. **Épico 7 — WhatsApp e Caixa de Atendimento:** instância uazapi e conversas.
8. **Épico 8 — Agentes de IA e Transbordo:** orquestrador, especialistas, criação de OS e transbordo humano.
9. **Épico 9 — Painel e Alertas:** indicadores e avisos.

> **Por que essa ordem:** os agentes de IA (Épico 8) dependem de cadastros, agenda, catálogo, base de conhecimento e WhatsApp prontos.
> **Pós-MVP:** canal Instagram.

---

## Épico 1 — Fundação

**Objetivo:** deixar o projeto rodando de ponta a ponta — repositório, banco com RLS, login, Área Developer e publicação no servidor — para que todos os épicos seguintes tenham onde ser construídos.

### História 1.1 — Estrutura do projeto
Como **dono do sistema**, quero o projeto organizado (frontend Next.js e backend Python no mesmo repositório), para começar o desenvolvimento com padrão definido.

**Critérios de aceite**
1. Frontend Next.js e backend Python sobem localmente com um comando documentado no README.
2. Variáveis de ambiente documentadas em `.env.example`, sem segredos no repositório.

### História 1.2 — Banco de dados e manutenção do plano free
Como **dono do sistema**, quero o Supabase configurado com RLS e o cron ativo, para ter um banco seguro que não entra em pausa.

**Critérios de aceite**
1. Projeto Supabase conectado ao backend.
2. RLS ativado por padrão nas tabelas criadas.
3. Cron executando periodicamente para manter o projeto ativo.

### História 1.3 — Login e usuário Developer
Como **dono do sistema**, quero entrar com meu usuário Developer e ter acesso a tudo, sem precisar de cadastro de perfil.

**Critérios de aceite**
1. Tela de login funcional.
2. O usuário Developer acessa todas as funcionalidades sem perfil vinculado.

### História 1.4 — Área Developer
Como **dono do sistema**, quero uma área exclusiva com as configurações do sistema e o controle da IA.

**Critérios de aceite**
1. A área só aparece e só pode ser acessada pelo usuário Developer.
2. Contém a estrutura para as configurações do sistema e da IA (as opções são detalhadas nos épicos 6 a 8).

### História 1.5 — Publicação no servidor
Como **dono do sistema**, quero o projeto publicado na VPS Hostinger via Easypanel, para acessar pela internet.

**Critérios de aceite**
1. Frontend e backend publicados no Easypanel.
2. Página de verificação de saúde respondendo.

---

## Épico 2 — Perfis e Usuários

**Objetivo:** controlar quem vê e faz o quê, com perfis de permissão granular para cada funcionalidade e operação.

### História 2.1 — Cadastro de perfis com permissões
Como **administrador**, quero criar perfis definindo, para cada funcionalidade, se o perfil pode criar, visualizar, editar e excluir.

**Critérios de aceite**
1. CRUD de perfis.
2. Matriz de permissões cobrindo todas as funcionalidades do sistema e as quatro operações.

### História 2.2 — Cadastro de usuários
Como **administrador**, quero cadastrar usuários e vinculá-los a um perfil.

**Critérios de aceite**
1. CRUD de usuários com vínculo obrigatório a um perfil.
2. Usuário sem permissão não vê a tela nem o botão correspondente.

### História 2.3 — Permissões aplicadas no banco
Como **dono do sistema**, quero que as permissões também valham no banco (RLS), para que ninguém contorne a tela.

**Critérios de aceite**
1. As políticas de RLS respeitam o perfil do usuário.
2. O usuário Developer continua com acesso total.

---

## Épico 3 — Cadastros

**Objetivo:** cadastrar tudo de que a agenda, as OS e os agentes precisam.

### História 3.1 — Dados da empresa
Como **dono**, quero cadastrar nome, responsável e chave Pix da empresa.

**Critérios de aceite**
1. O nome cadastrado aparece como marca no app.
2. A chave Pix fica disponível para OS, orçamentos e financeiro.

### História 3.2 — Serviços e peças
Como **dono**, quero cadastrar serviços e peças com preço e, nos serviços, a duração e o tempo de liberação da agenda.

**Critérios de aceite**
1. CRUD com categoria e preço.
2. Serviços exigem duração e tempo de liberação da agenda.
3. Itens usados em OS não podem ser excluídos.

### História 3.3 — Técnicos
Como **dono**, quero cadastrar os técnicos com telefone e cor na agenda.

**Critérios de aceite**
1. CRUD de técnicos.
2. A cor escolhida é usada na agenda.

### História 3.4 — Clientes
Como **atendente**, quero cadastrar clientes com endereço preenchido pelo CEP.

**Critérios de aceite**
1. CRUD de pessoa física e empresa.
2. Ao digitar o CEP, o endereço é preenchido; se o CEP não for encontrado, o preenchimento é manual.
3. Atalhos para abrir o WhatsApp do cliente e o endereço no mapa.

### História 3.5 — Equipamentos e preventiva
Como **dono**, quero cadastrar os equipamentos dos clientes e acompanhar a situação da preventiva.

**Critérios de aceite**
1. CRUD de equipamentos vinculados a um cliente.
2. Situação calculada: em dia, vence em até 15 dias, vencida.
3. Filtro por situação.

---

## Épico 4 — Agenda e Ordens de Serviço

**Objetivo:** agendar sem conflito e executar a OS completa, do agendamento ao PDF.

### História 4.1 — Cálculo de horários livres
Como **atendente**, quero que o sistema mostre só horários realmente livres para cada técnico.

**Critérios de aceite**
1. O cálculo considera a duração do serviço e o tempo de liberação da agenda.
2. Nunca oferece horário que sobreponha outro atendimento do mesmo técnico.
3. Horário de trabalho dos técnicos **[A DEFINIR onde é cadastrado]**.

### História 4.2 — Criar e gerenciar OS
Como **atendente**, quero criar a OS com cliente, tipo, técnico, data, problema, equipamentos e itens.

**Critérios de aceite**
1. Os quatro tipos e os cinco status de OS.
2. Itens puxados do catálogo, com total calculado.
3. Histórico de alterações da OS.

### História 4.3 — Agenda semanal
Como **dono**, quero ver a semana por técnico e reagendar arrastando.

**Critérios de aceite**
1. Visão semanal com a cor de cada técnico.
2. Arrastar para outro dia reagenda, respeitando a regra de horários livres (4.1).

### História 4.4 — Execução da OS e Meu dia
Como **técnico**, quero executar minhas OS do dia pelo celular.

**Critérios de aceite**
1. Tela Meu dia com os atendimentos do técnico.
2. Iniciar e finalizar o atendimento, com checklist e estado dos filtros.
3. Fotos de antes e depois salvas no R2.
4. Assinatura do cliente na tela, com o nome de quem assinou.

### História 4.5 — Relatório em PDF e próxima preventiva
Como **dono**, quero o PDF da OS concluída e a preventiva do equipamento atualizada.

**Critérios de aceite**
1. PDF com itens, checklist, fotos e assinatura.
2. Envio do PDF ao cliente pelo WhatsApp (depende do Épico 7).
3. Ao concluir uma preventiva, a próxima data do equipamento é recalculada.

---

## Épico 5 — Orçamentos e Financeiro

**Objetivo:** fechar o ciclo comercial — orçar, aprovar, executar e receber.

### História 5.1 — Orçamentos
Como **atendente**, quero criar e enviar orçamentos e convertê-los em OS.

**Critérios de aceite**
1. Status Rascunho → Enviado → Aprovado ou Recusado.
2. PDF do orçamento enviado pelo WhatsApp (depende do Épico 7).
3. Orçamento aprovado vira OS com um clique.
4. Indicadores de valores em aberto e taxa de aprovação.

### História 5.2 — Contas a receber
Como **dono**, quero ver o que tenho a receber e registrar os recebimentos.

**Critérios de aceite**
1. Lista de valores em aberto e recebidos, com filtro por forma de pagamento.
2. Registro de recebimento com forma e data.
3. Indicadores: recebido no mês e recebido por forma.

### História 5.3 — Pix ou checkout Asaas
Como **dono**, quero escolher entre cobrar com o checkout Asaas ou apenas com a minha chave Pix.

**Critérios de aceite**
1. Opção de contratar e configurar o checkout Asaas.
2. Sem Asaas, OS e orçamentos exibem a chave Pix cadastrada.
3. Detalhes da integração Asaas (confirmação automática de pagamento etc.) **[A DEFINIR com o @architect]**.

---

## Épico 6 — Base de Conhecimento

**Objetivo:** dar ao agente técnico uma base confiável com os dados da empresa.

### História 6.1 — Alimentar a base
Como **dono**, quero incluir ou digitar informações da empresa (serviços, horários de funcionamento etc.).

**Critérios de aceite**
1. Tela para incluir e digitar conteúdo.
2. Conteúdo salvo e preparado para busca híbrida (pgvector).

### História 6.2 — Busca híbrida
Como **agente técnico**, quero encontrar a resposta certa combinando palavra-chave e significado.

**Critérios de aceite**
1. Busca por palavra-chave e vetorial combinadas.
2. Quando não houver resposta confiável, sinalizar para o transbordo (Épico 8).

---

## Épico 7 — WhatsApp e Caixa de Atendimento

**Objetivo:** receber e responder as mensagens do WhatsApp dentro do sistema.

### História 7.1 — Modal de instância uazapi
Como **cliente do sistema**, quero conectar meu próprio número de WhatsApp pelo app.

**Critérios de aceite**
1. Modal guia a criação e a conexão da instância na uazapi.
2. Mostra o status da conexão.
3. Detalhes técnicos conforme a documentação da uazapi **[aguardando o dono fornecer]**.

### História 7.2 — Receber e enviar mensagens
Como **sistema**, quero receber as mensagens do WhatsApp e enviar respostas.

**Critérios de aceite**
1. Mensagens recebidas são salvas e associadas ao contato.
2. Respostas enviadas pelo sistema chegam ao cliente.

### História 7.3 — Caixa de atendimento
Como **atendente**, quero ver e tratar as conversas.

**Critérios de aceite**
1. Lista com filtros (Todas, Abertas, Aguardando cliente, Resolvidas).
2. Painel com os dados do contato (cadastro, equipamentos, OS, financeiro).
3. Responder, adicionar nota interna, transferir e pausar/retomar a IA.

---

## Épico 8 — Agentes de IA e Transbordo

**Objetivo:** atender o cliente automaticamente no WhatsApp, do primeiro "oi" à OS agendada.

### História 8.1 — Agente orquestrador
Como **sistema**, quero interpretar cada mensagem e chamar o agente certo.

**Critérios de aceite**
1. Classificação híbrida (palavras-chave + significado).
2. Encaminha para: técnico, novos clientes, clientes antigos, financeiro ou transbordo.

### História 8.2 — Agente de novos clientes
Como **cliente novo**, quero ser atendido, cadastrado e ter meu serviço agendado.

**Critérios de aceite**
1. Identifica que o telefone não está cadastrado.
2. Solicita os dados de cadastro e cria o cliente.
3. Consulta agenda e catálogo, informa horário e valor reais e cria a OS.

### História 8.3 — Agente de clientes antigos
Como **cliente antigo**, quero ser reconhecido e agendar rapidamente.

**Critérios de aceite**
1. Identifica o cliente pelo telefone.
2. Consulta agenda e catálogo, informa horário e valor reais e cria a OS.

### História 8.4 — Fluxo de criação de OS pelos agentes
Como **dono**, quero um fluxo único e seguro para os agentes criarem OS.

**Critérios de aceite**
1. Fluxo desenhado e aprovado pelo dono **[A DEFINIR — o dono pediu para traçar esse fluxo da melhor maneira]**.
2. A OS só é criada com horário livre confirmado (Épico 4) e serviço do catálogo.

### História 8.5 — Agente técnico
Como **cliente**, quero tirar dúvidas e receber respostas baseadas nos dados da empresa.

**Critérios de aceite**
1. Responde usando a base de conhecimento (Épico 6).
2. Sem resposta confiável, aciona o transbordo.

### História 8.6 — Agente financeiro
Como **cliente antigo**, quero saber o que tenho a pagar.

**Critérios de aceite**
1. Atende somente clientes antigos.
2. Informa os valores a receber e a forma de pagamento (Pix ou Asaas).

### História 8.7 — Transbordo humano
Como **cliente**, quero falar com uma pessoa quando precisar.

**Critérios de aceite**
1. Transfere quando o cliente pede ou quando os agentes não sabem responder.
2. Equipes de transbordo com nome, descrição e horário de funcionamento.
3. A IA fica pausada no contato até o atendente devolver.

### História 8.8 — Controle da IA na Área Developer
Como **dono do sistema**, quero controlar a IA pela Área Developer.

**Critérios de aceite**
1. Quais controles existem (modelos, ligar/desligar agentes, limites etc.) **[A DEFINIR com o dono]**.

---

## Épico 9 — Painel e Alertas

**Objetivo:** dar uma visão rápida do negócio e não deixar nada passar.

### História 9.1 — Painel
Como **dono**, quero ver o resumo do negócio ao abrir o sistema.

**Critérios de aceite**
1. Indicadores: faturamento, OS em andamento e concluídas no mês.
2. Agenda do dia, preventivas a vencer, recebimentos pendentes e OS sem agendamento.
3. Gráficos de faturamento (6 meses) e atendimentos por tipo.

### História 9.2 — Alertas
Como **dono**, quero ser avisado sobre preventivas, recebimentos e OS sem data.

**Critérios de aceite**
1. Central de alertas com esses três tipos.

---

## Resultado do Checklist

Ainda não executado. Próximo passo: o @po valida este PRD com o `po-master-checklist`, depois que o dono revisar.

## Próximos Passos

### Pendências para o dono
1. Quem faz orçamentos pelo WhatsApp (o protótipo tem um "Agente Comercial")?
2. Para que será usado o OpenAI Vision?
3. Fluxo de criação de OS pelos agentes (História 8.4).
4. Onde fica o horário de trabalho dos técnicos (História 4.1)?
5. Controles da IA na Área Developer (História 8.8).
6. Documentação da uazapi.
7. Regras de negócio adicionais do método.

### Prompt para o UX Expert
@ux-design-expert: usando este PRD e o protótipo `climatizacao-prototipo02.html`, crie a especificação de frontend (`docs/front-end-spec.md`), acrescentando as telas novas: Login, Perfis e Usuários e Área Developer.

### Prompt para o Architect
@architect: usando este PRD, crie a arquitetura full-stack (`docs/architecture.md`) para Next.js + Python + Supabase (RLS, pgvector) + Cloudflare R2 + uazapi + OpenAI + Asaas, hospedada na VPS Hostinger com Easypanel, resolvendo as premissas marcadas **[A DEFINIR com o @architect]**.
