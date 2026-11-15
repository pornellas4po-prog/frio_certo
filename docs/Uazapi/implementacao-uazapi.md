# Implementação Uazapi — Documento de Levantamento

> Documento gerado em 2026-04-20 para guiar a implementação das features de WhatsApp/Agente IA.
> Não iniciar desenvolvimento sem validação deste documento.

---

## 1. O Que Já Existe

### 1.1 Banco de Dados (Supabase) — 100% Pronto

Todas as tabelas já existem e estão com RLS habilitado:

| Tabela | Finalidade | Status |
|--------|-----------|--------|
| `whatsapp_instances` | Cadastro de instâncias WhatsApp por tenant | ✅ Pronta |
| `ai_agents` | Configuração do agente (provider, modelo, temp.) | ✅ Pronta |
| `system_prompts` | Prompt centralizado com variáveis (jsonb) | ✅ Pronta |
| `uazapi_agent_configs` | Config do agente vinculada à instância | ✅ Pronta |
| `uazapi_knowledge` | Base de conhecimento (RAG) por tenant | ✅ Pronta |
| `uazapi_sync_log` | Log de sincronização com Uazapi | ✅ Pronta |
| `whatsapp_conversations` | Conversas ativas por instância | ✅ Pronta |
| `whatsapp_messages` | Mensagens individuais com flag de IA | ✅ Pronta |
| `protected_instances` | Instâncias protegidas contra deleção | ✅ Pronta |
| `instance_operation_logs` | Auditoria de operações nas instâncias | ✅ Pronta |

### 1.2 Colunas Relevantes — `whatsapp_instances`

```
id, tenant_id, name, phone, description,
uazapi_instance_id,   ← ID da instância no servidor Uazapi
uazapi_token,         ← Token de autenticação da instância
status,               ← disconnected | connected | connecting
qrcode,               ← Base64 do QR para escaneamento
paircode,             ← Código de pareamento alternativo
webhook_configured,   ← boolean
webhook_url,          ← URL do webhook configurado
profile_name,         ← Nome do perfil WhatsApp conectado
profile_pic_url,
is_business,          ← WhatsApp Business?
platform,             ← android | ios | web
chatbot_enabled,      ← boolean — ativa/desativa o agente
openai_apikey,        ← API key OpenAI vinculada à instância
created_by, created_at, updated_at
```

### 1.3 Colunas Relevantes — `ai_agents`

```
id, tenant_id, name,
provider,             ← openai | openrouter | anthropic
model,                ← ex: gpt-4o, claude-3-sonnet
api_key,              ← chave do provedor
temperature,          ← 0.0 a 2.0
max_tokens,
system_prompt_id,     ← FK para system_prompts
custom_instructions,  ← instrução adicional por agente
active, created_by, created_at, updated_at
```

### 1.4 Colunas Relevantes — `system_prompts`

```
id, name, version, description,
system_prompt,        ← texto completo do prompt
variables,            ← jsonb com variáveis dinâmicas ex: {nome_empresa, horario}
active, created_by, created_at, updated_at
```

### 1.5 Colunas Relevantes — `uazapi_knowledge` (RAG)

```
id, tenant_id, agent_config_id,
uazapi_knowledge_id,  ← ID retornado pela API Uazapi após upload
title, content, category, keywords (array),
is_vectorized,        ← boolean — confirmação de vetorização
vector_status,        ← pending | processing | done | error
vector_error,
last_sync_at, sync_status, sync_error,
created_by, created_at, updated_at
```

### 1.6 Colunas Relevantes — `whatsapp_conversations`

```
id, whatsapp_instance_id,
phone_number,         ← número do contato
contact_name,
status,               ← active | closed | transferred
context (jsonb),      ← contexto da conversa para o agente
last_activity,
human_transferred_at, human_transferred_by
```

### 1.7 Colunas Relevantes — `whatsapp_messages`

```
id, whatsapp_instance_id, conversation_id (varchar),
session_id (uuid),
phone_number, contact_name,
message_type,         ← text | image | audio | document
content,
is_from_contact,      ← true = mensagem do usuário / false = resposta
ai_processed,         ← boolean
ai_response,          ← resposta gerada pelo agente
created_at
```

