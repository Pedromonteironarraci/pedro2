class Game {
  constructor() {
    this.resetTitle = createElement ("h2");
    this.resetButton = createButton ("");

    this.leaderBoardTitle = createElement ("h2");
    this.leader1 = createElement ("h2");
    this.leader2 = createElement ("h2");

    this.playerMoving = false ;
this.leftKeyActive=false
  }

  getState() {
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function(data) {
      gameState = data.val();
    });
  }
  update(state) {
    database.ref("/").update({
      gameState: state
    });
  }

  start() {
    player = new Player();
    playerCount = player.getCount();

    form = new Form();
    form.display();

    car1 = createSprite(width / 2 - 50, height - 100);
    car1.addImage("car1", carimg1);
    car1.scale = 0.07;

    car2 = createSprite(width / 2 + 100, height - 100);
    car2.addImage("car2", carimg2);
    car2.scale = 0.07;

    cars = [car1, car2];

    fuels = new Group ();
    powerCoins = new Group ();
    obstacle1 = new Group ();
    obstacle2 = new Group ();

    var obstacle1Positions =[
      {x:width/2-150,y:height-1300,image:obstacleImg1},
      {x:width/2+250,y:height-1800,image:obstacleImg1},
      {x:width/2-180,y:height-3300,image:obstacleImg1},
      {x:width/2-150,y:height-4400,image:obstacleImg1},
      {x:width/2,y:height-5300,image:obstacleImg1},
    ]

    var obstacle2Positions =[
      {x:width/2+250,y:height-800,image:obstacleImg2},
      {x:width/2-180,y:height-2300,image:obstacleImg2},
      {x:width/2,y:height-2800,image:obstacleImg2},
      {x:width/2+180,y:height-3300,image:obstacleImg2},
      {x:width/2+250,y:height-3800,image:obstacleImg2},
      {x:width/2+250,y:height-4800,image:obstacleImg2},
      {x:width/2-180,y:height-5500,image:obstacleImg2},
    ]

   this.addSprites (fuels,4,fuelImage,0.02)
   this.addSprites (powerCoins,18,powerCoinsImg,0.09)
   this.addSprites (obstacle1,obstacle1Positions.length,obstacleImg1,0.04,obstacle1Positions)
   this.addSprites (obstacle2,obstacle2Positions.length,obstacleImg2,0.04,obstacle2Positions)
  }

  addSprites (spriteGroup,numberOfSprites,spriteImage,scale,positions =[]){
    for (let i = 0; i < numberOfSprites; i++) {
      var x,y ; 

      if (positions.lenght>0 ) {
        x=positions [i].x
        y=positions [i].y
        spriteImage = position[i].image

      } else {
        x=random (width/2+150,width/2-150);
        y=random (-height*4.5,height-400);
      }
      var sprite = createSprite (x,y);
      sprite.addImage ("sprite",spriteImage);
      sprite.scale = scale;
      spriteGroup.add (sprite);
    }

  }
  
  handleElements() {
    form.hide();
    form.titleImg.position(40, 50);
    form.titleImg.class("gameTitleAfterEffect");

    this.resetTitle.html ("RESET");
    this.resetTitle.class ("resetText");
    this.resetTitle.position (width/2+200,40);

    this.resetButton.class ("resetButton");
    this.resetButton.position (width/2+230,100);

    this.leaderBoardTitle.html ("Placar");
    this.leaderBoardTitle.class ("resetText");
    this.leaderBoardTitle.position (width/3-60,40);

    this.leader1.class ("leadersText");
    this.leader1.position (width/3-50,80);

    this.leader2.class ("leadersText");
    this.leader2.position (width/3-50,130);
  }

  play() {
    this.handleElements();
    this.handleResetButton();
    Player.getPlayersInfo();
    player.getCarsAtEnd ();

    if (allPlayers !== undefined) {
      image(track, 0, -height * 5, width, height * 6);

      this.showLeaderBoard ();
      this.showLife ();
      this.showFuelbar ();

      //índice da matriz
          var index = 0;
      for (var plr in allPlayers) {
        //adicione 1 ao índice para cada loop
        index = index + 1;

        //use os dados do banco de dados para exibir os carros nas direções x e y
        var x = allPlayers[plr].positionX;
        var y = height - allPlayers[plr].positionY;

      

        cars[index - 1].position.x = x;
        cars[index - 1].position.y = y;

        if (index === player.index) {
          stroke(10);
          fill("blue");
          ellipse(x, y, 60, 60);
          this.handleFuel(index)
          this.handlePowerCoins(index )
          this.heandleObstacleColision(index)

          //alterar a posição da câmera na direção y
          camera.position.x = cars[index - 1].position.x;
          camera.position.y = cars[index - 1].position.y;
        }
       }

      // manipulando eventos de teclado
      if (this.playerMoving) {
        player.positionY+=5
        player.update ()
      }
      this.handlePlayerControls();

      const finishLine = height*6-100;
      
      if (player.positionY>finishLine) {
        gameState = 2 
        player.rank +=1 
        Player.updateCarsAtEnd (player.rank);
        player.update ()
        this.showRank();
      }
      
      drawSprites();
    }
  }

  handlePlayerControls() {
    // manipulando eventos de teclado
    if (keyIsDown(UP_ARROW) || keyDown("w")) {
      
      this.playerMoving = true ; 
      player.positionY += 10;
      player.update();

    }


    if (keyIsDown(LEFT_ARROW) && player.positionX>width/3-50 ||keyDown("a") && player.positionX>width/3-50 ) {
      this.leftKeyActive=true
      player.positionX -=5 ;
      player.update ();
    }

    if (keyIsDown(RIGHT_ARROW) && player.positionX<width/2+300 ||keyDown("d") && player.positionX<width/2+300 ) {
      this.leftKeyActive=false
      player.positionX +=5 ;
      player.update ();
    }
  }

  handleResetButton() {
    this.resetButton.mousePressed (()=>{
   database.ref ("/").set ({
    playerCount : 0 ,
    gameState : 0 ,
    carsAtEnd :0 ,
    players : {},
    })
    window.location.reload ()
  })
  }

  showLeaderBoard (){
    var leader1 ,leader2 ;
    var players = Object.values (allPlayers);
    if ((players[0].rank===0 && players[1].rank===0)||
    players[0].rank===1) {
      leader1 =
      players [0].rank+
      "&emsp;"+
      players[0].name +
      "&emsp;"+
       players[0].score;
       
       leader2 =
      players [1].rank+
      "&emsp;"+
      players[1].name +
      "&emsp;"+
       players[1].score;

  }

  if (players[1].rank===1) {
    leader1 =
      players [1].rank+
      "&emsp;"+
      players[1].name +
      "&emsp;"+
       players[1].score;
       
       leader2 =
      players [0].rank+
      "&emsp;"+
      players[0].name +
      "&emsp;"+
       players[0].score;
  }

  this.leader1.html (leader1);
  this.leader2.html (leader2);
}

