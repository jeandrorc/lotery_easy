# 🎲 Sistema de Consulta de Resultados de Loterias

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Yarn-2C8EBB?style=for-the-badge&logo=yarn&logoColor=white" alt="Yarn">
  <img src="https://img.shields.io/badge/status-em%20desenvolvimento-yellow?style=for-the-badge" alt="Status: Em Desenvolvimento">
</p>

<p align="center">
  Uma aplicação moderna para consultar, analisar e salvar resultados das loterias da Caixa Econômica Federal.
</p>

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Instalação](#-instalação)
- [Como Usar](#-como-usar)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Próximos Passos](#-próximos-passos)
- [API de Loterias](#-api-de-loterias)
- [Contribuição](#-contribuição)
- [Licença](#-licença)

## 🔍 Visão Geral

Este projeto permite consultar os resultados das loterias da Caixa Econômica Federal através de uma API, com opções para filtrar por quantidade de concursos, ano específico ou a partir de um concurso determinado. Os resultados são salvos em diferentes formatos para facilitar análises posteriores.

## ✨ Funcionalidades

- 🎮 **Interface CLI interativa** para seleção de loterias e filtros
- 🔄 **Consulta de resultados** de diversas loterias (Mega-Sena, Lotofácil, Quina, etc.)
- 🔍 **Filtragem flexível** por:
  - Quantidade de resultados
  - Ano específico
  - Concurso específico
- 💾 **Múltiplos formatos de salvamento**:
  - JSON completo com todos os detalhes
  - TXT formatado com informações detalhadas
  - TXT simplificado apenas com concurso, data e números sorteados
- 📊 **Logs detalhados** das operações e chamadas à API

## 🛠 Tecnologias

- **TypeScript**: Linguagem principal
- **Node.js**: Ambiente de execução
- **Axios**: Cliente HTTP para requisições à API
- **Inquirer**: Biblioteca para interface de linha de comando interativa

## 📥 Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/lottery-system.git
   cd lottery-system
   ```

2. Instale as dependências:
   ```bash
   yarn install
   ```

3. Inicie o projeto:
   ```bash
   yarn dev
   ```

## 📦 Estrutura do Projeto

```bash
lottery-system/
├── src/
│ ├── services/
│ ├── types/
│ ├── index.ts
│ └── cli-service.ts
├── data/
├── package.json
├── tsconfig.json
└── README.md
```

## 🔄 Próximos Passos

## 🔮 Próximos Passos

### Interface Web

Estamos trabalhando em uma interface web moderna e responsiva que incluirá:

- 🖥️ **Dashboard interativo** com visualização dos últimos resultados
- 📊 **Gráficos e estatísticas** sobre frequência de números
- 🔍 **Filtros avançados** para análise personalizada
- 📱 **Design responsivo** para desktop e dispositivos móveis
- 🎲 **Gerador de jogos** baseado em análises estatísticas
- 🔔 **Notificações** sobre novos sorteios
- 💾 **Exportação de dados** em diferentes formatos

### Melhorias Técnicas

- Implementação de testes automatizados
- Otimização de performance para grandes volumes de dados
- Suporte para mais modalidades de loterias
- Armazenamento em banco de dados para consultas mais rápidas

## 🌐 API de Loterias

Este projeto utiliza a [API de resultados das loterias da Caixa](https://github.com/guidi/loteria_api) desenvolvida por [guidi](https://github.com/guidi). Esta API gratuita fornece resultados atualizados das seguintes loterias:

- Mega-Sena
- Lotofácil
- Quina
- Lotomania
- Dupla Sena
- Timemania
- Dia de Sorte
- Federal
- Loteca
- Super Sete
- +Milionária

A API está disponível em: `https://api.guidi.dev.br/loteria`

Exemplos de uso:
- Último concurso da Mega-Sena: `https://api.guidi.dev.br/loteria/megasena/ultimo`
- Concurso específico: `https://api.guidi.dev.br/loteria/megasena/2000`

Os dados são obtidos em tempo real do site da Caixa, garantindo que os resultados estejam sempre atualizados.

## 👥 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.

1. Faça um fork do projeto
2. Crie sua branch de feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

---

<p align="center">
  Desenvolvido com ❤️ por Jeandro Couto
</p>
