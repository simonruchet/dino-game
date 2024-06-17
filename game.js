// Le jeu du personnage

///////////////////
// CONFIG
const JUMP_MAX_DURATION = 400; // Durée maximale du saut en ms
const JUMP_KEY_COde = "Space"; // Touche pour sauter
const START_KEY_CODE = "Space"; // Touche pour lancer le jeu
const INITIAL_SCORE = 0; // Score initial
const SCORE_INCREMENT = 10; // Incrément du score (à chaque intervalle de temps)
const SCORE_INTERVAL_TIME = 300; // Intervalle de temps pour l'incrémentation du score en ms
const JUMP_TRANSITION_DURATION = 250; // Durée de l'animation de saut en ms (la même que dans le CSS)
///////////////////

// Variable pour savoir si le jeu est lancé
let isGameStarted = false;
// Variable pour le score
let score = INITIAL_SCORE;
// Variable pour savoir si le personnage est en train de sauter
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
    // Si la touche pressée est en mode répétition, on ne fait rien
    if (event.repeat) return;

    // On ne fait rien si le jeu est déjà lancé
    if (isGameStarted) return;

    // Si la touche pressée est "Espace", on lance le jeu
    if (event.code === START_KEY_CODE) {
      // On lance la boucle de jeu
      gameLoop();
    }
  });
}

function gameLoop() {
  // Récupération de l'élément HTML avec la classe "game"
  const game = document.querySelector(".game");

  // On ne fait rien si l'élément n'existe pas
  if (!game) {
    console.error("élément '.game' non trouvé");
    return;
  }

  // On indique que le jeu est lancé
  isGameStarted = true;

  // On réinitialise le score
  score = INITIAL_SCORE;

  // On ajoute la classe "active" à l'élément HTML avec la classe "game" pour afficher le jeu
  game.classList.add("active");
  // On enlève la classe "over" pour enlever le message "Game Over" si il était affiché
  game.classList.remove("over");

  // On écoute l'événement "keydown" sur le document pour faire sauter le personnage
  document.addEventListener("keydown", jump);
  document.addEventListener("keyup", stopJump);

  // vérification de la collision entre le personnage et l'obstacle
  checkCollision();

  // On lance la fonction pour afficher le score
  showScore();
}

// Variables pour les timers de saut
let jumpTimer, fallTimer;

// Fonction pour faire sauter le personnage
function jump(event) {
  // Si la touche pressée est en mode répétition, on ne fait rien
  if (event.repeat) return;

  // Si la touche pressée n'est pas "Espace", on ne fait rien
  if (event.code !== "Space") return;

  // Si le personnage est déjà en train de sauter, on ne fait rien
  if (isJumping) return;

  // Récupération de l'élément HTML avec la classe "character"
  const character = document.querySelector(".character");

  // On ne fait rien si l'élément n'existe pas
  if (!character) {
    console.error("élément '.character' non trouvé");
    return;
  }

  // On passe la variable isJumping à true pour indiquer que le personnage est en train de sauter
  isJumping = true;

  // On ajoute la classe "jumping" au personnage pour le faire sauter
  character.classList.add("jumping");

  // On retire la classe "jumping" après un certain temps pour que le personnage retombe
  jumpTimer = setTimeout(() => {
    character.classList.remove("jumping");
  }, JUMP_MAX_DURATION);

  // On remet la variable isJumping à false pour indiquer que le personnage a fini de sauter
  fallTimer = setTimeout(() => {
    isJumping = false;
  }, JUMP_MAX_DURATION + JUMP_TRANSITION_DURATION); // on ajoute du temps pour prendre en compte la durée de l'animation de chute
}

// Fonction pour arrêter le saut du personnage en cas de relâchement de la touche "Espace"
function stopJump() {
  // Récupération de l'élément HTML avec la classe "character"
  const character = document.querySelector(".character");

  // On ne fait rien si l'élément n'existe pas
  if (!character) {
    console.error("élément '.character' non trouvé");
    return;
  }

  // On arrête les timers pour le saut
  clearTimeout(jumpTimer);
  clearTimeout(fallTimer);

  // On retire la classe "jumping" après max 1s pour que le personnage retombe
  character.classList.remove("jumping");

  // On remet la variable isJumping à false pour indiquer que le personnage a fini de sauter
  isJumping = false;
}

// Fonction pour vérifier si le personnage est en collision avec un obstacle
function checkCollision() {
  // Récupération de l'élément HTML avec la classe "character"
  const character = document.querySelector(".character");
  // Récupération de l'élément HTML avec la classe "obstacle"
  const obstacle = document.querySelector(".obstacle");

  // On ne fait rien si l'un des éléments n'existe pas
  if (!character || !obstacle) {
    console.error("élément '.character' ou élément '.obstacle' non trouvé");
    return;
  }

  function detectCollision() {
    // Récupération des coordonnées de l'obstacle et du personnage
    const obstacleRect = obstacle.getBoundingClientRect();
    const characterRect = character.getBoundingClientRect();

    // Si les coordonnées de l'obstacle et du personnage se chevauchent, c'est que le personnage est en collision avec l'obstacle
    if (
      characterRect.right > obstacleRect.left &&
      characterRect.left < obstacleRect.right &&
      characterRect.bottom > obstacleRect.top &&
      characterRect.top < obstacleRect.bottom
    ) {
      gameOver();
    } else {
      // Continue the loop
      requestAnimationFrame(detectCollision);
    }
  }

  // On lance la fonction pour détecter la collision
  requestAnimationFrame(detectCollision);
}

function gameOver() {
  // Récupération de l'élément HTML avec la classe "game"
  const game = document.querySelector(".game");

  // On ne fait rien si l'élément n'existe pas
  if (!game) {
    console.error("élément '.game' non trouvé");
    return;
  }

  // On indique au HTML que le jeu est terminé
  game?.classList.remove("active");

  // On affiche le message "Game Over"
  game?.classList.add("over");

  // On arrête d'écouter les événements "keydown" qui font sauter le personnage
  document.removeEventListener("keydown", jump);
  document.removeEventListener("keyup", stopJump);

  // On indique que le jeu est terminé
  isGameStarted = false;

  // On arrête l'incrémentation du score
  clearInterval(scoreInterval);
}

// Fonction pour afficher le score
function showScore() {
  // Récupération de l'élément HTML avec la classe "score"
  const scoreElement = document.querySelector(".score");

  // On ne fait rien si l'élément n'existe pas
  if (!scoreElement) {
    console.error("Score non trouvé");
    return;
  }

  // Affichage du score initial
  scoreElement.textContent = `${INITIAL_SCORE}`;

  // Incrémentation du score périodiquement
  scoreInterval = setInterval(() => {
    // Si le jeu n'est pas lancé, on ne fait rien
    if (!isGameStarted) return;

    // Incrémentation du score de 10
    score += SCORE_INCREMENT;

    // Affichage du score
    scoreElement.textContent = `${score}`;
  }, SCORE_INTERVAL_TIME);
}
