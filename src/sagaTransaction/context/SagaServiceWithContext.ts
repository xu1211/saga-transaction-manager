import { ISagaTransactionService } from '../ISagaTransactionService';
import ServiceContext from './Context';

export abstract class SagaServiceWithContext implements ISagaTransactionService {
  protected context: ServiceContext | undefined;

  setContext(context: ServiceContext): void {
    this.context = context;
  }

  abstract execute(input?: unknown): Promise<unknown>;

  abstract compensate(input?: unknown): Promise<unknown>;
}