### 1.8 Backend FastAPI — O Que Existe

O backend está em `/backend/app` e já tem:
- Estrutura FastAPI completa com rotas, schemas e cliente Supabase
- Entry point Vercel em `/api/main.py` com `mangum` para serverless
- CORS configurado para os domínios do projeto
- Rotas existentes: invoices, receipts, indicators, projects, payables, companies, categories, export, admin, auth, users

**O que NÃO existe no backend:**
- Nenhuma rota para whatsapp_instances
- Nenhuma rota para ai_agents / system_prompts
- Nenhuma rota para uazapi_knowledge (RAG)
- Nenhum webhook handler para receber mensagens do Uazapi
- Nenhuma integração com a API Uazapi

### 1.9 Frontend React — O Que Existe

- 12 páginas criadas, nenhuma relacionada a agentes/WhatsApp
- Sistema de auth completo (Supabase Auth)
- Hook `usePermissions` com roles: developer, owner, admin, manager, operator
- Sidebar e layout prontos para adicionar novos itens de menu

---

## 2. O Que Precisa Ser Criado

### 2.1 Página — Configuração de Agente (`/agente`)

**Seção: Instâncias WhatsApp**
- [ ] Formulário para cadastrar instância: nome, descrição, token Uazapi, phone
- [ ] Botão para conectar (exibe QR code ao escanear ou paircode)
- [ ] Status em tempo real da conexão (polling ou Supabase Realtime)
- [ ] Toggle para ativar/desativar chatbot por instância
- [ ] Campo para API Key OpenAI por instância

**Seção: Configuração do Agente**
- [ ] Seletor de provider (OpenAI, OpenRouter, Anthropic)
- [ ] Campo de modelo (ex: gpt-4o, claude-3-sonnet)
- [ ] Slider de temperatura (0.0 a 2.0)
- [ ] Campo de max_tokens
- [ ] Campo de custom_instructions
- [ ] Seletor de system_prompt (lista de prompts disponíveis)

**Seção: Visualizador de Prompt**
- [ ] Exibir o texto completo do prompt selecionado
- [ ] Mostrar as variáveis disponíveis (ex: `{nome_empresa}`, `{horario}`)
- [ ] Editor inline para o developer criar/editar prompts

**Seção: Base de Conhecimento (RAG)**
- [ ] Upload de arquivo (PDF, TXT, DOCX)
- [ ] Campo de texto livre para adicionar conteúdo direto
- [ ] Campos: título, categoria, palavras-chave
- [ ] Status de vetorização por item (pending / done / error)
- [ ] Botão para sincronizar com Uazapi
- [ ] Lista de itens cadastrados com opção de excluir

---

### 2.2 Página — Atendimento (`/atendimento`)

**Painel esquerdo — Lista de Conversas**
- [ ] Lista de conversas agrupadas por instância
- [ ] Filtro por status (ativa, transferida, encerrada)
- [ ] Busca por nome ou número
- [ ] Indicador visual se IA está respondendo ou humano assumiu
- [ ] Contador de mensagens não lidas

**Painel direito — Chat Viewer**
- [ ] Exibição das mensagens em bolhas (estilo WhatsApp)
- [ ] Distinção visual: mensagem do contato vs resposta do agente
- [ ] Indicação de quando a IA processou a mensagem
- [ ] Botão "Assumir Atendimento" — transfere de IA para humano
- [ ] Campo para o humano responder manualmente (via API Uazapi)
- [ ] Botão "Encerrar Conversa"

---

## 3. Variáveis de Ambiente Necessárias

### Já configuradas (Vercel + backend)
```
SUPABASE_URL=https://fasmaburxduzzljxlmjy.supabase.co
SUPABASE_SERVICE_KEY=<service role key>
OPENAI_API_KEY=<opcional — pode ser por instância>
OPENROUTER_API_KEY=<opcional>
RESEND_API_KEY=<para emails>
FRONTEND_URL=https://optusagentiasaas.shop
```

