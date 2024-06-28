import { ISagaTransactionService } from '../ISagaTransactionService';

// Used to execute transactions in order and automatically trigger rollback operations in case of errors.
export class TmSequentialExecution {
  private transactionInProgress: boolean;
  private serviceQueue: ISagaTransactionService[] = [];
  private finallyServiceIndex: number;

  constructor() {
    this.transactionInProgress = false;
    this.serviceQueue = [];
    this.finallyServiceIndex = -1;
  }

  addService(service: ISagaTransactionService): this {
    if (this.transactionInProgress) {
      throw new Error(`Cannot add transaction. Another transaction is already in progress.`);
    }
    this.serviceQueue.push(service);
    console.info(`[SagaTransaction]: ${service.constructor.name} added to queue.`);
    return this;
  }

  async execute(): Promise<this> {
    if (this.transactionInProgress) {
      throw new Error('Cannot execute transactions. Another transaction is already in progress.');
    }
    this.transactionInProgress = true;

    try {
      for (let i = 0; i < this.serviceQueue.length; i++) {
        const service = this.serviceQueue[i];
        console.info(`[SagaTransaction]: Executing ${service.constructor.name}...`);
        this.finallyServiceIndex = i;
        await service.execute();
      }
      return this;
    } catch (error) {
      console.error('[ServiceTransaction]: Transaction execution failed:', error);
      this.compensate();
      return this;
    }
  }

  async compensate(): Promise<void> {
    console.info('[ServiceTransaction] compensate');
    for (let i = this.finallyServiceIndex; i >= 0; i--) {
      const transaction = this.serviceQueue[i];
      try {
        await transaction.compensate();
        console.info(`[ServiceTransaction]: ${transaction.constructor.name} rolled back.`);
      } catch (error) {
        console.error('[ServiceTransaction]: Transaction compensate failed:', error);
        throw error;
      }
    }
  }
}
