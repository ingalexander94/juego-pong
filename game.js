(() => {
  const UP1 = "q",
    UP2 = "o",
    DOWN1 = "a",
    DOWN2 = "l";

  // Velocidad del juego en milisegundos
  let time = 60;
  // Movimiento de los objetos en la pantalla en pixeles
  const movementBall = 20,
    movementBar = 20,
    // Ancho y alto de la pantalla
    width = document.documentElement.clientWidth - movementBall,
    height = document.documentElement.clientHeight - movementBall;

  // Bandera inciiar, terminar juego
  let controlGame,
    // Bandera de jugadores
    player1,
    player2,
    // Contador de movimientos
    movementCount = 0;

  // ---------------------------------------------------------------------------

  // Arrancar juego
  const play = () => {
    resetGame();
    controlGame = setInterval(startGame, time);
  };

  // Resetear juego
  const resetGame = () => {
    const options = [0, width - 40];
    ball.style.left = `${options[Math.floor(Math.random() * (2 - 0)) + 0]}px`;
    ball.state = 0;
    ball.direction = 1;
    player1 = {
      keyPress: false,
      key: "",
      reset: function () {
        this.keyPress = false;
        this.key = "";
      },
    };
    player2 = { ...player1 };
  };

  const startGame = () => {
    listenerMovementBall();
    listenerMovementBar();
    isWin();
  };

  const finishGame = () => {
    clearInterval(controlGame);
    document.body.style.background = "#00C8E0";
  };

  const isWin = () => {
    if (ball.offsetLeft >= width) {
      finishGame();
      result1.innerHTML = "Ganador";
      result2.innerHTML = "Perdedor";

      setTimeout(() => {
        location.reload();
      }, 2000);
    }
    if (ball.offsetLeft <= 0) {
      finishGame();
      result2.innerHTML = "Ganador";
      result1.innerHTML = "Perdedor";
      setTimeout(() => {
        location.reload();
      }, 2000);
    }
  };

  const listenerMovementBar = () => {
    moveBar(player1, UP1, DOWN1, bar1);
    moveBar(player2, UP2, DOWN2, bar2);
  };

  const listenerMovementBall = () => {
    checkStateBall();
    switch (ball.state) {
      case 1:
        moveBall(ball.offsetLeft + movementBall, ball.offsetTop + movementBall);
        break;
      case 2:
        moveBall(ball.offsetLeft + movementBall, ball.offsetTop - movementBall);
        break;
      case 3:
        moveBall(ball.offsetLeft - movementBall, ball.offsetTop + movementBall);
        break;
      case 4:
        moveBall(ball.offsetLeft - movementBall, ball.offsetTop - movementBall);
        break;
    }
  };

  const checkStateBall = () => {
    if (collidePlaye2()) {
      ball.direction = 2;
      ball.state === 1 && (ball.state = 3);
      ball.state === 2 && (ball.state = 4);
    } else if (collidePlaye1()) {
      ball.direction = 1;
      ball.state === 3 && (ball.state = 1);
      ball.state === 4 && (ball.state = 2);
    }
    ball.direction === 1
      ? ball.offsetTop >= height - movementBall
        ? (ball.state = 2)
        : ball.offsetTop <= 0 && (ball.state = 1)
      : ball.offsetTop >= height - movementBall
      ? (ball.state = 4)
      : ball.offsetTop <= 0 && (ball.state = 3);
  };

  const collidePlaye1 = () => {
    if (
      ball.offsetLeft <= bar1.clientWidth &&
      ball.offsetTop >= bar1.offsetTop &&
      ball.offsetTop <= bar1.offsetTop + bar1.clientHeight
    ) {
      movementCount++;
      if (movementCount > 5) {
        time += 5;
        clearInterval(controlGame);
        controlGame = setInterval(startGame, time);
      }
      return true;
    }
    return false;
  };

  const collidePlaye2 = () => {
    if (
      ball.offsetLeft >= width - bar2.clientWidth &&
      ball.offsetTop >= bar2.offsetTop &&
      ball.offsetTop <= bar2.offsetTop + bar2.clientHeight
    ) {
      movementCount++;
      if (movementCount > 3) {
        time -= 10;
        clearInterval(controlGame);
        controlGame = setInterval(startGame, time);
      }
      return true;
    }
    return false;
  };

  //---------------------------------------------------------------------------

  const moveBar = (player = {}, up = "", down = "", bar = null) => {
    if (player.keyPress) {
      player.key === up &&
        bar.offsetTop >= 0 &&
        (bar.style.top = `${bar.offsetTop - movementBar}px`);
      player.key === down &&
        bar.offsetTop + bar.clientHeight <= height &&
        (bar.style.top = `${bar.offsetTop + movementBar}px`);
    }
  };

  const moveBall = (pixelLeft = 0, pixelTop = 0) => {
    ball.style.left = `${pixelLeft}px`;
    ball.style.top = `${pixelTop}px`;
  };

  // ---------------------------------------------------------------------------

  document.onkeydown = (e) => {
    key = e.key.toLowerCase();
    switch (key) {
      case UP1:
      case DOWN1:
        player1.keyPress = true;
        player1.key = key;
        break;
      case UP2:
      case DOWN2:
        player2.keyPress = true;
        player2.key = key;
        break;
    }
  };

  document.onkeyup = (e) => {
    key = e.key.toLowerCase();
    if (key === UP1 || key === DOWN1) {
      player1.reset();
    }
    if (key === UP2 || key === DOWN2) {
      player2.reset();
    }
  };

  play();
})();
