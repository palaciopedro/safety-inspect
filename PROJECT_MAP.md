# PROJECT_MAP

## Visão Geral

Aplicativo mobile React Native built with Expo Router. O app gerencia inspeções de segurança do trabalho, registros de ocorrências, geração de relatórios em PDF/CSV, e settings de perfil/empresa. A autenticação e persistência de dados usam Supabase, enquanto configurações locais usam AsyncStorage.

## Arquitetura do Projeto

- `app/` - telas e roteamento do Expo Router.
- `context/` - provider de autenticação global.
- `hooks/` - hooks reutilizáveis (ex.: `useAuth`).
- `services/` - serviços principais de negócio: `database.ts`, `profile.ts`, `report.ts`.
- `lib/` - helpers e inicializadores; inclui `lib/supabase.ts` e `lib/auth.ts` (centraliza `getAuthenticatedUserId()`).
- `components/` - componentes reutilizáveis de UI.
- `utils/` - utilitários puros como imagens e geração de HTML para relatório.
- `types/` - tipos TypeScript compartilhados.
- `constants/` - dados estáticos de dropdown.

## Árvore Completa de Pastas

```
.
├─ .expo/
├─ .git/
├─ app.json
├─ eas.json
├─ package.json
├─ package-lock.json
├─ tsconfig.json
├─ README.md
├─ assets/
│  └─ logo.png
├─ app/
│  ├─ _layout.tsx
│  ├─ (auth)/
│  │  ├─ _layout.tsx
│  │  └─ index.tsx
│  └─ (app)/
│     ├─ _layout.tsx
│     ├─ index.tsx
│     ├─ new-inspection.tsx
│     ├─ new-finding.tsx
│     ├─ settings.tsx
│     └─ inspection/
│        └─ [id].tsx
├─ assets/
│  └─ logo.png
├─ components/
│  ├─ AppModal.tsx
│  ├─ Dropdown.tsx
│  ├─ FinalizationModal.tsx
│  ├─ FindingCard.tsx
│  ├─ InspectionCard.tsx
│  ├─ PhotoPicker.tsx
│  └─ RiskBadge.tsx
├─ constants/
│  └─ dropdownOptions.ts
├─ context/
│  └─ AuthContext.tsx
├─ hooks/
│  └─ useAuth.ts
├─ lib/
│  ├─ supabase.ts
│  └─ auth.ts
├─ services/
│  ├─ database.ts
│  ├─ profile.ts
│  ├─ report.ts
│  └─ settings.ts (LEGADO)
├─ types/
│  └─ index.ts
└─ utils/
   ├─ date.ts
   ├─ generateReport.ts
   ├─ image.ts
   └─ risk.ts
```

## Descrição de Cada Arquivo

### Configuração
- `package.json` - dependências do Expo, React Native e Supabase.
- `tsconfig.json` - configurações TypeScript e alias `@/*`.
- `app.json` - configuração básica do app Expo.
- `eas.json` - configuração EAS builds.
- `README.md` - documentação do projeto (não detalhada neste mapa).

### Roteamento e Layout
- `app/_layout.tsx` - wrapper global; inicializa `AuthProvider` e controla redirecionamento entre `(auth)` e `(app)` via `RootGuard`.
- `app/(auth)/_layout.tsx` - stack para telas de autenticação sem cabeçalho.
- `app/(auth)/index.tsx` - tela de login/cadastro.
- `app/(app)/_layout.tsx` - stack principal do app com telas de listagem, inspeção, ocorrência e configurações.
- `app/(app)/index.tsx` - homepage da inspeção que lista inspeções do usuário.
- `app/(app)/new-inspection.tsx` - formulário para criar/editar uma inspeção.
- `app/(app)/new-finding.tsx` - formulário para criar/editar uma ocorrência dentro de uma inspeção.
- `app/(app)/settings.tsx` - tela de perfil, empresa, logo e logout.
- `app/(app)/inspection/[id].tsx` - detalhes de inspeção e listagem de ocorrências.

### Componentes Reutilizáveis
- `components/AppModal.tsx` - modal genérico de confirmação/alerta.
- `components/Dropdown.tsx` - seletor customizado de opções.
- `components/FinalizationModal.tsx` - modal de finalização de inspeção com captura de assinaturas.
- `components/FindingCard.tsx` - exibe dados da ocorrência, fotos e ações de edição/exclusão.
- `components/InspectionCard.tsx` - exibe resumo da inspeção e permite editar/excluir.
- `components/PhotoPicker.tsx` - captura e seleciona imagens via câmera/galeria.
- `components/RiskBadge.tsx` - badge visual de nível de risco.

### Constantes
- `constants/dropdownOptions.ts` - opções de gravidade, frequência, probabilidade e exposição usadas em `new-finding.tsx`.

