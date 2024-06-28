import { ISagaTransactionService } from '../../../sagaTransaction/ISagaTransactionService';

export class TxA implements ISagaTransactionService {

  constructor() {
  }

  execute = async (): Promise<unknown> => {
    console.log('execute A');
    return;
  };

  compensate = async (): Promise<unknown> => {
    console.log('compensate A');
    return;
  };
}