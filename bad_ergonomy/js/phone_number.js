const numberDisplay = document.getElementById('number-display');
function createPhoneButton() {
    const button = document.createElement('button');
    const digit = Math.floor(Math.random() * 10);
    button.textContent = digit;
    button.classList.add('number-button');
    button.style.position = 'absolute';
    button.style.left = Math.random() * (window.innerWidth - 50) + 'px';
    button.style.top = Math.random() * (window.innerHeight - 50) + 'px';

    button.addEventListener('click', () => {
      const numberDisplay = document.getElementById('number-display');
      if (numberDisplay.textContent === 'Votre numéro apparaîtra ici...') {
        numberDisplay.textContent = digit;
      } else {
        if (numberDisplay.textContent.length < 10) {
          numberDisplay.textContent += digit;
        }
      }
    });
    document.getElementById('button-container').appendChild(button);
    setTimeout(() => {
      button.remove();
    }, 1200);
  }  

setInterval(createPhoneButton, 1500);

document.getElementById('prev-page-btn').addEventListener('click', () => {
    window.location.href = 'index.html';
  });

document.getElementById('next-page-btn').addEventListener('click', () => {
    window.location.href = 'phone_number.html';
  });