### Context & Hooks
- `context/AuthContext.tsx` - contexto global de autenticação; expõe sessão, usuário, perfil e métodos `signIn`, `signUp`, `signOut`, `refreshProfile`.
- `hooks/useAuth.ts` - hook que consome `AuthContext` e agora também expõe `displayName` e `isAuthenticated` além das funcionalidades anteriores.

### Biblioteca Supabase e Helpers
- `lib/supabase.ts` - configura cliente Supabase com AsyncStorage e polyfill URL.
- `lib/auth.ts` - helper centralizado para autenticação; expõe `getAuthenticatedUserId()` usado por serviços que precisam do `user_id`.

### Services
- `services/database.ts` - serviço central de `inspections` e `findings` com operações CRUD. Usa `lib/auth.ts` (`getAuthenticatedUserId()`) para obter o usuário autenticado nas operações que precisam de `user_id`.
- `services/profile.ts` - serviço de perfil e upload de logo no storage Supabase. Também utiliza `lib/auth.ts` quando precisa resolver o `user_id` do contexto.
- `services/report.ts` - geração e compartilhamento de PDF usando HTML criado por `utils/generateReport.ts`.
- `services/settings.ts` - LEGADO: permanece apenas porque o módulo de geração de relatórios depende dele; planejado para remoção em futura refatoração.

### Tipos
- `RiskLevel` - níveis de risco.
- `Inspection` - dados de inspeção (atualizado: inclui `user_id: string` compatível com o esquema do banco).
- `DropdownOption` - opção para o dropdown.
- `Finding` - registro de ocorrência.
- `Profile` - dados de perfil de usuário.

### Utils

- `formatDateBR`, `getCurrentDateLocal` em `utils/date.ts`.
- `generateReportHTML` em `utils/generateReport.ts`.
- `processImage` em `utils/image.ts`.
- `calculateRiskScore`, `getRiskLevel`, `getRiskColor` em `utils/risk.ts`.

## Dependências Entre Arquivos

- `app/_layout.tsx` usa `AuthContext.tsx`.
- `AuthContext.tsx` usa `lib/supabase.ts` e tipos de `types/index.ts`.
- `hooks/useAuth.ts` reexporta/consome `AuthContext.tsx` e expõe `displayName` e `isAuthenticated`.
- `app/(auth)/index.tsx`, `app/(app)/index.tsx`, `app/(app)/settings.tsx` usam `useAuth`.
- `app/(app)/index.tsx` usa `db.inspections.list`, `InspectionCard`.
- `app/(app)/new-inspection.tsx` usa `db.inspections.getById/create/update`.
- `app/(app)/inspection/[id].tsx` usa `db.inspections.getById`, `db.findings.listByInspection`, `FindingCard`, `FinalizationModal`, `AppModal`, `generateAndShareReport`, `generateAndShareCSV`, `formatDateBR`.

## Fluxo de Autenticação

1. `app/_layout.tsx` monta `AuthProvider`.
2. `AuthContext.tsx` busca sessão atual com `supabase.auth.getSession()`.
3. Se existir sessão, carrega perfil do `profiles`.
4. `supabase.auth.onAuthStateChange` atualiza sessão automaticamente.
5. `RootGuard` redireciona:
   - sem sessão → `/ (auth)`
   - com sessão → `/ (app)`
6. Tela `app/(auth)/index.tsx` chama `signIn` ou `signUp`.
7. `signIn` e `signUp` usam Supabase Auth.
8. `signOut` remove sessão e limpa perfil local.

## Fluxo do Banco

- `lib/supabase.ts` fornece instância global do cliente Supabase.
- `services/database.ts` realiza todas as operações de `inspections` e `findings` e adiciona `user_id` ao criar, usando `lib/auth.ts` quando necessário.
- `services/profile.ts` atualiza e obtém dados do `profiles` e faz upload de logo para um bucket chamado `company-logos`.
- `services/settings.ts` armazena configurações locais de empresa em AsyncStorage (LEGADO).

## Fluxo de Navegação

- Expo Router usa estrutura de pastas para rotas.
- `app/(auth)` é rota para telas de autenticação.
- `app/(app)` é rota do app principal.
- Roteamento principal:
  - `/` → app/(app)/index
  - `/new-inspection` → app/(app)/new-inspection
  - `/inspection/[id]` → app/(app)/inspection/[id]
  - `/new-finding` → app/(app)/new-finding
  - `/settings` → app/(app)/settings

## Fluxo das Inspeções

- `app/(app)/index.tsx` carrega inspeções do usuário usando `db.inspections.list` quando o foco da tela é ativado.
- `InspectionCard` exibe cada inspeção e permite abrir detalhes, editar e excluir.
- `new-inspection.tsx` cria/edita inspeções com `status: 'draft'` por padrão.

## Fluxo das Ocorrências

- `inspection/[id].tsx` carrega ocorrências via `db.findings.listByInspection(id)`.
- A tela permite adicionar/editar/excluir ocorrências.

