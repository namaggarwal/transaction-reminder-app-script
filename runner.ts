/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import ToDo from './microsoft-todo-app-script/todo';
import ProviderFactory from './provider-factory';
import config from './config';

class Runner {
  providers: string[]

  reminderApp: ToDo

  providerFactory: ProviderFactory

  constructor(providers: string[], providerFactory: ProviderFactory, reminderApp: ToDo) {
    this.providers = providers;
    this.reminderApp = reminderApp;
    this.providerFactory = providerFactory;
  }

  run() {
    let combinedMessages: string[] = [];
    this.providers.forEach((provider) => {
      const providerObj = this.providerFactory.getProvider(provider);
      const lastExecutedTransaction = this
        .providerFactory
        .getProviderLastExecutedTransaction(provider);
      console.log(`Last Executed Transaction ${lastExecutedTransaction}`);
      const transactions = providerObj.getTransactions(lastExecutedTransaction);
      combinedMessages = combinedMessages.concat(
        transactions.map((transaction) => transaction.text),
      );
      if (transactions.length > 0) {
        this.providerFactory.setProviderLastExecutedTransaction(provider, transactions[0].id);
      }
    });
    console.log(`Transactions to remind ${combinedMessages.length}`);
    combinedMessages.forEach((message) => {
      this.reminderApp.createTask(config.folderID, message, new Date().toISOString());
    });
  }
}

export default Runner;
