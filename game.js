import chalk from "chalk";
import readlineSync from "readline-sync";

class Player {
  constructor() {
    this.hp = 300;
    this.minatk = 15;
    this.maxatk = 0.9;
    this.run = 35;
    this.doubleatks = 20;
    this.defense = 35;
  }

  attack() {
    return Math.round(Math.random() * (this.minatk * this.maxatk) + this.minatk);
  }

  runs() {
    return Math.random() * 100 < this.run;
  }

  double() {
    return Math.random() * 100 < this.doubleatks;
  }

  defenses() {
    return Math.random() * 100 < this.defense;
  }

  Stageclear() {
    this.hp += 50;
    this.minatk += 5;
    this.maxatk += 0.2;
    this.run += 3;
    this.doubleatks += 5;
    this.defense += 3;
  }
}

class Monster {
  constructor(stage) {
    this.hp = 100 + stage * 50;
    this.monsterminatk = 8 + stage * 5;
    this.monstermaxatk = 0.4 + stage * 0.3;
    this.monsterdoubles = 17 + stage * 3;
  }

  attack() {
    return Math.round(
      Math.random() * (this.monsterminatk * this.monstermaxatk) + this.monsterminatk
    );
  }
  monsterdouble() {
    return Math.random() * 100 < this.monsterdoubles;
  }
}

function displayStatus(stage, player, monster) {
  console.log(chalk.magentaBright(`\n=== Current Status ===`));
  console.log(
    chalk.cyanBright(`| Stage: ${stage} `) +
      chalk.blueBright(
        `| 플레이어 HP: ${player.hp} | 최소뎀 ~ 최대뎀 : ${player.minatk} ~ ${player.maxatk}% |`
      ) +
      chalk.redBright(
        `| 몬스터 HP: ${monster.hp} | 최소뎀 ~ 최대뎀 : ${monster.monsterminatk} ~ ${monster.monstermaxatk}% | 강력한 공격: ${monster.monsterdoubles}%`
      )
  );
  console.log(chalk.magentaBright(`=====================\n`));
}

const battle = async (stage, player, monster) => {
  let logs = [];

  while (player.hp > 0 && stage <= 10) {
    console.clear();
    displayStatus(stage, player, monster);

    logs.forEach((log) => console.log(log));

    console.log(
      chalk.green(
        `\n1. 공격한다 2. 더블 어택 ${player.doubleatks}% 3. 도망간다. ${player.run}% 4. 방어 ${player.defense}%`
      )
    );
    const choice = readlineSync.question("당신의 선택은? ");

    // 플레이어의 선택에 따라 다음 행동 처리
    let playerdmg = player.attack();
    let doubleatk = player.double();
    let monsterdmg = monster.attack();

    switch (choice) {
      case "1":
        monster.hp -= playerdmg;
        logs.push(chalk.green(`Player가 몬스터에게 ${playerdmg}의 피해를 입혔습니다.`));
        break;

      case "2":
        monster.hp -= playerdmg;
        logs.push(chalk.green(`Player가 몬스터에게 ${playerdmg}의 피해를 입혔습니다.`));

        if (doubleatk) {
          monster.hp -= playerdmg;
          logs.push(
            chalk.green(`Player가 더블어택에 성공해 ${playerdmg}의 추가 피해를 입혔습니다.`)
          );
        } else {
          logs.push(chalk.blue(`Player가 더블어택 공격에 실패했습니다.`));
        }
        break;

      case "3":
        if (player.runs()) {
          logs.push(chalk.yellow(`Player가 도망치는데 성공하였습니다. 스테이지를 넘어갑니다.`));
          return;
        } else {
          logs.push(chalk.blue(`Player가 도망가는데 실패하였습니다.`));
          break;
        }
      case "4":
        if (player.defenses()) {
          logs.push(chalk.yellow(`Player가 방어에 성공해 피해를 받지 않습니다.`));
          monsterdmg = 0;
        } else {
          logs.push(chalk.red(`Player가 방어에 실패합니다 몬스터에게 피해를 받습니다.`));
          break;
        }
    }
    if (monster.hp > 0) {
      player.hp -= monsterdmg;
      logs.push(chalk.red(`몬스터가 Player에게 ${monsterdmg}의 피해를 입혔습니다.`));

      if (monster.monsterdouble()) {
        player.hp -= monsterdmg;
        logs.push(
          chalk.red(`몬스터가 강력한 공격에 성공해 ${monsterdmg}의 추가 피해를 입혔습니다.`)
        );
      } else {
        logs.push(chalk.blue(`몬스터가 강력한 공격에 실패했습니다.`));
      }
    }

    if (player.hp <= 0) {
      logs.push(chalk.red(`Player가 패배했습니다!`));
      console.clear();
      displayStatus(stage, player, monster);
      logs.forEach((log) => console.log(log));
      break;
    }

    if (monster.hp <= 0) {
      logs.push(chalk.red(`몬스터를 처치하였습니다. 스테이지${stage}을 클리어 하셨습니다.`));
      logs.forEach((log) => console.log(log));
      break;
    }
  }
};

export async function startGame() {
  console.clear();
  const player = new Player();
  let stage = 1;

  while (stage <= 10) {
    const monster = new Monster(stage);
    await battle(stage, player, monster);

    if (player.hp > 0) {
      player.Stageclear();
      player.hp = Math.min(player.hp + 80, 1000);
      console.log(chalk.green(`스테이지 ${stage} 클리어! 게임이 종료됩니다!`));
      stage++;
    } else {
      console.log(chalk.red(`게임 오버!`));
      break;
    }
  }
}
