export type BankTransaction = {
  id: string,
  text: string
}

export interface TransactionProvider {
  getTransactions(lastProcessedTransaction: string): BankTransaction[]
}
