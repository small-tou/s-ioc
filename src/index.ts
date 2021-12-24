import "reflect-metadata";
let moduleUniqId = 1;

function Injectable(options?: any) {
  return (target: any) => {
    const className = target.prototype.constructor.name;
    // 记录类的初始化参数，暂未使用
    Reflect.defineMetadata("scope:options", options, target);
    // 标记当前类为 injectable
    Reflect.defineMetadata("scope:injectable", true, target);

    // return Resolve()(target);
  };
}

function Inject(token: any) {
  return function (target: any, targetKey: string, indexOrPropertyDescriptor: any) {
    let injectedClasses = Reflect.getMetadata("scope:injectedClasses", target.constructor) || [];
    injectedClasses = [
      ...injectedClasses,
      {
        targetKey: targetKey,
        constructor: token.prototype.constructor,
      },
    ];
    // 将 token 作为目标类记录到当前类的 metadata 中
    Reflect.defineMetadata("scope:injectedClasses", injectedClasses, target.constructor);
  };
}

function Resolve(metadata?: { providers?: any[]; imports?: any[] }) {
  return (target: any) => {
    const moduleID = Reflect.getMetadata("scope:moduleID", target);
    // 如果 module 不是第一次被实例化，则直接返回
    if (moduleID) return target;
    // 否则标记 moduleID，并进行包装
    const newModuleID = moduleUniqId++;
    Reflect.defineMetadata("scope:moduleID", newModuleID, target);
    const targetContructor = target.prototype.constructor;
    return function () {
      // eslint-disable-next-line prefer-rest-params
      const instance = new targetContructor(...arguments);
      const injectedClasses = Reflect.getMetadata("scope:injectedClasses", targetContructor) || [];
      if (injectedClasses) {
        injectedClasses.forEach((e: { targetKey: string; constructor: { new (...args: any[]): any } }) => {
          const { targetKey, constructor } = e;
          // 检查类是否是 injectable 的，不是的话报错
          const injectableCheckMeta = Reflect.getMetadata("scope:injectable", constructor);
          if (!injectableCheckMeta) {
            throw new Error(`${constructor.name} is not injectable`);
          }
          const injectedInstance = new constructor(instance);
          console.log("inject success", injectedInstance);
          Object.assign(instance, { [targetKey]: injectedInstance });
        });
      }
      return instance;
    } as any;
  };
}
export { Injectable, Inject, Resolve };
