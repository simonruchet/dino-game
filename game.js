// Le jeu du dinosaure

// Variable pour savoir si le jeu est lancé
let isGameStarted = false;
// Variable pour le score
let score = 0;
// Variable pour savoir si le dinosaure est en train de sauter
let isJumping = false;

// Variable pour l'intervalle de temps pour le score
let scoreInterval;

// On attend que le contenu de la page soit chargé pour exécuter le script
document.addEventListener("DOMContentLoaded", () => {
  // Lancer l'écran d'accueil du jeu
  startScreen();
});

// Fonction pour lancer l'écran d'accueil du jeu
function startScreen() {
  // Lancer le jeu quand on appuie sur espace
  document.addEventListener("keydown", (event) => {
    // On ne fait rien si le jeu est déjà lancé
    if (isGameStarted) return;

    // Si la touche pressée est "Espace", on lance le jeu
    if (event.code === "Space") {
      // On lance la boucle de jeu
      gameLoop();
    }
  });
}

function gameLoop() {
  // Récupération de l'élément HTML avec la classe "game"
  const game = document.querySelector(".game");

  // On indique que le jeu est lancé
  isGameStarted = true;

  // On réinitialise le score
  score = 0;

  // On ajoute la classe "active" à l'élément HTML avec la classe "game" pour afficher le jeu
  game.classList.add("active");
  // On enlève la classe "over" pour enlever le message "Game Over" si il était affiché
  game.classList.remove("over");

  // On écoute l'événement "keydown" sur le document pour faire sauter le dinosaure
  document.addEventListener("keydown", jump);

  // vérification de la collision entre le dinosaure et l'obstacle
  checkCollision();

  // On lance la fonction pour afficher le score
  showScore();
}

// Fonction pour faire sauter le dinosaure
function jump(event) {
  // Si la touche pressée n'est pas "Espace", on ne fait rien
  if (event.code !== "Space") return;

  // Récupération de l'élément HTML avec la classe "dino"
  const dino = document.querySelector(".dino");

  // Si le dinosaure est déjà en train de sauter, on ne fait rien
  if (isJumping) return;

  // On passe la variable isJumping à true pour indiquer que le dinosaure est en train de sauter
  isJumping = true;

  // On ajoute la classe "jumping" au dinosaure pour le faire sauter
  dino.classList.add("jumping");

  // On retire la classe "jumping" au bout de 250ms pour que le dinosaure retombe
  setTimeout(() => {
    dino.classList.remove("jumping");
    isJumping = false;
  }, 250);
}

// Fonction pour vérifier si le dinosaure est en collision avec un obstacle
function checkCollision() {
  // Récupération de l'élément HTML avec la classe "dino"
  const dino = document.querySelector(".dino");
  // Récupération de l'élément HTML avec la classe "obstacle"
  const obstacle = document.querySelector(".obstacle");

  // Vérification de la collision qui se répète toutes les 10ms
  setInterval(() => {
    // Récupération des coordonnées de l'obstacle et du dinosaure
    const obstacleRect = obstacle.getBoundingClientRect();
    const dinoRect = dino.getBoundingClientRect();

    // Si les coordonnées de l'obstacle et du dinosaure se chevauchent, c'est que le dinosaure est en collision avec l'obstacle
    if (
      dinoRect.right > obstacleRect.left &&
      dinoRect.left < obstacleRect.right &&
      dinoRect.bottom > obstacleRect.top &&
      dinoRect.top < obstacleRect.bottom
    ) {
      gameOver();
    }
  }, 10);
}

function gameOver() {
  // Récupération de l'élément HTML avec la classe "game"
  const game = document.querySelector(".game");

  // On indique au HTML que le jeu est terminé
  game?.classList.remove("active");

  // On affiche le message "Game Over"
  game?.classList.add("over");

  // On arrête d'écouter l'événement "keydown" qui fait sauter le dinosaure
  document.removeEventListener("keydown", jump);

  // On indique que le jeu est terminé
  isGameStarted = false;

  // On arrête l'incrémentation du score
  clearInterval(scoreInterval);
}

// Fonction pour afficher le score
function showScore() {
  // Récupération de l'élément HTML avec la classe "score"
  const scoreElement = document.querySelector(".score");

  // Incrémentation du score périodiquement
  scoreInterval = setInterval(() => {
    // Si le jeu n'est pas lancé, on ne fait rien
    if (!isGameStarted) return;

    // Incrémentation du score de 10
    score += 10;

    // Affichage du score
    scoreElement.textContent = `${score}`;
  }, 300);
}
