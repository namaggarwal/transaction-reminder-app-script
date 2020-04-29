/* eslint-disable no-unused-vars */
import ToDo from './microsoft-todo-app-script/todo';
import Config from './config';
import ProviderFactory from './provider-factory';

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
      const transactions = providerObj.getTransactions(
        this.providerFactory.getProviderLastExecutedTransaction(provider),
      );
      combinedMessages = combinedMessages.concat(
        transactions.map((transaction) => transaction.text),
      );
      if (transactions.length > 0) {
        this.providerFactory.setProviderLastExecutedTransaction(provider, transactions[0].id);
      }
    });
    combinedMessages.forEach((message) => {
      this.reminderApp.createTask(Config.folderID, message, new Date().toISOString());
    });
  }
}

export default Runner;
