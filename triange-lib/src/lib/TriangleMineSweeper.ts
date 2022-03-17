/*
  JS библиотека треугольного сапёра, Автор VADIMREX
  
  Реализован класс Triangle_minesweeper_lib в котором есть все необходимые методы
  чтобы реализовать игру
*/

export type FieldValue = 0  | 1  | 2  | 3  | 4  |5   | 6  | 7  | 8  | 9  | 10 | 11 | 12 | 13 |
                         16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 |
                         45 | 61 | 127;

export class Mine {
  x = 0;
  y = 0;
}

export class TriangleMinesweeperLib {
  private field: FieldValue[][] = [];
  private gameStatus = 0;
  private opened = 0;
  private remain = 0;
  private total = 0;
  private checked = 0;
  private heigh = 0;
  private width = 0;
  private mines: Mine[] = [];
  private checkmode: boolean = false;

  constructor() { };

  /**
   * стандартные 4 режима сложности: <br>
   * 0 - 11х11 и 10 мин              <br>
   * 1 - 18х18 и 40 мин              <br>
   * 2 - 20х40 и 100 мин             <br>
   * 3 - 50х50 и 500 мин             <br>
   */
  private modes = [[11, 11, 10], [18, 18, 40], [20, 40, 100], [50, 50, 500]] as const;

  SimpleConsoleView() {
    let c, s = '';
    for (let i = 0; i < this.field.length; i++) {
      c = '';
      for (let j = 0; j < this.field[i].length; j++) {
        switch (this.field[i][j]) {
          case 0: c = '  '; break;
          case 1: case 2: case 3:
          case 4: case 5: case 6:
          case 7: case 8: case 9: c = ' ' + this.field[i][j]; break;
          case 10: case 11: case 12: c = this.field[i][j]; break;
          case 13: c = ' *'; break;
          case 0x1D: c = ' X'; break;
          case 127: c = '##'; break;
        }
        s += c;
      }
      s += '\n';
    }
    return s;
  }

  /**
   * Выводит в консоль поле, подходит к ещё не раскрытому полю
   */
  SimpleConsoleViewNotOpen() {
    let c, s = '';
    for (let i = 0; i < this.field.length; i++) {
      c = "";
      for (let j = 0; j < this.field[i].length; j++) {
        switch (this.field[i][j]) {
          case 0x10: c = "  "; break;
          case 0x11: case 0x12: case 0x13:
          case 0x14: case 0x15: case 0x16:
          case 0x17: case 0x18: case 0x19: c = " " + (this.field[i][j] - 0x10); break;
          case 0x1A: c = " A"; break;
          case 0x1B: c = " B"; break;
          case 0x1C: c = " C"; break;//String.valueOf((char)(0xe291a00field[i][j])); break;
          case 0x1D: c = " X"; break;
          case 127: c = '&#9608;&#9608;'; break;
          default: c = "&#9617;&#9617;"; break;
        }
        s += c;
      }
      s += "\n";
    }
    return s;
  }

