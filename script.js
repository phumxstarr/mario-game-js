//intro canvas

/*const canvas = document.getElementById('board')
const context = board.getContext('2d')

console.log(context)


const myImage = new Image()
myImage.src = "luigi.png"
myImage.onload = function() {
    context.drawImage(myImage, 50 , 10, 120, 120)
}
*/

//เริ่มสร้างเกม

//ตั้งค่าหน้าจอ

let board
let boardWidth = 800
let boardHeight = 300  
let context
let lives = 2
let restarting = false

//ตั้งค่าตัวละครเกม

let playerWidth = 85
let playerHeight = 85
let playerX = 100
let playerY = boardHeight - playerHeight
let playerImg
let player = {
    x:playerX,
    y:playerY,
    width:playerWidth,
    height:playerHeight
}

let gameOver = false
let score = 0
let time = 0

//สร้างอุปสรรค
let boxImg
let boxWidth = 40
let boxHeight = 80
let boxX = 700
let boxY = boardHeight - boxHeight + 10

let boxesArray = []
let boxSpeed = -3

//Gravity & Velocity
let velocityY = 0
let gravity = 0.25

//การกำหนดเหตุการณ์ทเริ่มต้นเกม
window.onload = function() {
    //display
    board = this.document.getElementById('board')
    board.height = boardHeight
    board.width = boardWidth
    context = board.getContext('2d')



    //player
    playerImg = new Image()
    playerImg.src = "mickey.png"
    playerImg.onload = function() {
        context.drawImage(playerImg , player.x, player.y, player.width , player.height)
    }


    //request animation frame
    requestAnimationFrame(update)

    //ดักจับการกระโดด
    document.addEventListener("keydown", movePlayer)

    //สร้าง box
    boxImg = new Image()
    boxImg.src = "cactus.png"
    setTimeout(createBox)
}

//Function update
function update() {
    requestAnimationFrame(update) //Update animation ตลอดเวลา

    //ตรวจสอบว่าเกม over หรือเปล่า
    if(gameOver) { 
        return
    }

    context.clearRect(0,0,board.width,board.height)//เคลียร์ภาพซ้อน
    velocityY += gravity

    //create play Object
    player.y = Math.min(player.y + velocityY, playerY)
    context.drawImage(playerImg,player.x,player.y,player.width,player.height)

    //นับคะแนน
    score++
    context.font = "normal bold 20px Arial"
    context.textAlign = "left"
    context.fillText("Score : " + score, 680 , 30)

    
    context.font = "normal bold 20px Arial"
    context.textAlign = "left"
    context.fillText("Lives : " + lives, 359 , 30)

    //นับเวลา
    let maxTime = 59.9
    
    time += 0.01;
    context.font = "normal bold 20px Arial"
    context.textAlign = "left"
    context.fillText("Time : " + time.toFixed(2), 0 , 30)
    
    //Create Array Box
    for(let i = 0 ; i < boxesArray.length ; i++) {
        let box = boxesArray[i]
        box.x += boxSpeed
        context.drawImage(boxImg , box.x , box.y , box.width , box.height)
        boxSpeed -= 0.00025

        //ตรวจสอบเงื่อนไขการชนของอุปวรรค
        if(onCollision(player,box) && time <= maxTime && lives > 0) {
            gameOver = true
            

            //แจ้งเตือนผู้เล่น

            context.font = "normal bold 40px Arial"
            context.textAlign = "center"
            context.fillText("Game Over", board.width / 2 , board.height / 2)
            context.font = "normal bold 30px Arial"
            context.fillText("Score : "+ (score), board.width / 2 , 200)
        }
        else if (time == maxTime && lives >= 0) {
            gameOver = true
            context.font = "normal bold 40px Arial"
            context.textAlign = "center"
            context.fillText("Congratulation!!", board.width / 2 , board.height / 2)
            context.font = "normal bold 30px Arial"
            context.fillText("Score : "+ (score), board.width / 2 , 200)
        }
        else if (onCollision(player,box) && time <= maxTime && lives == 0) {
            gameOver = true

            context.textAlign = "center"
            context.font = "normal bold 100px Arial"
            context.fillText("You fail", board.width / 2 , board.height / 2)

            context.font = "normal bold 30px Arial"
            context.textAlign = "center"
            context.fillText("Score : "+ (score), board.width / 2 , 200)
        }
    }
}



//function เคลื่อนตัวละคร
function movePlayer(e) {
    if(gameOver) {
        return
    }
    if(e.code == "Space" && player.y == playerY) {
        velocityY = -10
    }
}

function createBox() {
    if(gameOver) {
        return
    }

    let box = {
        img:boxImg,
        x:boxX,
        y:boxY,
        width:boxWidth,
        height:boxHeight
    }

    boxesArray.push(box)

    if(boxesArray.length > 5) {
        boxesArray.shift()
    }

    let randomTime = (Math.random() * 1000) + 1300
    setTimeout(createBox, randomTime)
}

function onCollision(obj1 , obj2) {
    return obj1.x < (obj2.x + obj2.width) &&
            (obj1.x + obj1.width) > obj2.x //ชนกันในแนวนอน
            &&
            obj1.y < (obj2.y + obj2.width) &&
            (obj1.y + obj1.width) > obj2.y
}

//Restart Game
function restartGame() {

    if (restarting) return
    restarting = true

    if (lives <= 0) {
        gameOver = true
        context.textAlign = "center"
        context.font = "normal bold 100px Arial"
        context.fillText("You fail", board.width / 2 , board.height / 2)
        return
    }
    
    
    gameOver = false
    score = 0
    time = 0
    velocityY = 0
    boxesArray = []
    player.y = playerY
    boxSpeed = -3
    lives--

    

    setTimeout(() => {
        restarting = false
    }, 200)
}





