export interface ISagaTransactionService {
  execute(input?: any): Promise<any>;
  compensate(input?: any): Promise<any>;
}