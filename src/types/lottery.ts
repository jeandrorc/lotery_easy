export type LotteryType = 
  | 'megasena'
  | 'quina'
  | 'lotofacil'
  | 'lotomania'
  | 'duplasena'
  | 'timemania'
  | 'diadesorte'
  | 'federal'
  | 'loteca'
  | 'supersete'
  | 'maismilionaria';

export interface LotteryResult {
  type: LotteryType;
  concurso: number;
  data: string;
  numeros: string[];
  premiacoes: {
    descricaoFaixa: string;
    faixa: number;
    numeroDeGanhadores: number;
    valorPremio: number;
  }[];
  acumulado: boolean;
  valorAcumulado: number;
  dataProximoConcurso?: string;
  valorEstimadoProximoConcurso?: number;
  localSorteio?: string;
  nomeMunicipioUFSorteio?: string;
  listaMunicipioUFGanhadores?: {
    ganhadores: number;
    municipio: string;
    uf: string;
    posicao?: number;
    nomeFatansiaUL?: string;
    serie?: string;
  }[];
} 