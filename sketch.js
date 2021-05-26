//Create variables here
var dog,sadDog,happyDog, database;
var readState,updateState
var currentTime
var foodS,foodStock;
var fedTime,lastFed;
var feed,addFood;
var foodObj;
var bedroomImg,washroomImg,gardenImg

function preload(){
sadDog=loadImage("Images/Dog.png");
happyDog=loadImage("Images/Happy.png");
bedroomImg = loadImage("Images/Bed Room.png")
washroomImg=  loadImage("Images/Wash Room.png")
gardenImg = loadImage("Images/Garden.png")

}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  readState = database.ref('gameState')
  readState.on("value",function(data){
    gameState = data.val()
  });



  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;
  
  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

}

function draw() {
  background(46,139,87);
  foodObj.display();

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
 
  fill(255,255,254);
  textSize(15);

  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + " PM", 350,30);
   }else if(lastFed==0){
     text("Last Feed : 12 AM",350,30);
   }else{
     text("Last Feed : "+ lastFed + " AM", 350,30);
   }
 
  currentTime = hour();

  if(currentTime==(lastFed+1)){
    update("Playing");
    foodObj.garden()
  }else if(currentTime ==(lastFed+2) ){
    update("Sleeping")
    foodObj.bedRoom()
  }else if(currentTime>(lastFed+2)&&currentTime<=(lastFed+4)){
    update("Bathing")
    foodobj.washRoom()
  }else{
    update("Hungry")
    foodObj.display()
  }

  if (gameState!="Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }else{
    feed.show();
    addFood.show();
    dog.addImage(sadDog)
  }
  

  
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);
  
  if(foodObj.getFoodStock()<= 0){
    foodObj.updateFoodStock(foodObj.getFoodStock()*0);
  }else{
    foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  }
  
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
function update(state){
  database.ref('/').update({
    gameState:state
  })
}
