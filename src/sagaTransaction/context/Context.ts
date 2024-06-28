// Context
class Context {
  private sharedVariable: Record<string, unknown> = {};

  setVariable(key: string, value: unknown): void {
    this.sharedVariable[key] = value;
  }

  getVariable(key: string): unknown {
    return this.sharedVariable[key];
  }
}

export default Context;
