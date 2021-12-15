const preload = () => {
  game.load.image("background", "./assets/background.png");
  game.load.image("ground", "./assets/ground.png");
  game.load.image("bird", "./assets/flappy-bird.png");
  game.load.image("pipe", "./assets/pipe.png");
  game.load.image("invertedPipe", "./assets/pipeInverted.png");
};

let player;
let keyboard;
let pipes;
let lastPipeX;
let ground;
const max = 100000;
let started;
let score;
let scoreText;
let text;
let restartText;
let playerDead;
let highscore = 0;
let highscoreText;

const create = () => {
  lastPipeX = 300;
  started = false;
  playerDead = false;
  score = 0;
  game.add.tileSprite(0, 0, max, 480, "background");
  game.world.setBounds(0, 0, max, 480);
  createPipes();
  ground = game.add.tileSprite(
    0,
    game.world.height - 63,
    max,
    game.world.height - 63,
    "ground"
  );
  game.physics.arcade.enable(ground);
  player = game.add.sprite(0, 0, "bird");
  player.centerY = game.world.centerY;
  game.physics.arcade.enable(player);
  game.camera.follow(player);
  keyboard = game.input.keyboard.createCursorKeys();
  keyboard.r = game.input.keyboard.addKey(Phaser.KeyCode.R);
  text = game.add.text(0, 0, "Press UP to start!", {
    fontSize: "32px",
    fill: "#FFF",
    strokeThickness: 3,
  });
  text.centerX = 160;
  scoreText = game.add.text(0, 0, "Score: 0", {
    fontSize: "32px",
    fill: "#FFF",
    strokeThickness: 3,
  });
  scoreText.centerX = 320 / 2;
  scoreText.centerY = game.world.height - 63 / 1.75;
  restartText = game.add.text(0, 0, "", {
    fontSize: "24px",
    fill: "#FFF",
    strokeThickness: 3,
  });
  highscoreText = game.add.text(0, 0, "Highcore: " + highscore, {
    fontSize: "20px",
    fill: "#FFF",
    strokeThickness: 3,
  });
  highscoreText.centerX = 320 / 2;
  highscoreText.centerY = game.world.height - 12;
};

const update = () => {
  scoreText.text = "Score: " + score / 2;
  if (scoreText.centerX < player.centerX) scoreText.centerX = player.centerX;
  if (highscoreText.centerX < player.centerX)
    highscoreText.centerX = player.centerX;
  keyboard.up.onDown.add(() => {
    if (!playerDead) {
      player.body.velocity.y = -150;
      if (player.angle > -30) player.angle--;
      if (!started) {
        started = !started;
        player.body.gravity.y = 300;
        player.body.velocity.x = 75;
        text.text = "";
      }
    }
  });
  if (player.angle != 30 && started && !playerDead) player.angle++;
  game.physics.arcade.overlap(player, pipes, bpCollide);
  game.physics.arcade.overlap(player, ground, playerDies);
  if (pipes.getAt(score).centerX <= player.centerX) {
    score += 2;
  }
  if (playerDead) {
    if (highscore < score) highscore = Math.floor(score / 2);
    restartText.text = "Press R to restart";
    restartText.centerX = player.centerX;
    keyboard.r.onDown.add(() => {
      game.state.start(game.state.current);
    });
  }
};

function createPipes() {
  pipes = game.add.group();
  pipes.enableBody = true;
  for (let i = 0; i < max; i += 200) {
    let pipe = pipes.create(
      lastPipeX,
      (game.world.height - 263) * Math.random() - 676,
      "invertedPipe"
    );
    lastPipeX += 200;
    let invertedPipe = pipes.create(0, 0, "pipe");
    invertedPipe.centerX = pipe.centerX;
    invertedPipe.centerY = pipe.centerY + 850;
  }
  lastPipeX = 300;
}

function bpCollide() {
  let timer = game.time.create();
  timer.add(10, playerDies);
  timer.start();
}

function playerDies() {
  player.body.velocity.x = 0;
  player.body.velocity.y = 0;
  player.body.gravity.y = 0;
  playerDead = true;
}

var state = new Phaser.State();
state.preload = preload;
state.create = create;
state.update = update;

var game = new Phaser.Game(320, 480, Phaser.AUTO, "", state);
