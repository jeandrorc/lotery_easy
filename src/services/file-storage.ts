import fs from 'fs';
import path from 'path';
import { LotteryResult, LotteryType } from '../types/lottery';

export class FileStorage {
  private baseDir: string;

  constructor(baseDir: string = 'data') {
    this.baseDir = baseDir;
    this.ensureDirectoryExists();
  }

  private ensureDirectoryExists(): void {
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
  }

  async saveResults(type: LotteryType, results: LotteryResult[]): Promise<string> {
    const filePath = path.join(this.baseDir, `${type}.json`);
    
    try {
      // Formatar os dados para melhor legibilidade
      const data = JSON.stringify(results, null, 2);
      fs.writeFileSync(filePath, data, 'utf8');
      return filePath;
    } catch (error) {
      console.error(`Erro ao salvar resultados da ${type}:`, error);
      throw error;
    }
  }

  async saveResultsAsText(type: LotteryType, results: LotteryResult[]): Promise<string> {
    const filePath = path.join(this.baseDir, `${type}.txt`);
    
    try {
      let textContent = `Resultados da ${type.toUpperCase()}\n`;
      textContent += '='.repeat(40) + '\n\n';
      
      results.forEach(result => {
        textContent += `Concurso: ${result.concurso} - Data: ${result.data}\n`;
        textContent += `Números: ${result.numeros.join(', ')}\n`;
        textContent += `Local do Sorteio: ${result.localSorteio || 'N/A'} - ${result.nomeMunicipioUFSorteio || 'N/A'}\n\n`;
        
        if (result.premiacoes && result.premiacoes.length > 0) {
          textContent += 'Premiações:\n';
          result.premiacoes.forEach(premio => {
            textContent += `  ${premio.descricaoFaixa}: ${premio.numeroDeGanhadores} ganhadores - R$ ${premio.valorPremio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n`;
          });
          textContent += '\n';
        }
        
        if (result.listaMunicipioUFGanhadores && result.listaMunicipioUFGanhadores.length > 0) {
          textContent += 'Cidades com ganhadores:\n';
          result.listaMunicipioUFGanhadores.forEach(cidade => {
            textContent += `  ${cidade.municipio}/${cidade.uf}: ${cidade.ganhadores} ganhador(es)\n`;
          });
          textContent += '\n';
        }
        
        textContent += `Acumulado: ${result.acumulado ? 'Sim' : 'Não'}\n`;
        
        if (result.dataProximoConcurso) {
          textContent += `Próximo Concurso: ${result.dataProximoConcurso} - `;
          textContent += `Valor Estimado: R$ ${(result.valorEstimadoProximoConcurso || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n`;
        }
        
        textContent += '\n' + '-'.repeat(40) + '\n\n';
      });
      
      fs.writeFileSync(filePath, textContent, 'utf8');
      return filePath;
    } catch (error) {
      console.error(`Erro ao salvar resultados da ${type} como texto:`, error);
      throw error;
    }
  }

  async saveNumbersOnly(type: LotteryType, results: LotteryResult[]): Promise<string> {
    const filePath = path.join(this.baseDir, `${type}_numeros.txt`);
    
    try {
      let textContent = `Números sorteados - ${type.toUpperCase()}\n`;
      textContent += '='.repeat(40) + '\n\n';
      
      results.forEach(result => {
        textContent += `Concurso: ${result.concurso.toString().padStart(4, '0')} Data: ${result.data} Dezenas: ${result.numeros.join(' ')}\n`;
      });
      
      fs.writeFileSync(filePath, textContent, 'utf8');
      return filePath;
    } catch (error) {
      console.error(`Erro ao salvar números da ${type}:`, error);
      throw error;
    }
  }

  async loadResults(type: LotteryType): Promise<LotteryResult[]> {
    const filePath = path.join(this.baseDir, `${type}.json`);
    
    try {
      if (!fs.existsSync(filePath)) {
        return [];
      }
      
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data) as LotteryResult[];
    } catch (error) {
      console.error(`Erro ao carregar resultados da ${type}:`, error);
      return [];
    }
  }
} 