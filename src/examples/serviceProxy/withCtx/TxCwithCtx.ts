import { SagaServiceWithContext } from '../../..';

export class TxCwithCtx extends SagaServiceWithContext {
  constructor() {
    super();
  }

  execute = async (): Promise<unknown> => {
    console.log('execute C');

    // get ctx
    console.log('[GET VALUE]: ' + this.context?.getVariable('A'));
    console.log('[GET VALUE]: ' + this.context?.getVariable('B'));

    return;
  };

  compensate = async (): Promise<unknown> => {
    console.log('compensate C');
    return;
  };
}