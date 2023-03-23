var PLAY = 1;
var END = 0;
var gameState = PLAY;

var boy, boy_running, boy_collided;
var ground, invisibleGround, groundImage;

var alienGroup, alienImage;
var obstaclesGroup, zombie1, witch2, vampire3;
var score=0;
var jumpSound , checkPointSound, dieSound

var gameOverImg,restartImg


function preload(){
  boy_running = loadAnimation("boy_running1.png","boy_running2.png");
  boy_collided = loadAnimation("boy_collided.png");

  groundImage = loadImage("ground.png");

  alienImage = loadImage("space_ship.png");

  zombie1 = loadImage("zombie_1.png");
  witch2 = loadImage("witch_2.png");
  vampire3 = loadImage("vampire_3.png");

  restartImg = loadImage("restart.png");
  gameOverImg = loadImage("game_over.png");

  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(windowWidth,windowHeight);

  boy = createSprite(50,70,20,50);

  boy.addAnimation('running', boy_running);
  boy.addAnimation('collided', boy_collided);
  boy.setCollider('circle',0,0,350);

  invisibleGround = createSprite(width/2,height-10,width,125);  
  invisibleGround.shapeColor = "#f4cbaa";

  ground = createSprite(width/2,height,width,2);
  ground.addImage("ground",groundImage);
  ground.x = width/2
  ground.velocityX = -(6 + 3*score/100);

  gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;

  alienGroup = new Group();
  obstaclesGroup = new Group();

  score = 0;
}

function draw() {
  textSize(20);
  fill("black")
  text("Score: "+ score,30,50);

  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
    
    if((touches.length > 0 || keyDown("SPACE")) && boy.y  >= height-120) {
      jumpSound.play( )
      boy.velocityY = -10;
       touches = [];
    }

    boy.velocityY = boy.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    boy.collide(invisibleGround);
    spawnAliens();
    spawnObstacles();

    if(obstaclesGroup.isTouching(boy)){
      collidedSound.play()
      gameState = END;
  }
}
else if (gameState === END) {
  gameOver.visible = true;
  restart.visible = true;
  
   ground.velocityX = 0;
   boy.velocityY = 0;
   obstaclesGroup.setVelocityXEach(0);
   alienGroup.setVelocityXEach(0);
   
   boy.changeAnimation("collided",boy_collided);
   
   obstaclesGroup.setLifetimeEach(-1);
   alienGroup.setLifetimeEach(-1);
   
   if(touches.length>0 || keyDown("SPACE") || mousePressedOver(restart)) {      
     reset();
     touches = []
   }
 }


 drawSprites();
}

function spawnAliens() {
  if (frameCount % 60 === 0) {
    var alien = createSprite(width+20,height-300,40,10);
    alien.y = Math.round(random(100,220));
    alien.addImage(alienImage);
    alien.scale = 0.5;
    alien.velocityX = -3;
    
    alien.lifetime = 300;
    
    alien.depth = boy.depth;
    boy.depth = boy.depth+1;
    
    //add each cloud to the group
    alienGroup.add(alien);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,height-95,20,30);
    obstacle.setCollider('circle',0,0,45)
    // obstacle.debug = true
  
    obstacle.velocityX = -(6 + 3*score/100);
    
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addImage(zombie1);
              break;
      case 2: obstacle.addImage(witch2);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.3;
    obstacle.lifetime = 300;
    obstacle.depth = boy.depth;
    boy.depth +=1;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  alienGroup.destroyEach();
  
  boy.changeAnimation("running",trex_running);
  
  score = 0;
  
}

