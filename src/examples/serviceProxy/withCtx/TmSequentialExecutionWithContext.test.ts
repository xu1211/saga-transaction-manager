import 'reflect-metadata';

import { TmSequentialExecutionWithContext } from '../../..';
import { TxAwithCtx } from './TxAwithCtx';
import { TxBwithCtx } from './TxBwithCtx';
import { TxCwithCtx } from './TxCwithCtx';

describe('TmSequentialExecution', () => {

  it('should execute transactions in sequence', async () => {
    const tm1 = new TmSequentialExecutionWithContext()
      .addService(new TxAwithCtx())
      .addService(new TxBwithCtx())
      .addService(new TxCwithCtx());

    await tm1.execute();
  });

  it('should compensate transactions in reverse order', async () => {
    const tm2 = new TmSequentialExecutionWithContext()
      .addService(new TxAwithCtx())
      .addService(new TxBwithCtx(true))
      .addService(new TxCwithCtx());

    // Compensation transactions are automatically executed when B fails to execute
    await tm2.execute();
  });
});