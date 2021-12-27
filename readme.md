## 介绍

这是一个试验项目，主要是学习下如何实现 ioc 模式

```
npm run start
```

## 使用

### 属性注入

```
@Injectable()
class User {
  name = randomName(["tom", "jerry", "jack"]);
  constructor() {}

  report() {
    logger(colors().red().padding(3, 5).log(`i am ${this.name}`));
  }
}

@Injectable()
@Resolve()
class Dog {
  name = randomName(["dog1", "dog2", "dog3"]);
  @Inject(User)
  public master?: User;
  constructor() {}

  report() {
    logger(colors().green().padding(3, 5).log(`this is dog ${this.name}`));
    logger(colors().green().padding(3, 5).log(`dog's master is ${this.master?.name}`));
  }
}

@Resolve()
class Home {
  name = randomName(["home1", "home2", "home3"]);
  @Inject(User)
  public user?: User;

  @Inject(Dog)
  public dog?: Dog;
  constructor() {
    console.log("home created");
  }

  report() {
    logger(colors().blueBg().white().padding(3, 5).log("report home"));
    logger(colors().blue().padding(3, 5).log(`this is home ${this.name}`));
    logger(colors().redBg().white().padding(3, 5).log("report user"));
    this.user?.report();
    logger(colors().greenBg().white().padding(3, 5).log("report dog"));
    this.dog?.report();
  }
}
```

### 构造参数注入

```
@Resolve()
class Home {
  name = randomName(["home1", "home2", "home3"]);
  constructor(@Inject(User) public user?: User, @Inject(Dog) public dog?: Dog) {
    console.log("home created");
  }

  report() {
    logger(colors().blueBg().white().padding(3, 5).log("report home"));
    logger(colors().blue().padding(3, 5).log(`this is home ${this.name}`));
    logger(colors().redBg().white().padding(3, 5).log("report user"));
    this.user?.report();
    logger(colors().greenBg().white().padding(3, 5).log("report dog"));
    this.dog?.report();
  }
}
```

## 待实现

- [x] 属性注入
- [x] 参数注入
- [] container 管理
- [] scope
- [] 依赖管理
- [] 循环依赖
- [] 注入参数
- [] ts 类型
