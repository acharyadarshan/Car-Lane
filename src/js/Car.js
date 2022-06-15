const current_score_elem = document.querySelector(".currentScore");
const play_btn_elem = document.querySelector(".playBtn");
const play_restart_elem = document.querySelector(".restart");
const road_lane_elem = document.querySelector(".roadLane");

let highScore;

play_btn_elem.addEventListener("click", start);

function gamePlay() {
    if (game.start) {
        // console.log('lane');
        animateBackground();
        const carElement = document.querySelector(".car");

        moveOtherCars(carElement);
        window.requestAnimationFrame(gamePlay);
        gameSpeed += Math.random() * game.speedFactor;
        // other_car();
    }
}

function start() {
    checkHighScore();
    document.querySelector(
        "body > div > div.currentScore > h1"
    ).textContent = `Current Score:${game.score}\nHighScore:${highScore}`;
    current_score_elem.classList.remove("hideMe");
    play_btn_elem.classList.add("hideMe");
    play_restart_elem.classList.add("hideMe");
    game.start = true;
    // console.log(game.start);
    game.score = 0;
    gameSpeed = game.speed;

    window.requestAnimationFrame(gamePlay);

    my_car();
    other_car();
}

function other_car() {
    for (let count = 0; count < 3; count++) {
        // console.log('otherCar');
        let otherCar = document.createElement("div");
        otherCar.setAttribute("class", "otherCar");
        otherCar.y = (count + 1) * 400 * -1;
        otherCar.style.top = otherCar.y + "px";
        otherCar.style.left = carLeftPos[getRandomInt(0, 3)] + "px";
        road_lane_elem.appendChild(otherCar);
    }
}

function moveOtherCars(carElement) {
    let otherCars = document.querySelectorAll(".otherCar");
    otherCars.forEach((item) => {
        if (isCollide(carElement, item)) {
            onGameOver();
            // console.log('hit');
        }
        if (item.y >= 850) {
            item.y = -400;
            game.score += 10;
            document.querySelector(
                "body > div > div.currentScore > h1"
            ).textContent = `Current Score:${game.score}
            HighScore:${highScore}`;
            item.style.left = carLeftPos[getRandomInt(0, 3)] + "px";
        }
        item.y += gameSpeed;
        item.style.top = item.y + "px";
        // console.log(item.style.top);
    });
}

function isCollide(a, b) {
    aRect = a.getBoundingClientRect(); //my CAr
    bRect = b.getBoundingClientRect(); //other car

    return !(
        aRect.top > bRect.bottom ||
        aRect.bottom < bRect.top ||
        aRect.right < bRect.left ||
        aRect.left > bRect.right
    );
}

function onGameOver() {
    game.start = false;
    play_restart_elem.classList.remove("hideMe");
    current_score_elem.classList.add("hideMe");
    play_btn_elem.classList.remove("hideMe");
    if (game.score > highScore) {
        highScore = game.score;
    }
    localStorage.setItem("highScore", highScore);
    document.querySelector(
        "body > div > div.restart > h1"
    ).textContent = `Current Score:${game.score}
    HighScore:${highScore}`;
    window.setTimeout(function () {
        location.reload();
    }, 2000);
}

function my_car() {
    const my_car = document.createElement("div");
    road_lane_elem.appendChild(my_car);
    my_car.classList.add("car");

    //keys object

    let keys = { a: "false", d: "false" };

    document.addEventListener("keydown", keyDown);
    document.addEventListener("keyup", keyUp);

    let current_pos = my_car.offsetLeft;

    function keyDown(e) {
        e.preventDefault();
        keys[e.key] = true;
        if (e.key == "a" && current_pos > 110) {
            current_pos -= 160;
            my_car.style.left = current_pos + "px";
        }
        if (e.key == "d" && current_pos < 270) {
            current_pos += 160;
            my_car.style.left = current_pos + "px";
        }
    }
    function keyUp(e) {
        e.preventDefault();
        keys[e.key] = false;
    }
}

var i = 0;
function animateBackground() {
    i += 10;
    if (i > 10000) {
        i = 0;
    }
    road_lane_elem.style.backgroundPositionY = i + "px";
}

function checkHighScore() {
    try {
        highScore = localStorage.getItem("highScore");
    } catch (err) {
        localStorage.setItem("highScore", 0);
    } finally {
        if (highScore == null) highScore = 0;
    }
}
