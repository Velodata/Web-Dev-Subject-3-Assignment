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