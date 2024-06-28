import { SagaServiceWithContext } from '../../../../src';

export class TxAwithCtx extends SagaServiceWithContext {
  constructor() {
    super();
  }

  execute = async (): Promise<unknown> => {
    console.log('execute A');

    // set ctx
    this.context?.setVariable('A', 'value from txA');

    return;
  };

  compensate = async (): Promise<unknown> => {
    console.log('compensate A');
    return;
  };
}