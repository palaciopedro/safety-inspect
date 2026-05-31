# Safety Inspection App

Aplicativo mobile para inspeções de segurança do trabalho, desenvolvido com React Native, Expo, TypeScript e Supabase.

---

## Tecnologias

- React Native + Expo
- Expo Router
- TypeScript
- Supabase
- expo-print + expo-sharing (exportação PDF)
- expo-image-picker + expo-image-manipulator (captura e otimização de imagens)
- react-native-signature-canvas (assinatura do inspetor)
- react-native-svg

---

## Funcionalidades

- Criar, editar e excluir inspeções
- Criar, editar e excluir ocorrências
- Cálculo automático de risco HRN
- Suporte a múltiplas fotos por ocorrência
- Captura de fotos pela câmera
- Seleção de fotos da galeria
- Redimensionamento automático de imagens (máximo 800x800px)
- Assinatura digital do inspetor
- Datas no padrão brasileiro (dd/MM/yyyy)
- Exportação de relatório em PDF
- Exportação de planilha CSV compatível com Excel
- Atualização automática das telas após alterações

---

## Níveis de Risco (HRN)

| Pontuação | Nível |
|------------|------------|
| 0 – 1 | Raro |
| 1.1 – 5 | Baixo |
| 5.1 – 50 | Atenção |
| 50.1 – 500 | Alto |
| Acima de 500 | Extremo |

---

## Estrutura do Projeto

```text
/app
  _layout.tsx
  index.tsx
  new-inspection.tsx
  new-finding.tsx
  inspection/
    [id].tsx

/components
  Dropdown.tsx
  FinalizationModal.tsx
  FindingCard.tsx
  InspectionCard.tsx
  PhotoPicker.tsx
  RiskBadge.tsx

/constants
  dropdownOptions.ts

/lib
  supabase.ts

/services
  database.ts
  csv.ts
  report.ts

/types
  index.ts

/utils
  date.ts
  generateReport.ts
  image.ts
  risk.ts

/supabase
  schema.sql
```

---

## Banco de Dados

### Tabela: inspections

| Coluna | Tipo | Descrição |
|----------|----------|----------|
| id | uuid | Chave primária |
| unit | text | Unidade |
| date | date | Data da inspeção |
| status | text | draft ou completed |
| inspector_name | text | Nome do inspetor |
| inspector_role | text | Cargo do inspetor |
| inspector_signature | text | Assinatura em base64 |
| created_at | timestamptz | Data de criação |

### Tabela: findings

| Coluna | Tipo | Descrição |
|----------|----------|----------|
| id | uuid | Chave primária |
| inspection_id | uuid | FK para inspections |
| risk_description | text | Descrição do risco |
| sector | text | Setor |
| what_to_do | text | O que fazer |
| why_to_do | text | Por que fazer |
| gravity_label | text | Texto da gravidade |
| gravity_value | numeric | Valor da gravidade |
| frequency_label | text | Texto da frequência |
| frequency_value | numeric | Valor da frequência |
| probability_label | text | Texto da probabilidade |
| probability_value | numeric | Valor da probabilidade |
| exposure_label | text | Texto da exposição |
| exposure_value | numeric | Valor da exposição |
| calculated_score | numeric | Resultado do HRN |
| risk_level | text | Classificação do risco |
| photos | jsonb | Lista de fotos em base64 |
| created_at | timestamptz | Data de criação |

---

## Instalação

### 1. Instalar dependências

```bash
npm install
```

### 2. Criar projeto no Supabase

1. Crie um projeto em https://supabase.com
2. Abra o SQL Editor
3. Execute o arquivo:

```text
supabase/schema.sql
```

### 3. Configurar credenciais

Edite:

```text
/lib/supabase.ts
```

```ts
const SUPABASE_URL = 'https://seu-projeto.supabase.co';
const SUPABASE_ANON_KEY = 'sua-chave-anon';
```

### 4. Configurar permissões

Execute no SQL Editor:

```sql
create policy "Enable all for inspections"
on inspections for all
using (true)
with check (true);

create policy "Enable all for findings"
on findings for all
using (true)
with check (true);
```

### 5. Executar o projeto

```bash
npx expo start
```

---

## Atualização de Banco de Dados

Caso o banco tenha sido criado antes das funcionalidades mais recentes:

```sql
alter table findings
add column if not exists sector text not null default '';

alter table findings
add column if not exists photos jsonb not null default '[]';

alter table inspections
add column if not exists inspector_name text;

alter table inspections
add column if not exists inspector_role text;

alter table inspections
add column if not exists inspector_signature text;
```

---

## Exportações

### PDF

- Gerado com expo-print
- Baseado no modelo da empresa
- Inclui ocorrências
- Inclui fotos
- Inclui assinatura do inspetor
- Compartilhamento nativo do dispositivo

### CSV

Compatível com:

- Microsoft Excel
- Google Sheets
- LibreOffice Calc

Campos exportados:

- O que fazer
- Por que?
- Onde?
- Quem?
- Prazo início
- Prazo término
- Início
- Realizado
- Nº O.S. Engeman
- Valor
- Grav
- Freq
- Prob
- Exp
- HRN
- Recurso
- Observações

---

## Modo de Edição

As telas de criação também são utilizadas para edição.

### Inspeções

Permite editar:

- Unidade
- Data

### Ocorrências

Permite editar:

- Descrição do risco
- Setor
- O que fazer
- Por que fazer
- Gravidade
- Frequência
- Probabilidade
- Exposição
- Fotos

O HRN é recalculado automaticamente.

---

## Tratamento de Fotos

- Múltiplas fotos por ocorrência
- Captura pela câmera
- Seleção pela galeria
- Remoção de fotos
- Compressão automática
- Limite máximo de 800x800 pixels
- Armazenamento em base64

---

## Assinatura do Inspetor

- Obrigatória para finalizar inspeções
- Desenhada diretamente na tela
- Armazenada em base64
- Incluída nos relatórios PDF
- Vinculada à inspeção

---

## Decisões Técnicas

- Datas são armazenadas como `date` para evitar problemas de fuso horário
- Fotos são redimensionadas automaticamente para até 800x800 pixels
- Fotos são armazenadas em base64 dentro de uma coluna JSONB
- Assinaturas são armazenadas em base64 PNG
- `useFocusEffect` garante atualização automática das telas
- As telas de criação são reutilizadas para edição
- CSV foi adotado em vez de XLSX por maior compatibilidade com Expo
- O cálculo de risco é atualizado automaticamente sempre que os fatores mudam
