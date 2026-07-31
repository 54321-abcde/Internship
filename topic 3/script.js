const cards = document.querySelectorAll(".card, .project");

window.addEventListener("scroll", () => {
  
  cards.forEach(card => {
    
    const position = card.getBoundingClientRect().top;
    
    const screen = window.innerHeight;
    
    if (position < screen - 100) {
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    }
    
  });
  
});

cards.forEach(card => {
  card.style.opacity = "0";
  card.style.transform = "translateY(40px)";
  card.style.transition = "0.6s";
});