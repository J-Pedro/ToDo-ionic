# ToDo Ionic

Aplicativo de lista de tarefas em **Ionic + Angular**, com uma API REST simples em **ASP.NET Core** para guardar as tarefas.

> Projeto de estudo (2022), feito para praticar Ionic e o consumo de uma API REST a partir do app.

## Funcionalidades

- Listar, adicionar, editar e excluir tarefas.
- Marcar e desmarcar uma tarefa como concluída por um *action sheet*. Tarefas concluídas aparecem riscadas.
- Componentes de interface do Ionic: alertas para digitar o texto da tarefa, *skeleton* durante o carregamento e *toasts* de sucesso e erro.
- As tarefas são guardadas na API, em um banco embutido LiteDB (arquivo `banco.db`).

## Stack

| Parte | Tecnologias |
|---|---|
| App (`APP/`) | Ionic 6, Angular 13, TypeScript, Capacitor |
| API (`API/`) | ASP.NET Core 2.0 (C#), LiteDB 5 |

## Estrutura

```text
ToDo-ionic/
├── APP/                     App Ionic
│   └── src/app/
│       ├── home/            Tela da lista de tarefas
│       └── services/        TodoService (chamadas HTTP) e UtilService (toasts)
└── API/                     API ASP.NET Core
    └── API/
        ├── Controllers/     TodoController e UsuarioController
        └── Domain/          Entidade Tarefa e objetos de requisição
```

## Executando localmente

### API

**Pré-requisito:** SDK do .NET Core 2.0.

```bash
cd API/API
dotnet run
```

A API sobe em `http://localhost:17902`.

### App

**Pré-requisito:** Node.js compatível com Angular 13 (14 ou 16).

```bash
cd APP
npm install
npm start
```

Acesse `http://localhost:4200`. Também é possível usar `ionic serve` com o Ionic CLI instalado. O endereço da API está fixo em `src/app/services/todo.service.ts`.

> Estes comandos não foram revalidados com versões atuais de Node.js e .NET.

## API

| Método | Caminho | Corpo | Descrição |
|---|---|---|---|
| `GET` | `/api/todo` | — | Lista as tarefas |
| `POST` | `/api/todo` | `{ "nome": "Comprar pão" }` | Cria uma tarefa |
| `PUT` | `/api/todo` | `{ "id": "<guid>", "nome": "Comprar pão", "done": true }` | Atualiza nome e status |
| `DELETE` | `/api/todo/{id}` | — | Exclui uma tarefa |

O `UsuarioController` (`/api/usuario`) trabalha com uma lista fixa em memória e foi usado só como exercício. Ele não é usado pelo app.

## Limitações conhecidas

- O ASP.NET Core 2.0 está fora de suporte desde 2018.
- `UseCors` é registrado depois de `UseMvc` em `Startup.cs`. Como no ASP.NET Core a ordem dos middlewares importa, as chamadas do navegador podem ser bloqueadas por CORS.
- O endereço da API está fixo no serviço do app, em vez de vir dos arquivos de `environment`.
- Não há validação de entrada nem testes automatizados.
- O repositório inclui arquivos gerados pelo build e pela IDE (`bin/`, `obj/`, `.vs/`) e o arquivo de banco `banco.db`.