showLife (){
 push ()
 image (lifeImage,width/2-130,height-player.positionY-280 ,20,20)
 fill ("white")
 rect (width/2-100,height-player.positionY-280,185,20)
 fill ("red") 
 rect (width/2-100,height-player.positionY-280,player.life,20)
 noStroke ()
 pop ()

}

showFuelbar (){
  push ()
  image (fuelImage,width/2-130,height-player.positionY-330 ,20,20)
  fill ("white")
  rect (width/2-100,height-player.positionY-330,185,20)
  fill ("blue") 
  rect (width/2-100,height-player.positionY-330,player.fuel,20)
  noStroke ()
  pop ()
  
 }

 handleFuel (index){
  cars [index-1].overlap (fuels,function(collector,collected){
    player.fuel = 185 
    collected.remove ()
    
  })
 if (player.fuel>0&&this.playerMoving) {
  player.fuel-=0.3;
 }

 if (player.fuel<=0) {
  gameState = 2 
  this.gameOver ()
 }
 }

 handlePowerCoins (index ){
  cars [index-1].overlap (powerCoins,function(collector,collected){
    player.score +=21 ; 
    player.update ();
    collected.remove ()

    

  })
 }
heandleObstacleColision(index){
  if (cars[index-1].collide(obstacle1)||cars[index-1].collide(obstacle2)) {
    if (this.leftKeyActive) {
      player.positionX+=100
    } else {
      player.positionX-=100
    }

    if (player.life>0) {
      player.life-=185/4
    }
    player.update()
  }
}


showRank (){
  swal ({
    title :`ìncrivel!${"\n"}Rank${"\n"}${player.rank}`,
    text :"você chegou a linha de chegada!   ",
    imageUrl:"https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
    imageSize:"100x100",
    confirmButtonText :"ok"
  })
}

gameOver (){
  swal ({
    title :`fim de jogo`,
    text :"Ops,voce perdeu a corrida   ",
    imageUrl:"https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
    imageSize:"100x100",
    confirmButtonText :"obrigado por jogar"
  })
}

}


