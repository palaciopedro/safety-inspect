# PROJECT_MAP

## Visão Geral

Aplicativo mobile React Native built with Expo Router. O app gerencia inspeções de segurança do trabalho, registros de ocorrências, geração de relatórios em PDF/CSV, e settings de perfil/empresa. A autenticação e persistência de dados usam Supabase, enquanto configurações locais usam AsyncStorage.

## Arquitetura do Projeto

- `app/` - telas e roteamento do Expo Router.
- `context/` - provider de autenticação global.
- `hooks/` - aliases de hooks reutilizáveis.
- `services/` - lógica de acesso a dados, exportação e perfil.
- `lib/` - inicialização do cliente Supabase.
- `components/` - componentes reutilizáveis de UI.
- `utils/` - utilitários puros como formatação de data, imagens e geração de HTML para relatório.
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
│  └─ supabase.ts
├─ services/
│  ├─ csv.ts
│  ├─ database.ts
│  ├─ profile.ts
│  ├─ report.ts
│  └─ settings.ts
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
- `hooks/useAuth.ts` - reexporta `useAuthContext` como `useAuth`.

### Biblioteca Supabase
- `lib/supabase.ts` - configura cliente Supabase com AsyncStorage e polyfill URL.

### Services
- `services/database.ts` - serviço central de `inspections` e `findings` com operações CRUD.
- `services/profile.ts` - serviço de perfil e upload de logo no storage Supabase.
- `services/report.ts` - geração e compartilhamento de PDF usando HTML criado por `utils/generateReport.ts`.
- `services/csv.ts` - exporta dados de ocorrência para CSV e compartilha via `expo-sharing`.
- `services/settings.ts` - carrega e salva configurações locais em AsyncStorage.

### Tipos
- `types/index.ts` - tipos TypeScript para `RiskLevel`, `Inspection`, `DropdownOption`, `Finding`, `Profile`.

### Utils
- `utils/date.ts` - formatação de datas e data atual local.
- `utils/generateReport.ts` - HTML para gerar PDF do relatório.
- `utils/image.ts` - redimensiona imagens e retorna data URI.
- `utils/risk.ts` - cálculo de score, nível de risco e cor do badge.

## Dependências Entre Arquivos

- `app/_layout.tsx` usa `AuthContext.tsx`.
- `AuthContext.tsx` usa `lib/supabase.ts` e tipos de `types/index.ts`.
- `hooks/useAuth.ts` reexporta `AuthContext.tsx`.
- `app/(auth)/index.tsx`, `app/(app)/index.tsx`, `app/(app)/settings.tsx` usam `useAuth`.
- `app/(app)/index.tsx` usa `db.inspections.list`, `InspectionCard`.
- `app/(app)/new-inspection.tsx` usa `db.inspections.getById/create/update`.
- `app/(app)/inspection/[id].tsx` usa `db.inspections.getById`, `db.findings.listByInspection`, `FindingCard`, `FinalizationModal`, `AppModal`, `generateAndShareReport`, `generateAndShareCSV`, `formatDateBR`.
- `app/(app)/new-finding.tsx` usa `db.findings.getById/create/update`, `PhotoPicker`, `RiskBadge`, `Dropdown`, `constants/dropdownOptions`, `calculateRiskScore`, `getRiskLevel`.
- `app/(app)/settings.tsx` usa `profileService`, `useAuth` e `Image` preview.
- `components/InspectionCard.tsx` usa `formatDateBR`, `db.findings.listByInspection`, `AppModal`.
- `components/FindingCard.tsx` usa `RiskBadge`, `AppModal`.
- `components/PhotoPicker.tsx` usa `processImage` e `AppModal`.
- `components/RiskBadge.tsx` usa `getRiskColor`.
- `services/report.ts` usa `settingsService.load` e `generateReportHTML`.
- `services/csv.ts` usa `Inspection`/`Finding` types.
- `services/profile.ts` usa `supabase` e `expo-image-picker`.
- `utils/generateReport.ts` usa `getRiskColor`, `formatDateBR`, `AppSettings`.

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
- `services/database.ts` realiza todas as operações de `inspections` e `findings`.
- Cada método `db` garante usuário autenticado via `supabase.auth.getSession()`.
- `inspections` usa a tabela `inspections` e adiciona `user_id` ao criar.
- `findings` usa a tabela `findings` e filtra por `inspection_id`.
- `services/profile.ts` atualiza e obtém dados do `profiles` e faz upload de logo para um bucket chamado `company-logos`.
- `services/settings.ts` armazena configurações locais de empresa em AsyncStorage.

## Fluxo de Navegação

- Expo Router usa estrutura de pastas para rotas.
- `app/(auth)` é rota protegida para login/cadastro.
- `app/(app)` é rota do app principal.
- Roteamento principal:
  - `/` → app/(app)/index
  - `/new-inspection` → app/(app)/new-inspection
  - `/inspection/[id]` → app/(app)/inspection/[id]
  - `/new-finding` → app/(app)/new-finding
  - `/settings` → app/(app)/settings
- `RootGuard` faz redirect automático conforme estado da sessão.
- `useRouter` e `router.push` / `router.back` são usados para navegar.

## Fluxo das Inspeções

- `app/(app)/index.tsx` carrega inspeções do usuário usando `db.inspections.list` quando o foco da tela é ativado.
- `InspectionCard` exibe cada inspeção e permite:
  - abrir detalhes `/inspection/${id}`
  - editar `/new-inspection?id=${id}`
  - excluir via `db.inspections.delete`
