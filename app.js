document.addEventListener("DOMContentLoaded", () => {
  const userGrid = document.querySelector(".grid-user");
  const computerGrid = document.querySelector(".grid-computer");
  const displayGrid = document.querySelector(".grid-display");
  const ships = document.querySelectorAll(".ship");
  const destroyer = document.querySelector(".destroyer-container");
  const submarine = document.querySelector(".submarine-container");
  const cruiser = document.querySelector(".cruiser-container");
  const battleship = document.querySelector(".battleship-container");
  const carrier = document.querySelector(".carrier-container");
  const startButton = document.querySelector("#start");
  const rotateButton = document.querySelector("#rotate");
  const turnDisplay = document.querySelector("#whose-go");
  const infoDisplay = document.querySelector("#info");
  const userSquares = [];
  const computerSquares = [];
  let isGameOver = false;
  let currentPlayer = "user";
  let isHorizontal = true;
  const width = 10;
  //  create Board

  const createBoard = (grid, squares) => {
    for (let i = 0; i < width * width; i++) {
      const square = document.createElement("div");
      square.dataset.id = i;
      grid.appendChild(square);
      squares.push(square);
    }
  };
  createBoard(userGrid, userSquares);
  createBoard(computerGrid, computerSquares);

  //   ship

  const shipArray = [
    {
      name: "destroyer",
      directions: [
        [0, 1],
        [0, width, width * 1],
      ],
    },
    {
      name: "submarine",
      directions: [
        [0, 1, 2],
        [0, width, width * 2],
      ],
    },
    {
      name: "cruiser",
      directions: [
        [0, 1, 2],
        [0, width, width * 2],
      ],
    },
    {
      name: "battleship",
      directions: [
        [0, 1, 2, 3],
        [0, width, width * 2, width * 3],
      ],
    },
    {
      name: "carrier",
      directions: [
        [0, 1, 2, 3, 4],
        [0, width, width * 2, width * 3, width * 4],
      ],
    },
  ];

  // Draw the computers ships in random location

  const generate = (ship) => {
    let randomDirection = Math.floor(Math.random() * ship.directions.length);
    let current = ship.directions[randomDirection];
    if (randomDirection === 0) direction = 1;
    if (randomDirection === 1) direction = 10;
    let randomStart = Math.abs(
      Math.floor(
        Math.random() * computerSquares.length -
          ship.directions[0].length * direction
      )
    );
    // checking through some of the square is not taken.we are going through computersquare and loop through + indexs and add one of this array . making sure indexes of our ship  dont contain any taken. if taken it will be true
    const isTaken = current.some((index) =>
      computerSquares[randomStart + index].classList.contains("taken")
    );
    // it makes sure that it stay inside the box
    const isAtRIghtEdge = current.some(
      (index) => (randomStart + index) % width === width - 1
    );
    const isAtLeftEdge = current.some(
      (index) => (randomStart + index) % width === 0
    );

    if (!isTaken && !isAtRIghtEdge && !isAtLeftEdge)
      current.forEach((index) =>
        computerSquares[randomStart + index].classList.add("taken", ship.name)
      );
    else generate(ship);
  };
  generate(shipArray[0]);
  generate(shipArray[1]);
  generate(shipArray[2]);
  generate(shipArray[3]);
  generate(shipArray[4]);

  // rotate the ships
  const rotate = () => {
    if (isHorizontal) {
      destroyer.classList.toggle("destroyer-container-vertical");
      submarine.classList.toggle("submarine-container-vertical");
      cruiser.classList.toggle("cruiser-container-vertical");
      battleship.classList.toggle("battleship-container-vertical");
      carrier.classList.toggle("carrier-container-vertical");
      isHorizontal = false;
      console.log(isHorizontal);
      return;
    }
    if (!isHorizontal) {
      destroyer.classList.toggle("destroyer-container-vertical");
      submarine.classList.toggle("submarine-container-vertical");
      cruiser.classList.toggle("cruiser-container-vertical");
      battleship.classList.toggle("battleship-container-vertical");
      carrier.classList.toggle("carrier-container-vertical");
      isHorizontal = true;
      console.log(isHorizontal);
      return;
    }
  };
  rotateButton.addEventListener("click", rotate);

  // move around user ship

  ships.forEach((ship) => ship.addEventListener("dragstart", dragStart));
  userSquares.forEach((square) =>
    square.addEventListener("dragstart", dragStart)
  );
  userSquares.forEach((square) =>
    square.addEventListener("dragover", dragOver)
  );
  userSquares.forEach((square) =>
    square.addEventListener("dragenter", dragEnter)
  );
  userSquares.forEach((square) =>
    square.addEventListener("dragleave", dragLeave)
  );
  userSquares.forEach((square) => square.addEventListener("drop", dragDrop));
  userSquares.forEach((square) => square.addEventListener("dragend", dragEnd));

  let selectedShipNameWithIndex;
  let draggedShip;
  let draggedShipLength;

  ships.forEach((ship) =>
    ship.addEventListener("mousedown", (e) => {
      selectedShipNameWithIndex = e.target.id;
      console.log(selectedShipNameWithIndex);
    })
  );

  function dragStart(e) {
    draggedShip = this;
    draggedShipLength = this.childNodes.length;
    console.log(draggedShip);
  }

  function dragOver(e) {
    e.preventDefault();
  }
  function dragEnter(e) {
    e.preventDefault();
  }
  function dragLeave() {
    console.log("drag leave");
  }

  function dragDrop() {
    let shipNameWithLastId = draggedShip.lastChild.id;
    let shipClass = shipNameWithLastId.slice(0, -2);
    console.log(shipClass);

    let lastShipIndex = parseInt(shipNameWithLastId.substr(-1));
    let shipLastId = lastShipIndex + parseInt(this.dataset.id);
    console.log(shipLastId);

    const notAllowedHorizontal = [
      0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 1, 11, 21, 31, 41, 51, 61, 71, 81,
      91, 2, 22, 32, 42, 52, 62, 72, 82, 92, 3, 13, 23, 33, 43, 43, 53, 63, 73,
      83, 93,
    ];

    const notAllowedVertical = [
      98, 97, 96, 95, 94, 93, 92, 91, 90, 89, 88, 87, 86, 85, 84, 83, 82, 81,
      80, 79, 78, 77, 76, 75, 74, 73, 72, 71, 70, 69, 68, 67, 66, 65, 64, 63,
      62, 61, 60,
    ];
    let newNOtAllowedHorizontal = notAllowedHorizontal.splice(
      0,
      10 * lastShipIndex
    );
    let newNOtAllowedVertical = notAllowedVertical.splice(
      0,
      10 * lastShipIndex
    );

    selectedShipIndex = parseInt(selectedShipNameWithIndex.substr(-1));

    shipLastId = shipLastId - selectedShipIndex;
    console.log(shipLastId);

    if (isHorizontal && !newNOtAllowedHorizontal.includes(shipLastId)) {
      for (let i = 0; i < draggedShipLength; i++) {
        userSquares[
          parseInt(this.dataset.id) - selectedShipIndex + i
        ].classList.add("taken", shipClass);
      }
    } else if (!isHorizontal && !newNOtAllowedVertical.includes(shipLastId)) {
      for (let i = 0; i < draggedShipLength; i++) {
        userSquares[
          parseInt(this.dataset.id) - selectedShipIndex + width * i
        ].classList.add("taken", shipClass);
      }
    } else return;
    displayGrid.removeChild(draggedShip);
  }
  function dragEnd() {
    console.log("drag end");
  }

  // play game
  function playGame() {
    if (isGameOver) return;

    if (currentPlayer === "user") {
      console.log("working");
      turnDisplay.innerHTML = "Your Go";
      computerSquares.forEach((square) =>
        square.addEventListener("click", function (e) {
          revealSquare(square);
        })
      );
    }
    if (currentPlayer === "computer") {
      turnDisplay.innerHTML = "Computers Go";
      setTimeout(computerGo, 1000);
    }
  }
  startButton.addEventListener("click", playGame);

  let destroyerCount = 0;
  let submarineCount = 0;
  let cruiserCount = 0;
  let battleshipCount = 0;
  let carrierCount = 0;

  function revealSquare(square) {
    if (!square.classList.contains("boom")) {
      if (square.classList.contains("destroyer")) destroyerCount++;
      if (square.classList.contains("submarine")) submarineCount++;
      if (square.classList.contains("cruiser")) cruiserCount++;
      if (square.classList.contains("battleship")) battleshipCount++;
      if (square.classList.contains("carrier")) carrierCount++;

      if (square.classList.contains("taken")) {
        square.classList.add("boom");
        console.log("click");
      } else {
        square.classList.add("miss");
        console.log("click");
      }
      checkForWins();
      currentPlayer = "computer";
      playGame();
    }
  }
  let cpudestroyerCount = 0;
  let cpusubmarineCount = 0;
  let cpucruiserCount = 0;
  let cpubattleshipCount = 0;
  let cpucarrierCount = 0;
  function computerGo() {
    let random = Math.floor(Math.random() * userSquares.length);
    if (!userSquares[random].classList.contains("boom")) {
      if (userSquares[random].classList.contains("destroyer"))
        cpudestroyerCount++;
      if (userSquares[random].classList.contains("submarine"))
        cpusubmarineCount++;
      if (userSquares[random].classList.contains("cruiser")) cpucruiserCount++;
      if (userSquares[random].classList.contains("battleship"))
        cpubattleshipCount++;
      if (userSquares[random].classList.contains("carrier")) cpucarrierCount++;
      if (userSquares[random].classList.contains("taken")) {
        userSquares[random].classList.add("boom");
      } else {
        userSquares[random].classList.add("miss");
      }
      console.log(">>>>>>", checkForWins());
      checkForWins();
    } else computerGo();

    currentPlayer = "user";
    turnDisplay.innerHTML = "Your Go";
  }
  function checkForWins() {
    console.log("object");
    if (destroyerCount == 2) {
      console.log("object");
      infoDisplay.innerHTML = "You sunk the computer destroyer";
      destroyerCount = 10;
    }
    if (submarineCount == 3) {
      infoDisplay.innerHTML = "You sunk the computer submarine";
      submarineCount = 10;
    }
    if (cruiserCount == 3) {
      infoDisplay.innerHTML = "You sunk the computer cruiser";
      cruiserCount = 10;
    }
    if (battleshipCount == 4) {
      infoDisplay.innerHTML = "You sunk the computer battleship";
      cpudestroyerCount = 10;
    }
    if (carrierCount == 5) {
      infoDisplay.innerHTML = "You sunk the computer carrier";
      carrierCount = 10;
    }
    if (cpudestroyerCount == 2) {
      infoDisplay.innerHTML = "You loose your destroyer";
      destroyerCount = 10;
    }
    if (cpusubmarineCount == 3) {
      infoDisplay.innerHTML = "You loose your submarine";
      cpusubmarineCount = 10;
    }
    if (cpucruiserCount == 3) {
      infoDisplay.innerHTML = "You loose your cruiser";
      cpucruiserCount = 10;
    }
    if (cpubattleshipCount == 4) {
      infoDisplay.innerHTML = "You loose your battleship";
      cpubattleshipCount = 10;
    }
    if (cpucarrierCount == 5) {
      infoDisplay.innerHTML = "You loose your carrier";
      cpucarrierCount = 10;
    }
    if (
      destroyerCount +
        submarineCount +
        cruiserCount +
        battleshipCount +
        carrierCount ===
      50
    ) {
      console.log("hehehehhe");
      infoDisplay.innerHTML = "YOU WIN";
      gameOver();
    }
    if (
      cpudestroyerCount +
        cpusubmarineCount +
        cpucruiserCount +
        cpubattleshipCount +
        cpucarrierCount ===
      50
    ) {
      infoDisplay.innerHTML = "COMPUTER WIN";
      gameOver();
    }
    return;
  }
  function gameOver() {
    isGameOver = true;
    startButton.removeEventListener("click", playGame);
  }
});
