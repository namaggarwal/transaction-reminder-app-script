/* eslint-disable no-unused-vars */
import StandardChartered from './bank';
import GMail from './gmail-app-script/gmail';
import { TransactionProvider } from './providers';

export default class ProviderFactory {
  static LAST_TRANSACTION = 'last_transaction';

  private gmailApp: GMail;

  private storage: GoogleAppsScript.Properties.Properties;

  constructor(gmailApp: GMail, storage: GoogleAppsScript.Properties.Properties) {
    this.gmailApp = gmailApp;
    this.storage = storage;
  }

  getProvider(provider: string): TransactionProvider {
    switch (provider) {
      case 'SC':
        return new StandardChartered(this.gmailApp);
      default:
    }
    return null;
  }

  getProviderLastExecutedTransaction(provider: string): string {
    switch (provider) {
      case 'SC':
        return this.storage.getProperty(`${provider}_${ProviderFactory.LAST_TRANSACTION}`);
      default:
    }
    return null;
  }

  setProviderLastExecutedTransaction(provider: string, value: string) {
    switch (provider) {
      case 'SC':
        this.storage.setProperty(`${provider}_${ProviderFactory.LAST_TRANSACTION}`, value);
        break;
      default:
    }
  }
}
