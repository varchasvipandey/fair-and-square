const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 650,
  physics: {
    default: "arcade"
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

var game = new Phaser.Game(config);

var cursors;
var pc;
var ball;
var scorePC = 0;
var scorePlayer = 0;

var velocityX = Phaser.Math.Between(-100, 100);
var velocityY = 100;

function preload() {
  this.load.image("ground", "/assets/dragonpong/background.png");
  this.load.image("player", "/assets/dragonpong/paddle2.png");
  this.load.image("pc", "/assets/dragonpong/paddle1.png");
  this.load.image("ball", "/assets/dragonpong/ball.png");
  this.load.audio("backgroundmusic", [
    "/assets/dragonpong/background_track.mp3"
  ]);
  this.load.audio("hitwall", ["/assets/dragonpong/ball_hit_bounds.mp3"]);
  this.load.audio("hitpaddle", ["/assets/dragonpong/strike.mp3"]);
  this.load.audio("ballmiss", ["/assets/dragonpong/ball_miss.mp3"]);

  //winner images
  this.load.image("drag1", "/assets/dragonpong/drag1.png");
  this.load.image("drag2", "/assets/dragonpong/drag2.png");
}

function create() {
  //background
  this.add.image(640, 325, "ground");
  backgroundMusic = this.sound.add("backgroundmusic", { loop: "true" });
  backgroundMusic.play();
  backgroundMusic.volume = 0.8;

  //Other sounds
  ballHitBound = this.sound.add("hitwall");
  ballHitBound.volume = 0.8;
  strike = this.sound.add("hitpaddle");
  strike.volume = 0.8;
  ballmiss = this.sound.add("ballmiss");
  ballmiss.volume = 1;

  //keyboard access (for directional keys for player-1)
  cursor = this.input.keyboard.createCursorKeys();
  console.log(cursor);

  //other keys (W, S) for player-2 (AI/PC)
  this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
  this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);

  //player
  player = this.physics.add.sprite(1260, 325, "player");
  player.setCollideWorldBounds(true);

  //AI player
  pc = this.physics.add.sprite(20, 325, "pc");
  pc.setCollideWorldBounds(true);

  //Ball
  ball = this.physics.add.sprite(640, 300, "ball");
  ball.setCollideWorldBounds(true);
  ball.setBounce(1);

  //Ball movement
  ball.setVelocityY(velocityY);
  ball.setVelocityX(velocityX);

  //collision
  this.physics.add.collider(ball, player, hitPlayer, null, this);
  this.physics.add.collider(ball, pc, hitPc, null, this);

  //scoreboard
  scoreTextpc = this.add.text(26, 16, "0", {
    fontSize: "40px",
    fill: "#00FF00"
  });
  scoreTextPlayer = this.add.text(1190, 16, "0", {
    fontSize: "40px",
    fill: "#FFF"
  });

  //winner image test
}

function update() {
  //player-1 controls
  if (cursor.up.isDown) {
    player.setVelocityY(-250);
  } else if (cursor.down.isDown) {
    player.setVelocityY(250);
  } else {
    player.setVelocityY(0);
  }

  //player-2 controls || AI/PC
  if (this.keyW.isDown) {
    pc.setVelocityY(-250);
  } else if (this.keyS.isDown) {
    pc.setVelocityY(250);
  } else {
    pc.setVelocityY(0);
  }

  //scoreupdater
  if (ball.x == 1265) {
    ballmiss.play();
    scorePC += 1;
    scoreTextpc.setText(scorePC);
    reset();
    setTimeout(() => {
      if (scorePC == 2) {
        this.add.image(660, 250, "drag1");
        playerWins = this.add.text(510, 400, "Player 1 Wins", {
          fontSize: "50px",
          fill: "#00FF00",
          fontFamily: "Arial"
        });
        scorePC = 0;
        scoreTextpc.setText(scorePC);
        scorePlayer = 0;
        scoreTextPlayer.setText(scorePlayer);
        backgroundMusic.rate = 0.5;
        setTimeout(() => {
          window.location.replace("/game2");
        }, 5000);
      }
    }, 500);
  }
  if (ball.x == 15) {
    ballmiss.play();
    scorePlayer += 1;
    scoreTextPlayer.setText(scorePlayer);
    reset();
    setTimeout(() => {
      if (scorePlayer == 2) {
        this.add.image(660, 250, "drag2");
        playerWins = this.add.text(510, 400, "Player 2 Wins", {
          fontSize: "50px",
          fill: "#FFF",
          fontFamily: "Arial"
        });
        scorePC = 0;
        scoreTextpc.setText(scorePC);
        scorePlayer = 0;
        scoreTextPlayer.setText(scorePlayer);
        backgroundMusic.rate = 0.5;
        setTimeout(() => {
          window.location.replace("./end.html");
        }, 5000);
      }
    }, 500);
  }

  //ball hit walls of y axis
  if (ball.y == 15 || ball.y == 635) {
    ballHitBound.play();
  }
}

//player to ball collision effect
function hitPlayer(ball, player) {
  strike.play();
  velocityX = velocityX + 150;
  velocityX = velocityX * -1;
  console.log(velocityX);
  ball.setVelocityX(velocityX);

  if (velocityY < 0) {
    velocityY = velocityY * -1;
    ball.setVelocityY(velocityY);
  }
  player.setVelocityX(-1);
}

//player-2 or pc to ball collisioon effect
function hitPc(ball, pc) {
  strike.play();
  velocityX = velocityX - 150;
  velocityX = velocityX * -1;
  console.log(velocityX);
  ball.setVelocityX(velocityX);

  if (velocityY < 0) {
    velocityY = velocityY * -1;
    ball.setVelocityY(velocityY);
  }
  pc.setVelocityX(1);
}

//reset when ball hits protecting bounds
function reset() {
  velocityX = Phaser.Math.Between(-100, 100);
  velocityX = 100;
  ball.x = 640;
  ball.y = 300;
  player.x = 1260;
  player.y = 325;
  pc.x = 20;
  pc.y = 325;
  ball.setVelocityX(velocityX);
  ball.setVelocityY(velocityY);
}
