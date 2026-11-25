# Frio Certo — Especificação de Frontend

> **Autor:** @ux-design-expert (Uma) · **Versão:** 1.0 · **Data:** 2026-11-21 · **Story:** 1.1
> **Base:** `docs/prd.md` v0.3, protótipo `climatizacao-prototipo02.html`, design system em `frontend/packages/` (PR #3), `docs/architecture.md`.
> **Regra:** o visual é o do protótipo. Telas novas reutilizam os componentes de `@friocerto/ui`; componentes novos entram nesse pacote, nunca soltos no app.

---

## 1. Princípios

1. **Igual ao protótipo.** Cores, tipografia, ícones e espaçamentos vêm de `@friocerto/theme` e `@friocerto/icons`. Tema claro e escuro.
2. **Gestão no computador, execução no celular** (NFR2). "Meu dia" e a execução da OS são pensados primeiro para o celular; as demais telas funcionam no celular, mas são otimizadas para desktop.
3. **Formulários em modal** e listas com busca e filtros (PRD, "Paradigmas de interação").
4. **Tudo em português do Brasil** (NFR1), com mensagens de erro que dizem o que aconteceu e como resolver.
5. **O que o usuário não pode usar não aparece:** telas e botões respeitam módulo (`<FeatureGate>`) e permissão (`usePermissao`).

## 2. Acessibilidade

**Meta: WCAG 2.1 nível AA** (o PRD deixava [A DEFINIR]; recomendação desta especificação).
- Contraste mínimo 4.5:1 em texto (conferir os tokens do tema escuro na Story 1.2).
- Todo controle acessível por teclado, com foco visível.
- Modais com foco preso, `Esc` fecha e o foco volta ao botão que abriu.
- Ícones sozinhos têm `aria-label`; status nunca só por cor (pill com texto).
- Áreas de toque de no mínimo 44 × 44 px nas telas do técnico.

## 3. Estrutura de navegação

O menu lateral é o do protótipo (`frontend/apps/web/lib/nav.ts`), com os acréscimos abaixo.

| Seção | Item | Rota | Feature (`catalog.ts`) | Módulo | Story |
|---|---|---|---|---|---|
| Operação | Painel | `/painel` | `painel` | sempre | 11.1 |
| Operação | Meu dia (técnico) | `/meudia` | `meudia` | 2 | 9.2 |
| Operação | Agenda | `/agenda` | `agenda` | 1 | 6.3 |
| Operação | Ordens de serviço | `/os` | `os` (**muda para Módulo 1**) | 1 | 6.2 |
| Operação | Atendimento | `/atendimento` | `atendimento` | 1 | 2.6 |
| Cadastros | Clientes | `/clientes` | `clientes` | 1 | 5.4 |
| Cadastros | Equipamentos | `/equipamentos` | `equipamentos` | 2 | 9.1 |
| Cadastros | Serviços e peças | `/servicos` | `servicos` | 1 | 5.2 |
| Cadastros | Técnicos | `/tecnicos` | `tecnicos` | 1 | 5.3 |
| Comercial | Orçamentos | `/orcamentos` | `orcamentos` | 3 | 10.1 |
| Comercial | Financeiro | `/financeiro` | `financeiro` | 3 | 10.2 |
| Canais | WhatsApp | `/canais` | `canais` | 1 | 2.2 |
| Canais | Transbordo humano | `/transbordo` | `transbordo` | 1 | 3.3 |
| Canais | **Base de conhecimento** 🆕 | `/base-conhecimento` | `base-conhecimento` 🆕 | 1 | 3.4 · 7.1 |
| Sistema | Configurações | `/configuracoes` | `configuracoes` | sempre | 5.1 |
| Sistema | **Perfis e usuários** 🆕 | `/perfis` · `/usuarios` | `perfis` · `usuarios` 🆕 | sempre | 4.1 · 4.2 |
| Sistema | **Área Developer** 🆕 | `/developer` | `developer` | só Developer | 1.5 · 3.1 |

**Ajustes de texto no menu:** a seção "Canais Meta" passa a se chamar **"Canais"** e o item "WhatsApp e Instagram" passa a ser **"WhatsApp"** (Instagram é pós-MVP).

**Badges do menu:** Atendimento mostra quantas conversas estão "Aguardando atendente"; Ordens de serviço mostra quantas OS estão Pendentes de aprovação.

## 4. Padrões transversais

| Padrão | Especificação |
|---|---|
| Página | `PageHeader` (título, subtítulo, ações à direita) + conteúdo em `Card` |
| Lista | `Toolbar` com busca e filtros (`Chip`) + tabela; no celular, a tabela vira lista de cards |
| Formulário | Modal com `Field`, `Input`, `Select`, `Textarea`; validação com React Hook Form + Zod; erro abaixo do campo; botão principal desabilitado enquanto salva |
| Carregando | Esqueleto (skeleton) com o formato do conteúdo; nunca tela branca |
| Vazio | `EmptyState` com ícone, frase e o botão da primeira ação (ex.: "Cadastrar primeiro serviço") |
| Erro | Faixa no topo do card com a mensagem do backend (`erro.mensagem`) e "Tentar de novo" |
| Confirmação | Ações destrutivas (excluir, desconectar) pedem confirmação em modal, com o nome do item |
| Aviso rápido | Toast no canto inferior: "Salvo", "Excluído", "Mensagem enviada" (componente novo `Toast` em `@friocerto/ui`) |
| Datas e valores | `dd/mm/aaaa`, `HH:mm`, `R$ 1.234,56`, fuso America/Sao_Paulo |
| Telefone | Exibido como `(11) 99999-8888`; gravado só com dígitos e DDI |
| Sem permissão | O item não aparece; se o usuário abrir a URL direto: "Você não tem acesso a esta tela. Fale com o administrador." |
| Módulo não contratado | Tela atual de "módulo não contratado" (já existe em `[tela]/page.tsx`) |

**Componentes novos no `@friocerto/ui`:** `Modal`, `Toast`, `DataTable` (com versão em cards no celular), `Tabs`, `Switch`, `TimeRangeEditor` (dias da semana × faixas de horário, usado em empresa, jornada e horário de atendimento), `SignaturePad`, `PhotoUploader`, `QrCodeBox`, `MonthCalendar`, `DayCalendar`.

## 5. Telas

### 5.1 Login (1.4)
- Tela cheia, centralizada: `Brand` (nome da empresa), e-mail, senha, "Entrar", link "Esqueci minha senha".
- Erros: "E-mail ou senha incorretos." · "Sem conexão. Verifique a internet e tente de novo."
- Depois do login → `/painel`.

### 5.2 Área Developer (1.5, 3.1)
Abas (`Tabs`):
| Aba | Conteúdo |
|---|---|
| Integrações | Cards OpenAI, uazapi, Asaas, R2: status "Configurada / Não configurada", campo para colar a chave (OpenAI e Asaas), botão "Testar conexão". A chave salva **nunca** é mostrada de novo |
| Agentes de IA | Um card por agente: ligar/desligar (`Switch`), modelo (GPT-4o / GPT-4o mini), persona (nome e tom), instruções (textarea grande) |
| Palavras-chave | Lista de termos por agente (adicionar e remover como `Chip`) |
| Transbordo e limites | Limiar de incerteza (0 a 100%), limite de gasto por dia e por mês (US$) |
| Registros | Tabela de decisões da IA: data, contato, agente, decisão, confiança, custo; filtro por período; total de custo por conversa |

### 5.3 Canais — WhatsApp (2.2, 2.3)
- Sem instância: `EmptyState` "Conecte o WhatsApp da sua empresa" + botão **"Conectar WhatsApp"**.
- **Modal "Conectar WhatsApp"** em 3 passos:
  1. Nome da instância e número → "Continuar".
  2. "Preparando conexão…" (cria a instância e configura o webhook).
  3. `QrCodeBox` com o QR Code e a instrução "Abra o WhatsApp > Aparelhos conectados > Conectar um aparelho". Status consultado a cada 5 s; ao conectar, mostra "WhatsApp conectado" e fecha sozinho. QR expirado → botão **"Gerar novo QR Code"**.
  - Erros: "Não foi possível criar a conexão." · "Token da uazapi inválido. Confira na Área Developer." · "Servidor do WhatsApp fora do ar. Tente em alguns minutos."
- Com instância: card com status (pill), número, nome do perfil, chave "IA ligada", botões "Desconectar" e "Excluir" (confirmação).

### 5.4 Atendimento — caixa (2.6, 3.3)
Três colunas no desktop; no celular, uma coluna por vez (lista → conversa → dados).
| Coluna | Conteúdo |
|---|---|
| Conversas | Busca; filtros: Todas, Abertas, **Aguardando atendente**, Aguardando cliente, Resolvidas; item com nome, prévia, hora, pill do status e ícone de IA pausada |
| Conversa | Balões (cliente à esquerda; IA e atendente à direita, com selo "IA" ou nome do atendente); notas internas em amarelo com "Nota interna — o cliente não vê"; caixa de resposta com abas "Responder" e "Nota"; ações: Pausar IA / Devolver à IA, Transferir, Resolver |
| Dados do contato | Contato ou cliente; cadastro; equipamentos (Módulo 2); OS; financeiro (Módulo 3); cada bloco só aparece se o módulo estiver liberado |

Faixa no topo da conversa em transbordo: "Aguardando atendente desde 14:32 — motivo: pergunta fora da base".

### 5.5 Transbordo humano (3.3)
- Card **"Atendente de transbordo"**: nome e número de WhatsApp (um só). Texto de apoio: "Todo atendimento que a IA não resolver vai para esta pessoa. Ela recebe um aviso no WhatsApp e responde pela caixa de atendimento."
- Link "Definir horário de atendimento" → `/base-conhecimento?aba=horario`.
- Lista dos últimos transbordos: data, contato, motivo, se foi fora do horário, devolvido em.

### 5.6 Base de conhecimento (3.4, 7.1)
Abas:
| Aba | Story | Conteúdo |
|---|---|---|
| **Horário de atendimento** | 3.4 | Resumo semanal + botão "Editar horário" → **modal** com `TimeRangeEditor` (dias × faixas). Aviso fixo: "Este horário vale só para o atendimento humano. A IA responde e agenda 24 horas por dia." |
| Serviços e valores | 7.1 | Somente leitura: "Vem do cadastro de Serviços e peças" + link; data da última atualização |
| Outros conteúdos | 7.1 | Lista de textos (título, prévia, atualizado em) + modal "Novo conteúdo" (título e texto) |

### 5.7 Perfis e usuários (4.1, 4.2)
- **Perfis:** lista + modal com nome e **matriz de permissões** (linhas = funcionalidades agrupadas como no menu; colunas = Ver, Criar, Editar, Excluir; marcar "Criar/Editar/Excluir" marca "Ver" automaticamente).
- **Usuários:** lista (nome, e-mail, perfil, ativo) + modal (nome, e-mail, perfil obrigatório). Ao criar: "Convite enviado para o e-mail informado."

### 5.8 Configurações — empresa (5.1)
Abas: **Empresa** (nome exibido como marca, responsável, chave Pix e tipo) e **Horário de funcionamento** (`TimeRangeEditor`, com o aviso "Usado pela agenda para oferecer horários").

### 5.9 Serviços e peças (5.2)
- Lista com filtro Serviço / Peça e por categoria.
- **Modal:** tipo, categoria, nome, descrição, preço; se serviço: **duração (min)** e **tempo de liberação da agenda (min)**, com ajuda "Tempo de deslocamento ou preparo depois do serviço".
- Excluir item usado em OS → "Este item já foi usado em ordens de serviço e não pode ser excluído. Você pode desativá-lo."

### 5.10 Técnicos (5.3)
- Lista com a bolinha da cor (`ColorDot`).
- Modal: nome, telefone, cor (paleta fixa de 10 cores com bom contraste), jornada semanal (`TimeRangeEditor`), folgas e ausências.

### 5.11 Clientes (5.4)
- Lista com busca por nome, telefone ou documento.
- Modal: tipo (Pessoa física / Empresa), nome, documento (CPF ou CNPJ conforme o tipo), telefone, e-mail, CEP (preenche o endereço; se não achar, libera o preenchimento manual com o aviso "CEP não encontrado, preencha o endereço").
- Ações rápidas: WhatsApp e Mapa.

### 5.12 Agenda (6.3)
- Alternância **Dia · Semana · Mês**; filtro por técnico; navegação de datas e "Hoje".
- Jornada do técnico como faixa de fundo; fora da jornada em cinza.
- OS como bloco na cor do técnico, com ícone do tipo de serviço (`SERVICE_TYPES`); OS Pendente com borda tracejada.
- Arrastar: durante o arraste, horários inválidos ficam riscados; soltar em horário ocupado → o bloco volta e aparece "Horário indisponível para este técnico".
- Clique em horário vazio → modal "Nova OS" com data e hora preenchidas.

### 5.13 Ordens de serviço (6.2, 9.1)
- Lista com filtros por status e tipo (`ServiceOrderStatusPill`, `ServiceTypeTag`).
- Aba **"Aguardando aprovação"** (OS Pendentes): card com origem (agente ou manual), cliente, serviço, data e hora, valor; botões **Aprovar** e **Recusar**.
- Formulário "Nova OS": cliente (busca), tipo, serviços e peças (do catálogo, total calculado), problema relatado, **"Escolher horário"** (lista de horários livres da 6.1 com o técnico escolhido pelo sistema e opção de trocar); campo equipamentos só com o Módulo 2 (9.1).
- Detalhe da OS: dados, itens, linha do tempo (histórico).

### 5.14 Meu dia — técnico (9.2)
Mobile first, uma coluna.
1. Lista do dia: horário, cliente, endereço (link do mapa), tipo, status.
2. OS aberta → **"Iniciar atendimento"**.
3. **Checklist** (itens do protótipo): Limpeza dos filtros · Higienização da serpentina (evaporadora) · Limpeza da bandeja e teste do dreno · Limpeza da condensadora · Reaperto das conexões elétricas · Verificação de vazamentos.
4. **Estado do filtro:** Bom · Sujo — limpo no local · Danificado — trocar.
5. **Fotos:** antes e depois (`PhotoUploader`, usa a câmera do celular).
6. **Assinatura:** `SignaturePad` em tela cheia + "Nome de quem assinou".
7. **"Finalizar atendimento"** (desabilitado sem assinatura) → "Atendimento concluído. Enviar relatório ao cliente pelo WhatsApp?".

### 5.15 Equipamentos (9.1)
Lista com filtro **Em dia · Vence em até 15 dias · Vencida** (pills verde, amarela, vermelha + texto); modal com cliente, tipo, marca, BTUs, número de série, local e periodicidade.

### 5.16 Orçamentos (10.1)
Lista com status (Rascunho, Enviado, Aprovado, Recusado) e indicadores (valor em aberto, taxa de aprovação); modal com cliente, itens e observações; ações "Enviar pelo WhatsApp", "Aprovar", "Recusar", **"Converter em OS"**.

### 5.17 Financeiro (10.2, 10.3)
Indicadores (recebido no mês, recebido por forma); lista A receber / Recebidos com filtro por forma; modal "Registrar recebimento" (forma e data); com Asaas: botão "Gerar cobrança" e link copiável; sem Asaas: chave Pix exibida com botão copiar.

### 5.18 Painel (11.1) e alertas (11.2)
Mantém o painel atual do protótipo (`app/(app)/painel`), trocando os dados de demonstração pelos reais. Central de alertas (sino na barra superior) com preventivas, recebimentos, OS sem data e, se aprovado, WhatsApp desconectado.

## 6. Primeiro acesso (recomendação do @po)
Depois do primeiro login do Developer, o painel mostra um **checklist de configuração** até tudo estar feito:
1. Dados da empresa e horário de funcionamento
2. Serviços e peças
3. Técnicos e jornada
4. Conectar o WhatsApp
5. Atendente de transbordo e horário de atendimento
6. Chave da OpenAI e ligar os agentes

Cada item leva à tela correspondente e fica marcado quando concluído. (Entra na Story 11.1; até lá, as telas funcionam isoladamente.)
