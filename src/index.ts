import { LotteryScraper } from './services/lottery-scraper';
import { CliService } from './services/cli-service';

async function main() {
  const scraper = new LotteryScraper();
  const cliService = new CliService();
  
  try {
    cliService.showWelcomeMessage();
    
    let continueRunning = true;
    
    while (continueRunning) {
      // Solicita ao usuário que escolha a loteria e o período
      const { lotteryType, limit, fromYear, fromConcurso } = await cliService.promptLotterySelection();
      
      console.log(`\nObtendo resultados da ${lotteryType.toUpperCase()}...`);
      
      // Obtém e salva os resultados
      const filePath = await scraper.getAndSaveResults(lotteryType, limit, {
        fromYear,
        fromConcurso,
        saveAsText: true
      });
      
      console.log(`\n✅ Resultados salvos com sucesso em: ${filePath}`);
      
      // Pergunta se o usuário deseja consultar outra loteria
      continueRunning = await cliService.promptContinue();
    }
    
    cliService.showGoodbyeMessage();
    
  } catch (error) {
    console.error('Erro ao processar resultados:', error);
  }
}

main(); 