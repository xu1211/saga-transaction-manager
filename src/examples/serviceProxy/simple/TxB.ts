import { ISagaTransactionService } from '../../../sagaTransaction/ISagaTransactionService';

export class TxB implements ISagaTransactionService {
  protected error: boolean | undefined
  constructor(error?: boolean) {
    this.error = error
  }

  execute = async (): Promise<unknown> => {
    if (this.error) {
      throw new Error('B error')
    }
    console.log('execute B');
    return;
  };

  compensate = async (): Promise<unknown> => {
    console.log('compensate B');
    return;
  };
}