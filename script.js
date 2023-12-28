document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("container");
  const creatures = document.querySelectorAll(".creature");
  const maxRadius = 300;
  const speedFactor = 0.6; // Adjust this factor to control the speed of creatures

  // Initialize flashlight effect on page load
  initFlashlight();

  // Set random initial positions for creatures
  creatures.forEach(function (creature, index) {
    // const initialX = Math.random() * window.innerWidth;
    // const initialY = Math.random() * window.innerHeight;

    const initialX = window.innerWidth / (index + 1);
    const initialY = window.innerHeight / (index + 1);
    console.log({ initialX, initialY, index });

    creature.style.transform = `translate(${initialX}px, ${initialY}px)`;
  });

  function initFlashlight() {
    const centerOfScreen = {
      clientX: window.innerWidth / 2,
      clientY: window.innerHeight / 2,
    };
    handleMouseMove(centerOfScreen);
  }

  function handleMouseMove({ clientX, clientY }) {
    creatures.forEach(function (creature, index) {
      const creatureRect = creature.getBoundingClientRect();
      let creatureX = creatureRect.x + creatureRect.width / 2;
      let creatureY = creatureRect.y + creatureRect.height / 2;

      const deltaX = clientX - creatureX;
      const deltaY = clientY - creatureY;

      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const angle = Math.atan2(deltaY, deltaX);
      const rotation = angle * (180 / Math.PI);

      if (distance <= maxRadius) {
        // Creature is within the radius, move it to the edge and rotate
        const moveX = clientX - maxRadius * Math.cos(angle) * speedFactor;
        const moveY = clientY - maxRadius * Math.sin(angle) * speedFactor;

        creature.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${rotation}deg)`;
      } else {
        // Creature is outside the radius, move it towards the mouse and rotate
        creatures.forEach(function (otherCreature, otherIndex) {
          if (index !== otherIndex) {
            const otherRect = otherCreature.getBoundingClientRect();
            const otherX = otherRect.x + otherRect.width / 2;
            const otherY = otherRect.y + otherRect.height / 2;

            const distanceBetween = Math.sqrt(
              (creatureX - otherX) ** 2 + (creatureY - otherY) ** 2
            );

            const collisionDistance =
              creatureRect.width / 2 + otherRect.width / 2;

            if (distanceBetween < collisionDistance) {
              // Adjust the position to avoid collision
              const moveAngle = angle + Math.PI;
              creatureX = otherX + collisionDistance * Math.cos(moveAngle);
              creatureY = otherY + collisionDistance * Math.sin(moveAngle);
            }
          }
        });

        creature.style.transform = `translate(${creatureX}px, ${creatureY}px) rotate(${rotation}deg)`;
      }
    });

    // Handle flashlight effect
    const spotlightEl = document.querySelector("#spotlight");
    let lightIsOff = true;

    if (lightIsOff) {
      spotlightEl.style.background = `radial-gradient(circle at ${clientX}px ${clientY}px, rgba(0, 0, 0, 0) 20px, rgba(0, 0, 0, 0.9) 80px, rgba(0, 0, 0, 0.8) 100px, rgba(0, 0, 0, 0.99) 200px)`;
    }
  }

  container.addEventListener("mousemove", function (e) {
    const { clientX, clientY } = e;
    handleMouseMove({ clientX, clientY });
  });

  // Prevent default touch behavior (e.g., scrolling)
  container.addEventListener("touchstart", function (e) {
    e.preventDefault();
  });

  container.addEventListener("touchmove", function (e) {
    const touch = e.touches[0] || e;
    const { clientX, clientY } = touch;
    handleMouseMove({ clientX, clientY });
  });

  container.addEventListener("touchend", function (e) {
    // Handle touch end if needed
  });
});
