📍 Localização: Localizado na Página 45 e Página 124  do manual de integração.

Para implementar essa funcionalidade no seu SaaS, você seguirá um fluxo de dois passos principais: primeiro a criação da "gaveta" (instância) e depois o ato de "ligar o aparelho" (conectar e gerar QR Code).
1. O que é isso?

    Instância: Imagine que cada instância é um celular virtual dentro do servidor. Você precisa criar esse espaço antes de tentar conectar um número.

    Token: É a chave mestra. O admintoken cria a instância, e o token da instância gerada é o que você usará para comandar aquele número específico.

2. Como funciona? (Passo a Passo)

    Criação da Instância: Seu sistema chama o endpoint de administração para criar a instância. Você receberá um token único para essa nova conexão.

    Pedido de Conexão: Com o token da instância em mãos, seu modal chama o endpoint de conexão.

    Exibição do QR Code: A API retornará uma string em Base64 (imagem). Seu sistema deve converter isso em uma imagem no modal para o cliente escanear.

3. Exemplo de Requisição (Passo 1: Criar Instância)

Este passo é feito nos bastidores pelo seu servidor usando sua chave mestra.

MÉTODO: POST
URL: https://uazapi.dev/instance/create
HEADERS: { "admintoken": "SEU_TOKEN_ADMIN" }
BODY:
{
  "name": "cliente-xyz",
  "systemName": "MeuSaaS"
}

Exemplo de Resposta:
JSON

{
  "instance": {
    "id": "inst-123",
    "token": "token-gerado-pela-uazapi"
  }
}

4. Exemplo de Requisição (Passo 2: Gerar QR Code)

Agora, use o token recebido acima para abrir a conexão no modal.

MÉTODO: POST
URL: https://uazapi.dev/instance/connect
HEADERS: { "token": "token-gerado-pela-uazapi" }
BODY:
{} 

(Nota: Deixe o body vazio ou não envie o campo "phone" para que o sistema entenda que você quer um QR Code em vez de um código por SMS )

Exemplo de Resposta (O que exibir no modal):
JSON

{
  "instance": {
    "status": "connecting",
    "qrcode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgA..."
  }
}

💡 Dica de Ouro

Para que o modal do seu SaaS feche sozinho assim que o cliente escanear, utilize o endpoint GET /instance/status. Fique consultando ele a cada 5 segundos; quando o campo status mudar de "connecting" para "connected", você sabe que o pareamento foi um sucesso!.


 UazapiGo: Documentação Simplificada
Gem personalizado

    Pergunta respondida com sucesso

RESPOSTA ESPERADA:
O campo mais importante aqui é o token, que será usado em todas as chamadas futuras desta instância.
JSON

{
  "instance": {
    "instanceName": "nome_da_instancia_do_cliente",
    "instanceId": "ID_GERADO",
    "token": "TOKEN_DA_INSTANCIA_DO_CLIENTE"
  }
}

3. Passo 2: Gerar QR Code para Conexão

📍 Localização: Página 45 do manual (Seção Instância).

Com o token da instância obtido no passo anterior, chame o endpoint de conexão para receber o QR Code.

MÉTODO: POST

URL: https://uazapi.dev/instance/connect

HEADERS: - token: TOKEN_DA_INSTANCIA_DO_CLIENTE

BODY (JSON):
(Deixe o corpo vazio para gerar QR Code padrão)
JSON

{}

RESPOSTA ESPERADA:
O campo qrcode contém a imagem que você deve colocar na tag src da sua imagem no modal.
JSON

{
  "instance": {
    "status": "connecting",
    "qrcode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEU..."
  }
}

4. Passo 3: Verificar Status (Polling)

📍 Localização: Página 44 do manual.

Para saber quando o cliente terminou de escanear e fechar o modal automaticamente, consulte o status.

MÉTODO: GET

URL: https://uazapi.dev/instance/status

HEADERS: - token: TOKEN_DA_INSTANCIA_DO_CLIENTE

RESPOSTA DE SUCESSO:
JSON

{
  "instance": {
    "status": "connected"
  }
}

💡 Dica de Ouro: Experiência do Usuário (UX)

Como o QR Code do WhatsApp expira após alguns segundos, implemente uma lógica no seu modal para detectar se a resposta da API veio com erro de expiração e ofereça um botão de "Gerar Novo QR Code" que chama novamente o endpoint /instance/connect.
"""

with open("guia_integracao_uazapi.md", "w", encoding="utf-8") as f:
f.write(content)

O arquivo Markdown com os passos técnicos detalhados e ancorados no manual oficial da UaZapi foi gerado com sucesso.

Seu arquivo Markdown está pronto
[file-tag: code-generated-file-0-1777294781899883086]

O documento inclui:
1.  **Criação de Instância (Backend):** Utilizando o `admintoken` para gerar o ambiente do cliente.
2.  **Conexão (Frontend/Modal):** Utilizando o `token` da instância para gerar o QR Code em Base64.
3.  **Verificação de Status:** Endpoint para monitorar o pareamento e fechar o modal automaticamente.
4.  **Exemplos de JSON:** Formatação idêntica à exigida pela API.



