import 'reflect-metadata';

import { TmSequentialExecution } from '../../..';
import { TxA } from './TxA';
import { TxB } from './TxB';
import { TxC } from './TxC';

describe('TmSequentialExecution', () => {

  it('should execute transactions in sequence', async () => {
    const tm1 = new TmSequentialExecution()
      .addService(new TxA())
      .addService(new TxB())
      .addService(new TxC());

    await tm1.execute();
  });

  it('should compensate transactions in reverse order', async () => {
    const tm2 = new TmSequentialExecution()
      .addService(new TxA())
      .addService(new TxB(true))
      .addService(new TxC());

    // Compensation transactions are automatically executed when B fails to execute
    await tm2.execute();
  });
});