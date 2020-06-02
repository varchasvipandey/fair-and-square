const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 650,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const currentHighScore = parseInt(localStorage.getItem("currentHighScore"));

var gameOver = false;

let backgroundMusic;
let scoreSound;
let jumpSound;
let levelupSound;

let platforms;
let player;
let stars;
let cursors;
let bombs;
let score = 0;
let scoreText;
let leveluptext;
let levelCounter = 0;
let currentLevel;

let currentTime = new Date();
let currentHours = currentTime.getHours();

game = new Phaser.Game(config);

function preload() {
  if (currentHours >= 4 && currentHours <= 18) {
    this.load.image("sky", "/assets/flstudio/morning-background.png");
  } else {
    this.load.image("sky", "/assets/flstudio/night-background.png");
  }

  this.load.image("ground", "/assets/flstudio/platform.png");
  this.load.image("star", "/assets/flstudio/star.png");
  this.load.image("bomb", "/assets/flstudio/bomb.png");
  this.load.spritesheet("dude", "/assets/flstudio/dude.png", {
    frameWidth: 32,
    frameHeight: 48
  });

  this.load.audio("backgroundmusic", ["/assets/flstudio/backgroundtrack.mp3"]);
  this.load.audio("scoresound", ["/assets/flstudio/scoresound.mp3"]);
  this.load.audio("jumpsound", ["/assets/flstudio/jumpsound.mp3"]);
  this.load.audio("levelupsound", ["/assets/flstudio/levelupsound.mp3"]);

  this.load.image("endscreen", "/assets/flstudio/intro.jpg");

  //new ground
  this.load.image("groundTwo", "/assets/flstudio/_platform.png");
}

function create() {
  //SoundEffects
  backgroundMusic = this.sound.add("backgroundmusic", { loop: "true" });
  backgroundMusic.play();
  backgroundMusic.volume = 0.8;

  scoreSound = this.sound.add("scoresound");
  scoreSound.volume = 1;

  jumpSound = this.sound.add("jumpsound");
  jumpSound.volume = 0.5;

  levelupSound = this.sound.add("levelupsound");
  levelupSound.volume = 0.6;

  //platforms
  this.add.image(640, 322, "sky");

  platforms = this.physics.add.staticGroup();
  platformsTwo = this.physics.add.staticGroup();

  platforms.create(637, 630, "ground").refreshBody();

  platformsTwo.create(90, 460, "groundTwo");
  platforms.create(1620, 250, "ground");
  platformsTwo.create(600, 300, "groundTwo");
  platformsTwo.create(60, 150, "groundTwo");

  //Player
  player = this.physics.add.sprite(100, 450, "dude");
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

  //Player animations
  this.anims.create({
    key: "left",
    frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  });
  this.anims.create({
    key: "turn",
    frames: [{ key: "dude", frame: 4 }],
    frameRate: 20
  });
  this.anims.create({
    key: "right",
    frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1
  });

  //Enable cursor controls
  cursors = this.input.keyboard.createCursorKeys();

  //Stars
  stars = this.physics.add.group({
    key: "star",
    repeat: 17,
    setXY: { x: 12, y: 0, stepX: 70 }
  });
  stars.children.iterate(function(child) {
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
  });

  //Bombs
  bombs = this.physics.add.group();

  //Collisions
  this.physics.add.collider(player, platforms);
  this.physics.add.collider(stars, platforms);
  this.physics.add.collider(bombs, platforms);
  this.physics.add.collider(player, platformsTwo);
  this.physics.add.collider(stars, platformsTwo);
  this.physics.add.collider(bombs, platformsTwo);

  //Overlapping
  this.physics.add.overlap(player, stars, collectStar, null, this);
  this.physics.add.overlap(player, bombs, hitBomb, null, this);

  //score board
  scoreText = this.add.text(16, 16, "Score: 0", {
    fontSize: "2rem",
    fill: "#fff"
  });
  leveluptext = this.add.text(445, 250, "", { fontSize: "4rem", fill: "#fff" });
  currentLevel = this.add.text(1050, 16, "", {
    fontSize: "2rem",
    fill: "#fff"
  });

  //systemcontrols
  this.key_M = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
}

function update() {
  //movements
  if (cursors.left.isDown) {
    player.setVelocityX(-260);
    player.anims.play("left", true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(260);
    player.anims.play("right", true);
  } else {
    player.setVelocityX(0);
    player.anims.play("turn");
  }

  //jumping is defined seperately in order to avoid interfernce of up key with left or right
  if (cursors.up.isDown && player.body.touching.down) {
    jumpSound.play();
    player.setVelocityY(-330);
  } else if (cursors.down.isDown) {
    player.setVelocityY(330);
  }

  //mute audio
  if (this.key_M.isDown) {
    puaseSound();
    if (x) {
      backgroundMusic.play();
    }
  }
}

//Collect star, increase score and generate bomb
function collectStar(player, star) {
  star.disableBody(true, true);
  scoreSound.play();
  score += 10;
  scoreText.setText("Score: " + score);

  if (stars.countActive(true) === 0) {
    levelupSound.play();
    levelCounter++;
    setTimeout(lvl => {
      leveluptext.setText("LEVEL " + levelCounter);
      currentLevel.setText("Level - " + levelCounter);
      setTimeout(() => {
        leveluptext.setText("");
      }, 3000);
    }, 1000);

    leveluptext.setText("");

    stars.children.iterate(function(child) {
      child.enableBody(true, child.x, 0, true, true);
    });

    var x =
      player.x < 400
        ? Phaser.Math.Between(400, 800)
        : Phaser.Math.Between(0, 400);

    var bomb = bombs.create(x, 16, "bomb");
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
  }
}

//Collide with bomb and die
function hitBomb(player, bomb) {
  this.physics.pause();
  player.setTint(0xff0000);
  player.anims.play("turn");
  gameOver = true;
  gameOverLoad(gameOver);
  gameOverSounds();
  leveluptext.setText("Game Over");
  compareScore(score);
  sendScore(score);
}

function gameOverSounds() {
  backgroundMusic.rate = 0.5;
  setInterval(() => {
    backgroundMusic.stop();
  }, 10000);
}

function gameOverLoad(gameOver) {
  setTimeout(() => {
    if (gameOver == true) {
      //window.location.replace("./end.html");Launch a modal
    }
  }, 10000);
}

//play pause sound
function puaseSound() {
  x = backgroundMusic.pause();
}

//send score as ajax
function compareScore(score) {
  if (score > currentHighScore) {
    alert("NEW HIGH SCORE");
    localStorage.setItem("currentHighScore", score);
    sendScore(score);
  }
  return;
}

function sendScore(score) {
  const data = {
    name: localStorage.getItem("name"),
    token: localStorage.getItem("token"),
    score
  };
  axios
    .patch("/users/score", data)
    .then(response => console.log("Score sent", response))
    .catch(error => console.log(error));
}
