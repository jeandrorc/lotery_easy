import axios from 'axios';
import { LotteryResult, LotteryType } from '../types/lottery';
import { FileStorage } from './file-storage';

export class LotteryScraper {
  private baseUrl = 'https://api.guidi.dev.br/loteria';
  private fileStorage: FileStorage;

  constructor() {
    this.fileStorage = new FileStorage();
  }

  async getResults(
    type: LotteryType, 
    limit: number = 10, 
    options: { fromYear?: number; fromConcurso?: number } = {}
  ): Promise<LotteryResult[]> {
    try {
      console.log(`🔍 Iniciando busca de resultados para ${type.toUpperCase()}...`);
      
      // Primeiro, vamos obter o último concurso para saber o número mais recente
      console.log(`📡 Consultando o último concurso de ${type.toUpperCase()}...`);
      const latestResult = await this.getLatestResult(type);
      const results: LotteryResult[] = [];
      
      if (!latestResult) {
        console.log(`❌ Não foi possível obter o último concurso de ${type.toUpperCase()}`);
        return [];
      }
      
      console.log(`✅ Último concurso obtido: ${type.toUpperCase()} #${latestResult.concurso} (${latestResult.data})`);
      
      // Determinar o concurso inicial com base nas opções
      let startConcurso = latestResult.concurso;
      let endConcurso = Math.max(1, startConcurso - limit + 1);
      
      if (options.fromConcurso) {
        // Se especificou um concurso inicial, começamos a partir dele
        endConcurso = options.fromConcurso;
        console.log(`🔍 Buscando resultados a partir do concurso #${endConcurso}`);
      }
      
      // Adiciona o resultado mais recente se não estiver buscando a partir de um concurso específico
      if (!options.fromConcurso || latestResult.concurso >= options.fromConcurso) {
        results.push(latestResult);
      }
      
      // Obtém os resultados anteriores
      if (startConcurso > endConcurso) {
        console.log(`📡 Buscando concursos de ${type.toUpperCase()} (${endConcurso} até ${startConcurso - 1})...`);
        
        for (let i = startConcurso - 1; i >= endConcurso; i--) {
          try {
            console.log(`📡 Consultando ${type.toUpperCase()} #${i}...`);
            const result = await this.getResultByConcurso(type, i);
            
            if (result) {
              console.log(`✅ Concurso #${i} obtido com sucesso`);
              
              // Se estamos filtrando por ano, verificamos a data
              if (options.fromYear) {
                const resultYear = parseInt(result.data.split('/')[2]);
                if (resultYear >= options.fromYear) {
                  results.push(result);
                } else {
                  console.log(`⏭️ Concurso #${i} é de ${resultYear}, anterior ao ano ${options.fromYear}, parando busca.`);
                  break;
                }
              } else {
                results.push(result);
              }
            } else {
              console.log(`❌ Não foi possível obter dados do concurso #${i}`);
            }
          } catch (error) {
            console.warn(`❌ Erro ao obter o concurso #${i} da ${type.toUpperCase()}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
          }
        }
      }
      
      console.log(`🎉 Total de ${results.length} resultados obtidos para ${type.toUpperCase()}`);
      return results;
    } catch (error) {
      console.error(`❌ Erro ao obter resultados da ${type.toUpperCase()}:`, error);
      throw error;
    }
  }

  async getAndSaveResults(
    type: LotteryType, 
    limit: number = 10, 
    options: { fromYear?: number; fromConcurso?: number; saveAsText?: boolean } = { saveAsText: true }
  ): Promise<string> {
    console.log(`\n📊 Iniciando processo para ${type.toUpperCase()} - Limite: ${limit} resultados`);
    
    if (options.fromYear) {
      console.log(`📅 Filtrando resultados a partir do ano ${options.fromYear}`);
    }
    
    if (options.fromConcurso) {
      console.log(`🔢 Filtrando resultados a partir do concurso #${options.fromConcurso}`);
    }
    
    const results = await this.getResults(type, limit, { 
      fromYear: options.fromYear, 
      fromConcurso: options.fromConcurso 
    });
    
    if (results.length === 0) {
      console.log(`⚠️ Nenhum resultado encontrado para ${type.toUpperCase()}`);
      return `Nenhum resultado encontrado para ${type.toUpperCase()}`;
    }
    
    // Salva os resultados em formato JSON
    console.log(`💾 Salvando resultados de ${type.toUpperCase()} em formato JSON...`);
    const jsonPath = await this.fileStorage.saveResults(type, results);
    console.log(`✅ Arquivo JSON salvo em: ${jsonPath}`);
    
    // Salva apenas os números sorteados
    console.log(`📊 Salvando apenas os números sorteados de ${type.toUpperCase()}...`);
    const numbersPath = await this.fileStorage.saveNumbersOnly(type, results);
    console.log(`✅ Arquivo de números salvo em: ${numbersPath}`);
    
    // Se solicitado, também salva em formato de texto completo
    if (options.saveAsText !== false) {
      console.log(`📝 Salvando resultados detalhados de ${type.toUpperCase()} em formato de texto...`);
      const textPath = await this.fileStorage.saveResultsAsText(type, results);
      console.log(`✅ Arquivo de texto detalhado salvo em: ${textPath}`);
      return textPath;
    }
    
    return jsonPath;
  }

  private async getLatestResult(type: LotteryType): Promise<LotteryResult | null> {
    try {
      const url = `${this.baseUrl}/${type}/ultimo`;
      console.log(`📡 GET ${url}`);
      
      const startTime = Date.now();
      const response = await axios.get(url);
      const endTime = Date.now();
      
      console.log(`✅ Resposta recebida em ${endTime - startTime}ms - Status: ${response.status}`);
      
      if (response.data) {
        return this.mapApiResponseToLotteryResult(response.data, type);
      } else {
        console.log(`⚠️ Resposta vazia para ${url}`);
        return null;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(`❌ Erro na requisição para ${type}/ultimo: ${error.message}`);
        if (error.response) {
          console.error(`   Status: ${error.response.status}`);
          console.error(`   Dados: ${JSON.stringify(error.response.data)}`);
        }
      } else {
        console.error(`❌ Erro ao obter o último resultado da ${type}:`, error);
      }
      return null;
    }
  }

  private async getResultByConcurso(type: LotteryType, concurso: number): Promise<LotteryResult | null> {
    try {
      const url = `${this.baseUrl}/${type}/${concurso}`;
      console.log(`📡 GET ${url}`);
      
      const startTime = Date.now();
      const response = await axios.get(url);
      const endTime = Date.now();
      
      console.log(`✅ Resposta recebida em ${endTime - startTime}ms - Status: ${response.status}`);
      
      if (response.data) {
        return this.mapApiResponseToLotteryResult(response.data, type);
      } else {
        console.log(`⚠️ Resposta vazia para ${url}`);
        return null;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(`❌ Erro na requisição para ${type}/${concurso}: ${error.message}`);
        if (error.response) {
          console.error(`   Status: ${error.response.status}`);
          console.error(`   Dados: ${JSON.stringify(error.response.data)}`);
        }
      } else {
        console.error(`❌ Erro ao obter o concurso ${concurso} da ${type}:`, error);
      }
      return null;
    }
  }

  private mapApiResponseToLotteryResult(data: any, type: LotteryType): LotteryResult {
    console.log(`🔄 Mapeando dados do concurso #${data.numero || 'desconhecido'}`);
    
    return {
      type,
      concurso: data.numero,
      data: data.dataApuracao,
      numeros: data.listaDezenas || [],
      premiacoes: data.listaRateioPremio || [],
      acumulado: data.valorAcumuladoProximoConcurso > 0,
      valorAcumulado: data.valorAcumuladoProximoConcurso || 0,
      dataProximoConcurso: data.dataProximoConcurso,
      valorEstimadoProximoConcurso: data.valorEstimadoProximoConcurso,
      localSorteio: data.localSorteio,
      nomeMunicipioUFSorteio: data.nomeMunicipioUFSorteio,
      listaMunicipioUFGanhadores: data.listaMunicipioUFGanhadores || []
    };
  }
} 