interface TransactionProvider {
  getTransactions(): string[]
}

class StandardChartered implements TransactionProvider {

  getTransactions(): string[] {
    const transactions: string[] = [];

    const messages = [
      {
        "text": "sdjhsdjhds jhsdjdh Transaction Alert Primary / Supplementary Card Thank you for charging +SGD 8.53 on 26-Apr-20 01:06 PM to yr credit card ****2815 at GIANT EXPRESS-JL MEMBI."
      },
      {
        "text": "sdjhsdjhds jhsdjdh Transaction Alert Primary / Supplementary Card Thank you for charging +SGD 10.53 on 26-Apr-20 01:06 PM to yr credit card ****2815 at GIANT EXPRESS-JL MEMBI."
      },
      {
        "text": "sdjhsdjhds jhsdjdh Transaction Alert Primary / Supplementary Card Thank you for charging +SGD 89.53 on 26-Apr-20 01:06 PM to yr credit card ****2815 at GIANT EXPRESS-JL MEMBI."
      }
    ]

    messages.forEach((message) => {
      const text = StandardChartered.getTransactionText(message.text);
      if(text) {
        transactions.push(text);
      }
    });

    return transactions;
  }

  private static getTransactionText(text: string): string {
    const re = /\+([A-Z]+ \d+\.?(\d+)?).*at (.*)/
    const match = re.exec(text)
    if (Array.isArray(match) && match.length >= 4) {
      return match[1] + " at " + match[3];
    }
  }
}