## Fluxo das Configurações

- `app/(app)/settings.tsx` possui perfil e empresa.
- Carrega dados do perfil do contexto via `useAuth()`.
- Permite editar nome, sobrenome e nome da empresa.
- Salva alterações com `profileService.update` e atualiza o contexto com `refreshProfile()`.

## Fluxo do Upload de Imagens

### Upload em ocorrências
- `PhotoPicker.tsx` pede permissão de câmera se necessário.
- Usuário escolhe câmera ou galeria.
- Imagens são processadas por `utils/image.ts`.

### Upload de logo de empresa
- `services/profile.ts` usa `expo-image-picker` para escolher imagem.
- `uploadLogo` envia bytes para Supabase Storage no bucket `company-logos`.
- `getLogoUrl` retorna URL assinada de 1 hora.

## Componentes Reutilizáveis

- `AppModal` - modal genérico para mensagens, confirmações e avisos.
- `Dropdown` - seletor de opções customizado com modal.
- `FinalizationModal` - fluxo de finalização de inspeção com assinatura digital.
- `FindingCard` - exibição de ocorrência com ações.
- `InspectionCard` - exibição de inspeção com badge de status.
- `PhotoPicker` - seleção de imagens com galeria/câmera.
- `RiskBadge` - visualização de nível de risco.

## Hooks

- `useAuth` - hook único que consome `AuthContext` e expõe `displayName` e `isAuthenticated` além de sessão e métodos de perfil.

## Services (Resumo)

- `db` em `services/database.ts`:
  - inspeções: `list`, `create`, `update`, `delete`, `getById` (usa `user_id`).
  - ocorrências: `listByInspection`, `create`, `update`, `delete`, `getById`.
- `profileService` em `services/profile.ts`:
  - `get`, `update`, `pickLogo`, `uploadLogo`, `getLogoUrl`.
- `settingsService` em `services/settings.ts` (LEGADO).
- `generateAndShareReport` em `services/report.ts`.

## Utils

- `generateReportHTML` em `utils/generateReport.ts`.
- `processImage` em `utils/image.ts`.
- `formatDateBR`, `getCurrentDateLocal` em `utils/date.ts`.

## Tipos

- `Inspection` agora inclui `user_id: string`.

## Arquivos Mortos / Código Não Usado

- `services/settings.ts` exporta `save`, mas a função `save` não é amplamente invocada (arquivo LEGADO).
- `services/profile.ts` exporta `get`, mas esse método não é amplamente utilizado atualmente.

## Código Duplicado

- Vários formulários repetem padrões de UI e estrutura.
- `AppModal` e padrões de modal aparecem repetidos sem abstração adicional.
- Observação: a duplicação de `getAuthenticatedUserId()` foi centralizada em `lib/auth.ts` durante a última refatoração, removendo chamadas repetidas em múltiplos serviços.

## Oportunidades de Melhoria

1. Centralizar estilos compartilhados ou criar componentes de formulário/inputs reusáveis para reduzir duplicação.
2. Consolidar chamadas de carregamento de dados e atualizar listas com `useCallback` + estado global local.
3. Reduzir chamadas de banco redundantes (ex.: counts em lote em vez de queries individuais por cartão).
4. Tornar `services/profile.ts` e `services/settings.ts` consistentes com métodos usados; remover ou usar métodos não utilizados.
5. Evitar `any` em estados de modal e `useLocalSearchParams` retornos; tipar melhor `appModalConfig` e `findingId`.
6. Normalizar imagens em vez de usar data URIs em `findings.photos` para reduzir consumo de memória.
7. Melhorar UX de autenticação / validação de formulário com mensagens mais específicas e tratamento de erros.
8. Considerar extração de lógica de `RootGuard` para hooks/funções reutilizáveis.
9. Migrar uso de `services/settings.ts` antes de removê-lo (dependência do relatório).
10. Verificar banco de dados e esquemas Supabase para garantir que `profiles`, `inspections`, `findings` e storage bucket `company-logos` estejam sincronizados.

## Refatorações Concluídas

- Centralização da autenticação em `lib/auth.ts` (função `getAuthenticatedUserId()` consolidada).
- Remoção da duplicação de `getAuthenticatedUserId()` em serviços.
- Melhoria do hook `useAuth` para expor `displayName` e `isAuthenticated`.
- Atualização da interface `Inspection` para incluir `user_id`.
- Remoção de código morto quando aplicável (ex.: limpeza de exports não utilizados).

## Roadmap Técnico

1. Remover `services/settings.ts` após migrar o módulo de relatórios.
2. Refatorar completamente o sistema de geração de relatórios.
3. Revisar e padronizar componentes compartilhados.
4. Etapa de UI/UX Polish.
5. Otimizações de performance.
6. Testes finais.
7. Build de produção.

---

Este documento foi atualizado para refletir a estrutura e decisões após a última refatoração.