  /**
   * Создаёт поле в зависимости от параметров
   * @param a - высота поля
   * @param b - ширина поля
   * @param c - количество мин
   */
  GenerateFiled(a: number, b?: number, c?: number) {
    /**
     * Создаёт поле в зависимости от сложности
     * @param mode номер сложности в массиве {@link modes}
     * @throws Exception если такой сложности нет
     */
    if (b == undefined || c == undefined) {
      this.GenerateFiled(this.modes[a][0], this.modes[a][1], this.modes[a][2]);
      return;
    };

    this.opened = 0;
    this.remain = a * b - c;

    this.total = c;

    this.heigh = a;
    this.width = b;

    let i, j, dir;
    let m = 0;

    this.field = [];
    this.mines = [];

    for (i = 0; i < a + 2; i++) {
      this.field[i] = [];
      for (j = 0; j < b + 4; j++)this.field[i][j] = 0;
    }

    while (m < c) {
      let x = Math.floor(Math.random() * b + 2);
      let y = Math.floor(Math.random() * a + 1);
      if (13 == this.field[y][x]) continue;
      this.field[y][x] = 13;
      this.mines[m] = new Mine()
      this.mines[m].x = x;
      this.mines[m].y = y;
      m++;
    }
    for (i = 1; i < a + 1; i++)for (j = 2; j < b + 2; j++)if (13 == this.field[i][j]) {
      dir = (j % 2 + (i + 1) % 2) % 2;
      if (0 == dir) {
        if (this.field[i - 1][j - 2] < 13) this.field[i - 1][j - 2]++;
        if (this.field[i - 1][j - 1] < 13) this.field[i - 1][j - 1]++;
        if (this.field[i - 1][j] < 13) this.field[i - 1][j]++;
        if (this.field[i - 1][j + 1] < 13) this.field[i - 1][j + 1]++;
        if (this.field[i - 1][j + 2] < 13) this.field[i - 1][j + 2]++;

        if (this.field[i][j - 2] < 13) this.field[i][j - 2]++;
        if (this.field[i][j - 1] < 13) this.field[i][j - 1]++;
        if (this.field[i][j] < 13) this.field[i][j]++;
        if (this.field[i][j + 1] < 13) this.field[i][j + 1]++;
        if (this.field[i][j + 2] < 13) this.field[i][j + 2]++;

        if (this.field[i + 1][j - 1] < 13) this.field[i + 1][j - 1]++;
        if (this.field[i + 1][j] < 13) this.field[i + 1][j]++;
        if (this.field[i + 1][j + 1] < 13) this.field[i + 1][j + 1]++;
      }
      else {
        if (this.field[i - 1][j - 1] < 13) this.field[i - 1][j - 1]++;
        if (this.field[i - 1][j] < 13) this.field[i - 1][j]++;
        if (this.field[i - 1][j + 1] < 13) this.field[i - 1][j + 1]++;

        if (this.field[i][j - 2] < 13) this.field[i][j - 2]++;
        if (this.field[i][j - 1] < 13) this.field[i][j - 1]++;
        if (this.field[i][j] < 13) this.field[i][j]++;
        if (this.field[i][j + 1] < 13) this.field[i][j + 1]++;
        if (this.field[i][j + 2] < 13) this.field[i][j + 2]++;

        if (this.field[i + 1][j - 2] < 13) this.field[i + 1][j - 2]++;
        if (this.field[i + 1][j - 1] < 13) this.field[i + 1][j - 1]++;
        if (this.field[i + 1][j] < 13) this.field[i + 1][j]++;
        if (this.field[i + 1][j + 1] < 13) this.field[i + 1][j + 1]++;
        if (this.field[i + 1][j + 2] < 13) this.field[i + 1][j + 2]++;
      }
    }
    for (i = 0; i < b + 4; i++) {
      this.field[0][i] = 127;
      this.field[a + 1][i] = 127;
    }
    for (i = 1; i < a + 1; i++) {
      this.field[i][0] = 127;
      this.field[i][1] = 127;
      this.field[i][b + 2] = 127;
      this.field[i][b + 3] = 127;
    }
  };
  /**
   * Открыть поле
   * @param x 
   * @param y 
   */
  Open(x: number, y: number) {
    let dir = (x % 2 + (y + 1) % 2) % 2;
    switch (this.field[y][x]) {
      case 0:
        this.field[y][x] += 16;
        if (0 == dir) {
          this.Open(x - 2, y - 1);
          this.Open(x - 1, y - 1);
          this.Open(x, y - 1);
          this.Open(x + 1, y - 1);
          this.Open(x + 2, y - 1);

          this.Open(x - 2, y);
          this.Open(x - 1, y);
          this.Open(x, y);
          this.Open(x + 1, y);
          this.Open(x + 2, y);

          this.Open(x - 1, y + 1);
          this.Open(x, y + 1);
          this.Open(x + 1, y + 1);
        }
        else {
          this.Open(x - 1, y - 1);
          this.Open(x, y - 1);
          this.Open(x + 1, y - 1);

          this.Open(x - 2, y);
          this.Open(x - 1, y);
          this.Open(x, y);
          this.Open(x + 1, y);
          this.Open(x + 2, y);

          this.Open(x - 2, y + 1);
          this.Open(x - 1, y + 1);
          this.Open(x, y + 1);
          this.Open(x + 1, y + 1);
          this.Open(x + 2, y + 1);
        }
        this.opened++;
        break;
      case 1: case 2: case 3:
      case 4: case 5: case 6:
      case 7: case 8: case 9:
      case 10: case 11: case 12:
        this.field[y][x] += 16;
        this.opened++;
        break;
      case 13:
        this.field[y][x] += 16;
        this.OpenFail();
        this.gameStatus = 3;
        break;
    }
    if (this.opened == this.remain) {
      this.gameStatus = 2;
      this.OpenWin();
    }
  };

  GetTraingle(x: number, y: number) {
    let c;
    switch (this.field[y][x]) {
      case 0x10: c = ' '; break;
      case 0x11: case 0x12: case 0x13:
      case 0x14: case 0x15: case 0x16:
      case 0x17: case 0x18: case 0x19: c = "" + (this.field[y][x] - 0x10); break;
      case 0x1A: c = 'A'; break;
      case 0x1B: c = 'B'; break;
      case 0x1C: c = 'C'; break;
      case 0x1D: c = 'X'; break;
      case 0x2D: c = 'm'; break;
      case 0x3D: c = 'b'; break;
      case 0x7F: c = '#'; break;
      default:
        if (this.field[y][x] >= 0x50) c = '?';
        else if (this.field[y][x] >= 0x40) c = 'f';
        else c = '%';
        break;
    }
    return c;
  };
  /**
   * Получить массив в котором хранятся данные по полю
   * @return поле в виде массива из byte
   */
  get Field() { return this.field; };

  GameStart() { this.gameStatus = 1; };

  GameEnd() { this.gameStatus = 3; };

  get GameStatus() { return this.gameStatus; };

  get Opened() { return this.opened; };

  get Total() { return this.total; };

  get Checked() { return this.checked; };

  get Heigh() { return this.heigh; };

  get Width() { return this.width; };

  OpenFail() {
    let i;
    for (i = 0; i < this.mines.length; i++) {
      if (this.field[this.mines[i].y][this.mines[i].x] != 0x1D) {
        this.field[this.mines[i].y][this.mines[i].x] = 0x3D;
      }
    }
  };

  OpenWin() {
    for (let i = 0; i < this.mines.length; i++)this.field[this.mines[i].y][this.mines[i].x] = 0x2D;
  };

  SetFlag(x: number, y: number) {
    if (this.field[y][x] >= 0x60) return;
    else if (this.field[y][x] >= 0x50) this.field[y][x] -= 0x50;
    else if (this.field[y][x] >= 0x40) {
      if (this.checkmode) this.field[y][x] += 0x10;
      else this.field[y][x] -= 0x40;
      this.checked--;
    }
    else if (this.field[y][x] < 0x10) {
      this.field[y][x] += 0x40;
      this.checked++;
    }
  };

  SetUseQuestion(use: boolean) {
    this.checkmode = use;
  };
}

export function newEngine() {
  return new TriangleMinesweeperLib();
}

export default TriangleMinesweeperLib;