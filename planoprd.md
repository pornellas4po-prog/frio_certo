Estamos criando um aplicativo de controle para profissionais tecnoico em refrigeração, onde o prototipo já foi aprovado.

O obejtivo principal é criar uma rotina para o recnico não perder tantos clientes por conflito de agenda e não ter tempo habil

para parar e criar as rotinas.

Existirá duas formas de entrada e controle, uma manualmente e a principla, via whatsapp e posteriormente, em outra, via instagram.

fluxo: Cliente entra no whatsapp, fla seu probrlma que no caso é o tipo de servilo, como, limpeza de ar condiciodnado, ou instalação de uma nova 

central, exemplo: Oi, estou precisando que limpem meu ar codicionado. Nesse momento o agente de atendimento comprimenta vai atṕe a agenda verifica as datas e ghorarios disponioveis,guarda,

vai até os serviços oferecidos procura o serviço de limpeza de ar e coleta o valor e responde: Bom dia {cliente} os horarios disponiveis que temos são para dia
20/11/2026 as 14:00, posso agendar?. Cliente pergunta: Qual o valor? Agente coma informação responde: O valor esta 180,00. dai o Agente conduz;

Detalhe: termos um agente orquestrador onde irá interpretar atraves de semantica e palavras chaves(hibrido) e chamar o agente especialista, que teremos:
- Agente orquestrador
- Agente Tecnico - Irá consultar uma Base de Dados em formato RAG, essa base de dados será alimentada pelo usuario do sistema onde incluri ou digitar os dados da empresa, como serviços prestados
horarios de funcionamentoe, etc
- Agente de atendimento novos cliente - Irá identificar na base dados de clientes se há esse contato caso não solicitara o cadastro e consuzira a conversa
- Agente de atendimento clientes antigos - Irá identificar se cliente antigo e conduzira a conversa
- Agente financeiro - Somente para clientes antigos e contas a receber
- Transbordo - Atendente Humano - Quando houver solicitação do publico ou os agentes não souberem responder 

Visto que precisaremos de varios cadastros, analise o protótipo, monte uma sequencia logica para desenvolvimento em formato de PRD estruturado. 

As stacks que iremos trabalhar serão:

Codigo/bibliotecas/estrutura: Python
VPS -Frontend/backend: Hostinger usando easypanel
BD - Supabase free com rls
IA - Openai - 4o, 4o mini e Vision
Cloudeflare - storage
Metodo - AIOX

Meu nível de conhecimento tecnioco e programação é Junior,preciso de informação a nivel sem muita tecnez.

Vamos analisar passo a passo, sempre direto ao ponto e não crie documentos de artefatos antes que eu autorize, sempre nas conversa de contexto.

Userei github como versionamento e repositorio.

Teremos algumas regras de negocio e desenvolvimento no metodo

