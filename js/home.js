// Fetch Random Poem from PoetryDB API
function loadDailyPoem() {
    fetch('https://poetrydb.org/random')
        .then(response => {
            if (!response.ok) throw new Error('API failed');
            return response.json();
        })
        .then(data => {
            var poem = data[0];
            
            // Display the first 7 lines with line breaks
            var firstLines = poem.lines.slice(0, 7).join('<br>');
            $('#poem-text').html(firstLines);
            
            // Display the author
            $('#poem-author').text(`— ${poem.author}, "${poem.title}"`);
        })
        .catch(error => {
            console.log('API error:', error);
            $('#quote-text').html('Connection Error');
            $('#quote-author').text(' ');
        });
}

// Load Daily Poem
$(document).ready(function() {
    loadDailyPoem();
});