- `new-inspection.tsx`:
  - se `id` existe, busca inspeção para editar
  - cria nova inspeção com `status: 'draft'`
  - atualiza `unit` e `date`
- `inspection/[id].tsx` mostra detalhes da inspeção.

## Fluxo das Ocorrências

- `inspection/[id].tsx` carrega ocorrências via `db.findings.listByInspection(id)`.
- A tela permite:
  - adicionar ocorrência `/new-finding?inspectionId=${id}`
  - editar ocorrência `/new-finding?inspectionId=${id}&findingId=${item.id}`
  - excluir ocorrência via `db.findings.delete`
- `new-finding.tsx`:
  - se `findingId` existe, carrega os dados da ocorrência para editar
  - coleta campos de descrição, setor, medidas e opções de risco
  - calcula `calculated_score` e `risk_level`
  - valida fotos obrigatórias
  - cria/atualiza no banco

## Fluxo das Configurações

- `app/(app)/settings.tsx` possui perfil e empresa.
- Carrega dados do perfil do contexto via `useAuth()`.
- Permite editar nome, sobrenome e nome da empresa.
- Salva alterações com `profileService.update` e atualiza o contexto com `refreshProfile()`.
- Permite selecionar logo, fazer upload e exibir via URL assinada.
- Logout chama `signOut` do contexto.

## Fluxo do Upload de Imagens

### Upload em ocorrências
- `PhotoPicker.tsx` pede permissão de câmera se necessário.
- Usuário escolhe câmera ou galeria.
- Imagens são processadas por `utils/image.ts`:
  - redimensiona para 800x800
  - comprime em JPEG/PNG
  - retorna data URI base64
- Fotos são guardadas no estado `photos: string[]` e persistidas em `findings.photos`.

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

- `useAuth` - hook único que consome `AuthContext`.

## Services

- `db` em `services/database.ts`:
  - inspeções: `list`, `create`, `update`, `delete`, `getById`
  - ocorrências: `listByInspection`, `create`, `update`, `delete`, `getById`
- `profileService` em `services/profile.ts`:
  - `get`, `update`, `pickLogo`, `uploadLogo`, `getLogoUrl`
- `settingsService` em `services/settings.ts`:
  - `load`, `save`
- `generateAndShareReport` em `services/report.ts`
- `generateAndShareCSV` em `services/csv.ts`

## Utils

- `formatDateBR`, `getCurrentDateLocal`, `dateToISO` em `utils/date.ts`.
- `generateReportHTML` em `utils/generateReport.ts`.
- `processImage` em `utils/image.ts`.
- `calculateRiskScore`, `getRiskLevel`, `getRiskColor` em `utils/risk.ts`.

## Tipos

- `RiskLevel` - níveis de risco.
- `Inspection` - dados de inspeção.
- `DropdownOption` - opção para o dropdown.
- `Finding` - registro de ocorrência.
- `Profile` - dados de perfil de usuário.

## Arquivos Mortos / Código Não Usado

- `utils/date.ts` exporta `dateToISO`, que não é usado em nenhum arquivo atual.
- `services/settings.ts` exporta `save`, mas a função `save` não está hoje invocada em nenhum lugar do app.
- `services/profile.ts` exporta `get`, mas esse método também não é utilizado atualmente.

## Código Duplicado

- Vários formulários usam padrões de `View`, `TextInput`, `label`, `card` e `button` idênticos.
- `new-inspection.tsx`, `new-finding.tsx` e `settings.tsx` repetem estruturas de formulário e estilo de campo.
- `app/(app)/index.tsx`, `app/(app)/inspection/[id].tsx` e `InspectionCard.tsx` repetem lógica de carregamento/atualização após ação.
- `AppModal` e o padrão de modal de exclusão aparecem repetidos sem abstração adicional.

## Oportunidades de Melhoria

1. Centralizar estilos compartilhados ou criar componentes de formulário/inputs reusáveis para reduzir duplicação.
2. Consolidar chamadas de carregamento de dados e atualizar listas com `useCallback` + estado global local.
3. Reduzir chamadas de banco redundantes:
   - `InspectionCard` busca contagem de ocorrências individualmente para cada cartão.
   - Seria melhor usar uma query agregada ou carregar todos os counts em lote.
4. Tornar `services/profile.ts` e `services/settings.ts` consistentes com métodos usados; remover ou usar os métodos `get` e `save` não utilizados.
5. Evitar `any` em estados de modal e `useLocalSearchParams` retornos; tipar melhor `appModalConfig` e `findingId`.
6. Normalizar imagens em vez de usar data URIs em `findings.photos` para reduzir consumo de memória.
7. Melhorar UX de autenticação / validação de formulário com mensagens mais específicas e tratamento de erros.
8. Considerar extração de lógica de `RootGuard` para hooks/funções reutilizáveis.
9. Persistir configurações locais de empresa usando `settingsService.save` quando relevante e exibir no app se estiver definido.
10. Verificar banco de dados e esquemas Supabase para garantir que `profiles`, `inspections`, `findings` e storage bucket `company-logos` estejam sincronizados.

## Observações Adicionais

- `supabase.auth.getSession()` é usado em múltiplos lugares; há chance de duplicação de verificação de autenticação.
- O app depende de imagens locais `assets/logo.png` e renderiza relatórios PDF via HTML injetado.
- A navegação é controlada por `expo-router` e estrutura de pastas; o nome dos arquivos corresponde diretamente às rotas.
- O fluxo de finalização da inspeção usa assinaturas digitais em `FinalizationModal.tsx` e atualiza a inspeção para `status: 'completed'`.

---

Este documento foi criado para permitir compreensão completa do projeto sem abrir os arquivos.