### Precisam ser adicionadas
```
UAZAPI_SERVER_URL=https://<seu-servidor-uazapi>.com
UAZAPI_GLOBAL_TOKEN=<token admin do servidor Uazapi>
WEBHOOK_SECRET=<secret para validar webhooks recebidos>
```

### No frontend (`.env` do Vite)
```
VITE_API_URL=https://api.optusagentiasaas.shop/api/v1
VITE_SUPABASE_URL=https://fasmaburxduzzljxlmjy.supabase.co
VITE_SUPABASE_ANON_KEY=<anon key do supabase>
```

---

## 4. Rotas de Backend Necessárias

### 4.1 Instâncias WhatsApp (`/api/v1/whatsapp`)

```
GET    /whatsapp/instances              — listar instâncias do tenant
POST   /whatsapp/instances              — criar instância
GET    /whatsapp/instances/{id}         — detalhe da instância
PUT    /whatsapp/instances/{id}         — atualizar instância
DELETE /whatsapp/instances/{id}         — excluir instância
POST   /whatsapp/instances/{id}/connect — solicitar QR/paircode ao Uazapi
GET    /whatsapp/instances/{id}/status  — checar status de conexão
POST   /whatsapp/instances/{id}/disconnect — desconectar
```

### 4.2 Agentes IA (`/api/v1/agents`)

```
GET    /agents                          — listar agentes do tenant
POST   /agents                          — criar agente
PUT    /agents/{id}                     — atualizar agente
DELETE /agents/{id}                     — excluir agente
GET    /agents/prompts                  — listar system_prompts disponíveis
POST   /agents/prompts                  — criar prompt (só developer)
PUT    /agents/prompts/{id}             — editar prompt (só developer)
```

### 4.3 RAG / Conhecimento (`/api/v1/knowledge`)

```
GET    /knowledge                       — listar base de conhecimento do tenant
POST   /knowledge                       — criar item (texto) + sync Uazapi
POST   /knowledge/upload                — upload de arquivo + extração + sync
DELETE /knowledge/{id}                  — excluir item + remove no Uazapi
POST   /knowledge/{id}/sync             — forçar re-sincronização com Uazapi
```

### 4.4 Atendimento (`/api/v1/atendimento`)

```
GET    /atendimento/conversations       — listar conversas
GET    /atendimento/conversations/{id}/messages — mensagens de uma conversa
POST   /atendimento/conversations/{id}/transfer — transferir para humano
POST   /atendimento/conversations/{id}/reply    — humano responde (via Uazapi)
POST   /atendimento/conversations/{id}/close    — encerrar conversa
```

### 4.5 Webhook Uazapi (`/api/v1/webhook`)

```
POST   /webhook/uazapi                  — recebe eventos do Uazapi
                                          (nova mensagem, status conexão, etc.)
```

---

## 5. Análise de Hospedagem do Backend

### Situação Atual

O backend FastAPI está hospedado na **Vercel** usando `mangum` (adaptador ASGI → Lambda).
O vercel.json atual só serve o frontend (React). O backend está em `/api/main.py` como serverless function.

### Limitações do Vercel Free para este projeto

| Limitação | Impacto |
|-----------|---------|
| **Timeout máximo: 10s** | ❌ Problema crítico — upload de PDF + vetorização pode levar 30-60s |
| **Sem execução contínua** | ❌ Não pode manter conexão WebSocket para chat em tempo real |
| **Sem cron jobs nativos** | ⚠️ Precisa de solução externa para polling de status Uazapi |
| **Cold start ~2-3s** | ⚠️ Webhook do Uazapi pode receber timeout se instância fria |
| **Memória: 1024 MB** | ✅ Suficiente para o uso atual |
| **Bandwidth: 100 GB/mês** | ✅ Suficiente |

### Conclusão sobre Hospedagem

**O Vercel Free NÃO é adequado para o webhook do Uazapi** (timeout de 10s e sem persistência).

**Recomendação: Backend na VPS (Hostinger ou similar)**

#### Opção A — Manter Vercel para frontend + VPS só para Uazapi (Recomendado)
- Frontend React → Vercel (gratuito, ideal)
- API principal (invoices, auth, etc.) → continua no Vercel
- **Novo serviço Uazapi** → VPS Hostinger (FastAPI separado ou Node.js)
  - Custo: ~R$ 30-50/mês (plano básico KVM1)
  - Responsabilidade: receber webhooks, processar IA, salvar no Supabase

