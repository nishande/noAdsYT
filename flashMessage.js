// Create the flash message element
const flashMessage = document.createElement('div');
flashMessage.id = 'flashMessage';
flashMessage.textContent = 'Enjoy Ad-free experience';

// Append it to the body
document.body.appendChild(flashMessage);

// Show the flash message after a delay
setTimeout(() => {
    flashMessage.classList.add('show');

    // Hide the flash message after 3 seconds
    setTimeout(() => {
        flashMessage.classList.remove('show');
    }, 3000);
}, 1000);
