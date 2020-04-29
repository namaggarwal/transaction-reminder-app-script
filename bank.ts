/* eslint-disable no-unused-vars */
import GMail from './gmail-app-script/gmail';
import { TransactionProvider } from './providers';
import type { BankTransaction } from './providers';

export default class StandardChartered implements TransactionProvider {
  static LAST_PROCESSED_TRANSACTION = 'scLastProcessedTransaction';

  private gmailClient: GMail

  constructor(gmailClient: GMail) {
    this.gmailClient = gmailClient;
  }

  getTransactions(lastProcessedTransaction: string): BankTransaction[] {
    const transactions: BankTransaction[] = [];
    const threads = this.gmailClient.search('label:bank-sc transaction alert primary newer_than:10d');
    const messages = GMail.getFlattenMessagesFromThreads(threads);
    messages.some((message) => {
      if (message.id === lastProcessedTransaction) {
        return true;
      }
      const text = StandardChartered.getTransactionText(message.text);
      if (text) {
        transactions.push({
          id: message.id,
          text,
        });
      }
      return false;
    });
    return transactions;
  }

  private static getTransactionText(text: string): string {
    const re = /\+([A-Z]+ \d+\.?(\d+)?).*at (.*)/;
    const match = re.exec(text);
    if (Array.isArray(match) && match.length >= 4) {
      return `${match[1]} at ${match[3]}`;
    }
    return null;
  }
}
