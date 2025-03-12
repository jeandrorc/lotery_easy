import inquirer from 'inquirer';
import { LotteryType } from '../types/lottery';

export class CliService {
  async promptLotterySelection(): Promise<{
    lotteryType: LotteryType;
    limit: number;
    fromYear?: number;
    fromConcurso?: number;
  }> {
    const lotteryChoices = [
      { name: 'Mega-Sena', value: 'megasena' },
      { name: 'Lotofácil', value: 'lotofacil' },
      { name: 'Quina', value: 'quina' },
      { name: 'Lotomania', value: 'lotomania' },
      { name: 'Timemania', value: 'timemania' },
      { name: 'Dupla Sena', value: 'duplasena' },
      { name: 'Dia de Sorte', value: 'diadesorte' },
      { name: 'Super Sete', value: 'supersete' },
      { name: '+Milionária', value: 'maismilionaria' },
    ];

    const limitChoices = [
      { name: 'Último resultado', value: 1 },
      { name: 'Últimos 5 resultados', value: 5 },
      { name: 'Últimos 10 resultados', value: 10 },
      { name: 'Últimos 20 resultados', value: 20 },
      { name: 'Quantidade personalizada', value: 'custom' },
      { name: 'A partir de um ano específico', value: 'year' },
      { name: 'A partir de um concurso específico', value: 'concurso' },
    ];

    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'lotteryType',
        message: 'Escolha uma loteria:',
        choices: lotteryChoices,
      },
      {
        type: 'list',
        name: 'limitOption',
        message: 'Como deseja filtrar os resultados?',
        choices: limitChoices,
      },
      {
        type: 'number',
        name: 'customLimit',
        message: 'Digite a quantidade de resultados desejados:',
        when: (answers) => answers.limitOption === 'custom',
        validate: (input) => {
          const num = parseInt(String(input));
          if (isNaN(num) || num < 1) {
            return 'Por favor, digite um número válido maior que zero.';
          }
          return true;
        },
      },
      {
        type: 'number',
        name: 'fromYear',
        message: 'Digite o ano a partir do qual deseja obter resultados:',
        when: (answers) => answers.limitOption === 'year',
        validate: (input) => {
          const num = parseInt(String(input));
          const currentYear = new Date().getFullYear();
          if (isNaN(num) || num < 1996 || num > currentYear) {
            return `Por favor, digite um ano válido entre 1996 e ${currentYear}.`;
          }
          return true;
        },
      },
      {
        type: 'number',
        name: 'fromConcurso',
        message: 'Digite o número do concurso a partir do qual deseja obter resultados:',
        when: (answers) => answers.limitOption === 'concurso',
        validate: (input) => {
          const num = parseInt(String(input));
          if (isNaN(num) || num < 1) {
            return 'Por favor, digite um número de concurso válido maior que zero.';
          }
          return true;
        },
      },
    ]);

    let limit = 10; // valor padrão
    let fromYear: number | undefined = undefined;
    let fromConcurso: number | undefined = undefined;

    if (answers.limitOption === 'custom') {
      limit = answers.customLimit;
    } else if (answers.limitOption === 'year') {
      fromYear = answers.fromYear;
      limit = 1000; // Um valor alto para garantir que todos os resultados do ano sejam obtidos
    } else if (answers.limitOption === 'concurso') {
      fromConcurso = answers.fromConcurso;
      limit = 1000; // Um valor alto para garantir que todos os resultados a partir do concurso sejam obtidos
    } else if (typeof answers.limitOption === 'number') {
      limit = answers.limitOption;
    }

    return {
      lotteryType: answers.lotteryType as LotteryType,
      limit,
      fromYear,
      fromConcurso,
    };
  }

  async promptContinue(): Promise<boolean> {
    const answer = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'continue',
        message: 'Deseja consultar outra loteria?',
        default: true,
      },
    ]);

    return answer.continue;
  }

  showWelcomeMessage(): void {
    console.log('\n===================================');
    console.log('🎲 CONSULTA DE RESULTADOS DE LOTERIAS 🎲');
    console.log('===================================\n');
    console.log('Bem-vindo ao sistema de consulta de resultados de loterias!');
    console.log('Este programa permite consultar os últimos resultados das loterias da Caixa.\n');
  }

  showGoodbyeMessage(): void {
    console.log('\n===================================');
    console.log('Obrigado por usar o sistema de consulta de loterias!');
    console.log('===================================\n');
  }
} 