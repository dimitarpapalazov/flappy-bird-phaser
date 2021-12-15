var state = new Phaser.State();
state.preload = preload;
state.create = create;
state.update = update;

var game = new Phaser.Game(320, 480, Phaser.AUTO, "", state);

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

function preload() {
  game.load.image("background", "./assets/background.png");
  game.load.image("ground", "./assets/ground.png");
  game.load.image("bird", "./assets/flappy-bird.png");
  game.load.image("pipe", "./assets/pipe.png");
  game.load.image("invertedPipe", "./assets/pipeInverted.png");
}

function create() {
  started = false;
  score = 0;

  game.add.tileSprite(0, 0, max, 480, "background");
  game.world.setBounds(0, 0, max, 480);

  lastPipeX = 300;
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
  playerDead = false;
  game.physics.arcade.enable(player);

  game.camera.follow(player);

  keyboard = {};
  keyboard.up = game.input.keyboard.addKey(Phaser.KeyCode.UP);
  keyboard.r = game.input.keyboard.addKey(Phaser.KeyCode.R);
  keyboard.up.onDown.add(jump, game.state);
  keyboard.r.onDown.add(game.state.restart, game.state);

  text = game.add.text(160, 0, "Press UP to start!", {
    fontSize: "32px",
    fill: "#FFF",
    strokeThickness: 3,
  });
  text.anchor.set(0.5, 0);
  text.fixedToCamera = true;

  scoreText = game.add.text(
    320 / 2,
    game.world.height - 63 / 1.75,
    "Score: 0",
    {
      fontSize: "32px",
      fill: "#FFF",
      strokeThickness: 3,
    }
  );
  scoreText.anchor.set(0.5);
  scoreText.fixedToCamera = true;

  restartText = game.add.text(320 / 2, 0, "", {
    fontSize: "24px",
    fill: "#FFF",
    strokeThickness: 3,
  });
  restartText.anchor.set(0.5, 0);
  restartText.fixedToCamera = true;

  highscoreText = game.add.text(
    320 / 2,
    game.world.height - 12,
    "Highcore: " + highscore,
    {
      fontSize: "20px",
      fill: "#FFF",
      strokeThickness: 3,
    }
  );
  highscoreText.fixedToCamera = true;
  highscoreText.anchor.set(0.5);
}

function update() {
  if (player.angle < 30 && started && !playerDead) player.angle++;

  game.physics.arcade.overlap(player, pipes, playerDies);
  game.physics.arcade.overlap(player, ground, playerDies);

  if (pipes.getAt(score).centerX <= player.centerX) {
    score += 2;
    scoreText.text = "Score: " + score / 2;
  }
}

function jump() {
  if (!playerDead) {
    player.body.velocity.y = -150;

    if (player.angle > -30) player.angle = -30;

    if (!started) {
      started = !started;
      player.body.gravity.y = 300;
      player.body.velocity.x = 75;
      text.text = "";
    }
  }
}

function createPipes() {
  pipes = game.add.group();
  pipes.enableBody = true;

  for (let i = 0; i < max; i += 200) {
    let pipe = pipes.create(
      lastPipeX,
      (game.world.height - 263) * Math.random() - 676,
      "invertedPipe"
    );

    let invertedPipe = pipes.create(0, 0, "pipe");
    invertedPipe.centerX = pipe.centerX;
    invertedPipe.centerY = pipe.centerY + 850;

    lastPipeX += 200;
  }

  lastPipeX = 300;
}

function playerDies() {
  player.body.velocity.x = 0;
  player.body.velocity.y = 0;
  player.body.gravity.y = 0;
  playerDead = true;

  if (highscore < score) highscore = Math.floor(score / 2);

  restartText.text = "Press R to restart";
  restartText.centerX = player.centerX;
}
