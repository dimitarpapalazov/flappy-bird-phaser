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
let lastPipeX = 300;
let ground;
const max = 100000;
let started = false;
let score = 0;
let scoreText;
let text;
let restartText;
let playerDead = false;

const create = () => {
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
  scoreText.centerY = game.world.height - 63 / 2;
  restartText = game.add.text(0, 0, "", {
    fontSize: "24px",
    fill: "#FFF",
    strokeThickness: 3,
  });
};

const update = () => {
  scoreText.text = "Score: " + score / 2;
  if (scoreText.centerX < player.centerX) scoreText.centerX = player.centerX;
  if (keyboard.up.isDown) {
    player.body.velocity.y = -150;
    if (!started) {
      started != started;
      player.body.gravity.y = 300;
      player.body.velocity.x = 75;
      text.text = "";
    }
  }
  game.physics.arcade.overlap(player, pipes, bpCollide);
  game.physics.arcade.overlap(player, ground, playerDies);
  if (pipes.getAt(score).centerX <= player.centerX) {
    score += 2;
  }
  if (playerDead) {
    restartText.text = "Press R to restart";
    restartText.centerX = player.centerX;
    if (keyboard.r.isDown) {
      restart();
    }
  }
};

function createPipes() {
  pipes = game.add.group();
  pipes.enableBody = true;
  for (let i = 0; i < max; i += 200) {
    let pipe = pipes.create(
      lastPipeX,
      (game.world.height - 163) * Math.random() - 776,
      "invertedPipe"
    );
    lastPipeX += 175;
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

function restart() {
  text.text = "Press UP to start!";
  text.centerX = 160;
  player.centerY = game.world.centerY;
  player.centerX = 0;
  scoreText.text = "Score: 0";
  scoreText.centerX = 320 / 2;
  scoreText.centerY = game.world.height - 63 / 2;
  restartText.text = "";
  playerDead = false;
  started = false;
  score = 0;
  pipes.removeChildren();
  createPipes();
  game.world.bringToTop(ground);
  game.world.bringToTop(restartText);
  game.world.bringToTop(scoreText);
}

var game = new Phaser.Game(320, 480, Phaser.AUTO, "", {
  preload: preload,
  create: create,
  update: update,
});
