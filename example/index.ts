import { Inject, Injectable, Resolve } from "../src/index";
import { colors, logger } from "colors-web";
function randomName(names: string[]) {
  return names[Math.floor(Math.random() * names.length)];
}
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

const home = new Home();
console.log(home.report());
