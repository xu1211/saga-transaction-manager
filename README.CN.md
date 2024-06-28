[English](./README.md)
[中文](./README.CN.md)

# 简介
saga-transaction-manager 一个Saga模式的分布式事务框架,可以简单的处理分布式事务

## Saga事务模式介绍 
Saga = Long Live Transaction (LLT)
- 论文
https://www.cs.cornell.edu/andru/cs711/2002fa/reading/sagas.pdf
![Saga pattern](./resource/saga.png)


- 核心思想

将一个长事务拆分成多个本地事务,每个本地事务都有一个与之对应的补偿事务。当一个长事务执行失败时,会沿着事务执行的相反方向执行这些补偿事务,以便回滚整个长事务。

- 适用场景

业务流程长、业务流程多
参与者包含其它公司或遗留系统服务
需要保证事务最终一致性

- 实现方法

有两种常见的 Saga 实现方法，即协调和编排, 本项目是Saga编排模式

  1. Choreography 协调

每个本地事务都会发布在其他服务中触发本地事务的域事件,责任在各个 Saga 参与者之间进行分配。
每个服务都是独立的，都有自己的业务逻辑，需要确保是否继续下一个流程。

  2. Orchestration 编排

Saga 编排器处理所有事务，并告知参与者根据事件执行哪项操作
实现简单

# 快速开始

运行示例

在 `examples/serviceProxy` 目录:


1. 实现 `ISagaTransactionService` 接口 本地事务\补偿事务
```typescript
import { ISagaTransactionService } from 'saga-transaction-manager';

// 实现短事务
class CreateUserTransaction implements ISagaTransactionService {
  execute() {
    // 创建用户的业务逻辑
    return Promise.resolve();
  }
  compensate() {
    // 回滚用户创建操作的业务逻辑
    return Promise.resolve();
  }
}
class UpdateProfileTransaction implements ISagaTransactionService {
  ...
}
class SendWelcomeEmailTransaction implements ISagaTransactionService {
  ...
}
```
2. 使用 `TmSequentialExecution` 编排事务
```typescript
import { TmSequentialExecution } from 'saga-transaction-manager';

// 编排长事务
const transactionManager = new TmSequentialExecution();
transactionManager.addTransaction(new CreateUserTransaction());
transactionManager.addTransaction(new UpdateProfileTransaction());
transactionManager.addTransaction(new SendWelcomeEmailTransaction());

// 执行长事务, 失败会自动执行补偿事务
transactionManager.execute();
```

---

- 带上下文的编排器

对于需要存储公共变量的长事务,可以使用 `SagaServiceWithContext` abstract 与 `TmSequentialExecutionWithContext` 编排事务
```typescript
import { SagaServiceWithContext } from 'saga-transaction-manager';

class CreateUserTransaction extends SagaServiceWithContext {
  execute() {
    this.context?.setVariable('A', 'valueA');
  }
  compensate() {
    this.context?.getVariable('A')
  }
}
```
```typescript
import { TmSequentialExecutionWithContext } from 'saga-transaction-manager';

// 编排长事务
const transactionManagerWithCtx = new TmSequentialExecutionWithContext();
transactionManagerWithCtx.addTransaction(new CreateUserTransaction());
transactionManagerWithCtx.addTransaction(new UpdateProfileTransaction());
transactionManagerWithCtx.addTransaction(new SendWelcomeEmailTransaction());

// 执行长事务, 失败会自动执行补偿事务
transactionManagerWithCtx.execute();
```
## 缺陷
1. 不能保证隔离性
2. 无悬挂控制: 原服务超时,补偿服务执行,原服务到达

- 实现建议
服务与补偿服务保证幂等

## todo
1. actor模型重试机制
2. 注解实现saga
```
service1(){}

@SagaCompensiable(method='service1')
compensiteFunction(){}

@SagaTransactional
process(){
  service1()
  service2()
}
```
3. 支持使用消息队列存储编排信息
4. 状态机引擎实现saga, 编排器可扩展