#### Opção B — Migrar todo o backend para VPS
- Frontend React → Vercel (gratuito)
- Backend completo → VPS com Docker + Nginx
- Custo: ~R$ 50-80/mês (plano KVM2 para folga)
- Prós: sem limitação de timeout, controle total
- Contras: precisa configurar SSL, deploy manual, monitorar uptime

#### Opção C — Railway / Render (alternativa ao VPS)
- Backend FastAPI → Railway.app ou Render.com
- Plano free: 500h/mês (Railway) — pode ser suficiente em baixo volume
- Plano pago: ~US$ 5-10/mês
- Prós: deploy via Git, SSL automático, mais simples que VPS
- Contras: cold start no plano free, menos controle

---

## 6. Fluxo Completo da Integração Uazapi

```
[WhatsApp User]
      ↓ mensagem
[Servidor Uazapi]
      ↓ webhook POST /api/v1/webhook/uazapi
[Backend (VPS)]
      ↓ salva em whatsapp_messages
      ↓ busca configuração do agente (ai_agents + system_prompts)
      ↓ busca RAG relevante (uazapi_knowledge)
      ↓ chama OpenAI/OpenRouter com prompt + contexto + RAG
      ↓ salva resposta em whatsapp_messages (ai_response)
      ↓ envia resposta via API Uazapi
[WhatsApp User] ← resposta do agente

[Frontend /atendimento]
      ↓ polling ou Supabase Realtime
      ↓ exibe conversas e mensagens em tempo real
```

---

## 7. Ordem de Implementação Recomendada

1. **Configurar VPS** — provisionar servidor, instalar Python/Docker, configurar Nginx + SSL
2. **Criar rotas backend** — instâncias, agentes, prompts, knowledge, webhook
3. **Criar página `/agente`** no frontend — cadastro de instância + agente + RAG + prompt viewer
4. **Testar conexão Uazapi** — cadastrar instância, escanear QR, confirmar webhook
5. **Criar página `/atendimento`** — inbox de conversas + chat viewer
6. **Ativar chatbot** — toggle chatbot_enabled na instância e validar fluxo completo

---

## 8. Dependências Externas Necessárias

| Serviço | Finalidade | Obrigatório |
|---------|-----------|-------------|
| Servidor Uazapi | Motor WhatsApp (auto-hospedado ou cloud) | ✅ Sim |
| OpenAI ou OpenRouter | Processamento do agente IA | ✅ Sim |
| Supabase (já existe) | Banco de dados + auth + realtime | ✅ Sim |
| VPS (Hostinger/Railway) | Hospedar webhook e backend Uazapi | ✅ Sim |
| Resend (já existe) | Emails transacionais | ✅ Já ok |

### Bibliotecas Python a Adicionar

```
openai>=1.0.0          # cliente OpenAI/OpenRouter
anthropic>=0.20.0      # se usar Claude como agente
pypdf2 ou pdfplumber   # extração de texto de PDFs
python-docx            # extração de texto de DOCX
httpx>=0.26.0          # já existe — para chamar API Uazapi
```

### Bibliotecas Frontend a Adicionar

```
date-fns               # formatação de datas nas conversas
react-markdown         # renderizar markdown nas mensagens
```

---

## 9. Questões a Validar Antes de Iniciar

- [ ] Qual servidor Uazapi será usado? (auto-hospedado na VPS ou cloud Uazapi)
- [ ] Qual provedor de IA? (OpenAI, OpenRouter, Anthropic ou múltiplos)
- [ ] O atendimento humano responderá pelo próprio sistema ou pelo WhatsApp diretamente?
- [ ] Precisa de notificação (push/email) quando chega mensagem nova no atendimento?
- [ ] Os prompts são únicos por plataforma (developer cria, todos usam) ou cada tenant pode criar o seu?
- [ ] Qual o plano de VPS desejado? (Hostinger KVM1 ~R$30/mês ou Railway ~US$5/mês)
