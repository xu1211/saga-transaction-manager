import { SagaServiceWithContext } from '../../..';

export class TxBwithCtx extends SagaServiceWithContext {
  protected error: boolean | undefined
  constructor(error?: boolean) {
    super();
    this.error = error
  }

  execute = async (): Promise<unknown> => {
    if (this.error) {
      throw new Error('B error')
    }

    console.log('execute B');

    // get ctx
    console.log('[GET VALUE]: ' + this.context?.getVariable('A'));

    // set ctx
    this.context?.setVariable('B', 'value from TxB');

    return;
  };

  compensate = async (): Promise<unknown> => {
    console.log('compensate B');
    return;
  };
}