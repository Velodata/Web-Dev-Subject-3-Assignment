document.addEventListener('DOMContentLoaded', () => {
    fetchDataFromAPI();
  });
  
  function fetchDataFromAPI() {
    fetch('https://your-api-url.com/api/v1/example-endpoint')
      .then(response => response.json())
      .then(data => {
        console.log('Data from API:', data);
        // You can dynamically add this data to the page
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }

  // Wait until the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Select the contact form and its elements
  const contactForm = document.querySelector('form');
  const nameInput = document.querySelector('#name');
  const emailInput = document.querySelector('#email');
  const messageInput = document.querySelector('#message');
  const successMessage = 'Your message has been successfully sent!';

  // Regular expressions for validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email validation

  // Add form validation on submit
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent default form submission

    // Reset any existing error highlights
    resetErrorState();

    // Track whether the form is valid
    let isValid = true;

    // Validate the name field (cannot be empty)
    if (nameInput.value.trim() === '') {
      showError(nameInput, 'Name cannot be empty.');
      isValid = false;
    }

    // Validate the email field (using regex)
    if (!emailRegex.test(emailInput.value.trim())) {
      showError(emailInput, 'Please enter a valid email address.');
      isValid = false;
    }

    // Validate the message field (cannot be empty)
    if (messageInput.value.trim() === '') {
      showError(messageInput, 'Message cannot be empty.');
      isValid = false;
    }

    // If the form is valid, simulate a successful submission
    if (isValid) {
      alert(successMessage);
      contactForm.reset(); // Clear the form fields
    }
  });

  // Show an error message for an input field
  function showError(inputElement, message) {
    const errorText = document.createElement('small');
    errorText.className = 'error-text';
    errorText.innerText = message;
    inputElement.insertAdjacentElement('afterend', errorText);
    inputElement.classList.add('error'); // Add error highlight
  }

  // Reset all error highlights and messages
  function resetErrorState() {
    document.querySelectorAll('.error-text').forEach((el) => el.remove());
    document.querySelectorAll('.error').forEach((el) => el.classList.remove('error'));
  }

  // Copy contact details functionality (optional)
  const contactInfoItems = document.querySelectorAll('.contact-info li');
  contactInfoItems.forEach((item) => {
    item.addEventListener('click', () => {
      const textToCopy = item.textContent.trim();
      navigator.clipboard.writeText(textToCopy)
        .then(() => alert(`Copied: ${textToCopy}`))
        .catch((err) => console.error('Failed to copy text', err));
    });
  });
});
