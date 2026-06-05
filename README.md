# Safety Inspect

Aplicativo mobile para gestão de inspeções de Segurança e Saúde no Trabalho (SST), desenvolvido com React Native, Expo, TypeScript e Supabase.

O Safety Inspect permite registrar inspeções, documentar ocorrências com fotos, calcular automaticamente o nível de risco através da metodologia HRN (Hazard Rating Number), coletar assinaturas digitais e gerar relatórios profissionais em PDF e planilhas CSV.

## Principais Recursos

* Cadastro e gerenciamento de inspeções
* Cadastro e gerenciamento de ocorrências
* Cálculo automático de risco HRN
* Registro de múltiplas fotos por ocorrência
* Captura de imagens pela câmera
* Seleção de imagens da galeria
* Compressão automática de imagens
* Assinatura digital do Auditor SST
* Assinatura digital do Responsável pelo Local
* Relatórios PDF profissionais
* Exportação CSV compatível com Excel
* Configuração de dados da empresa
* Logotipo personalizado nos relatórios
* Interface moderna otimizada para dispositivos móveis
* Atualização automática de dados entre telas
* Classificação automática dos riscos
* Armazenamento em nuvem com Supabase

## Status da Inspeção

As inspeções podem possuir dois estados:

### Rascunho (Draft)

Permite:

* Adicionar ocorrências
* Editar ocorrências
* Excluir ocorrências
* Alterar dados da inspeção

### Finalizada (Completed)

Após a finalização:

* As assinaturas são registradas
* O relatório PDF pode ser gerado
* A planilha CSV pode ser exportada
* Os responsáveis ficam vinculados à inspeção

## Relatórios

O relatório PDF contém:

* Dados da empresa
* Logotipo personalizado
* Informações da inspeção
* Ocorrências registradas
* Fotografias
* Avaliação HRN
* Recomendações
* Requisitos legais
* Assinaturas dos responsáveis

## Configurações

O aplicativo permite configurar:

* Nome da empresa
* Logotipo da empresa

Essas informações são utilizadas automaticamente nos relatórios gerados.

## Segurança

Estrutura preparada para evolução futura com:

* Autenticação de usuários
* Controle de acesso por empresa
* Políticas de segurança no Supabase (RLS)
* Auditoria de alterações
* Backup de dados

## Arquitetura

Frontend:

* React Native
* Expo
* TypeScript
* Expo Router

Backend:

* Supabase
* PostgreSQL

Bibliotecas principais:

* expo-print
* expo-sharing
* expo-image-picker
* expo-image-manipulator
* react-native-signature-canvas
* react-native-svg
