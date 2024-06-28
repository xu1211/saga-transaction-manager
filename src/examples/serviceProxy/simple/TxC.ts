import { ISagaTransactionService } from '../../../sagaTransaction/ISagaTransactionService';

export class TxC implements ISagaTransactionService {
  protected error: boolean | undefined
  constructor(error?: boolean) {
    this.error = error
  }

  execute = async (): Promise<unknown> => {
    if (this.error) {
      throw new Error('C error')
    }
    console.log('execute C');
    return;
  };

  compensate = async (): Promise<unknown> => {
    console.log('compensate C');
    return;
  };
}
