import GMail from './gmail-app-script/gmail';

interface TransactionProvider {
  getTransactions(): string[]
}

class StandardChartered implements TransactionProvider {
  private gmailClient: GMail

  constructor(gmailClient: GMail) {
    this.gmailClient = gmailClient;
  }

  getTransactions(): string[] {
    const transactions: string[] = [];
    const threads = this.gmailClient.search('label:bank-sc transaction alert primary newer_than:10d');
    const messages = GMail.getFlattenMessagesFromThreads(threads);
    messages.forEach((message) => {
      const text = StandardChartered.getTransactionText(message.text);
      if (text) {
        transactions.push(text);
      }
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

export default StandardChartered;
