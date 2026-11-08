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
            $('#poem-text').html('Connection Error...');
            $('#poem-author').text('-eLibrary ');
        });
}

// Load and display latest activity from localStorage
function loadLatestActivity() {
    var books = JSON.parse(localStorage.getItem('books')) || [];
    var $activityList = $('#activity-list');
    
    if (books.length === 0) {
        $activityList.html(`
            <div class="list-group-item text-center text-muted py-3">
                <i class="bi bi-info-circle me-2"></i>No recent activity. Start by adding books to your library!
            </div>
        `);
        return;
    }

    // Sort books by most recent (using createdAt timestamp)
    var sortedBooks = books.sort(function(a, b) {
        var dateA = new Date(a.createdAt || 0);
        var dateB = new Date(b.createdAt || 0);
        return dateB - dateA; // Newest first
    });

    // Show only the 5 most recent books
    var recentBooks = sortedBooks.slice(0, 5);

    var activityHTML = '';
    recentBooks.forEach(function(book) {
        var statusIcon = book.status === 'returned' ? 'bi-check-circle-fill text-success' : 'bi-book-fill text-warning';
        var statusText = book.status === 'returned' ? 'Returned' : 'Borrowed';
        var date = book.createdAt ? new Date(book.createdAt).toLocaleDateString() : 'Recently';

        activityHTML += `
            <div class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                <div>
                    <i class="bi ${statusIcon} me-2"></i>
                    <strong>${book.code}</strong>
                    <span class="badge bg-secondary ms-2">${statusText}</span>
                </div>
                <small class="text-muted">${date}</small>
            </div>
        `;
    });

    $activityList.html(activityHTML);
}

// 3. Load Analytics Charts
function loadAnalyticsCharts() {
    var books = JSON.parse(localStorage.getItem('books')) || [];
    
    // Count books by status
    var borrowedCount = books.filter(b => b.status === 'borrowed').length;
    var returnedCount = books.filter(b => b.status === 'returned').length;
    
    // Count books by priority
    var highCount = books.filter(b => b.priority === 'high').length;
    var mediumCount = books.filter(b => b.priority === 'medium').length;
    var lowCount = books.filter(b => b.priority === 'low').length;
    
    // Render Status Pie Chart
    var statusCtx = document.getElementById('statusChart');
    if (statusCtx) {
        new Chart(statusCtx, {
            type: 'pie',
            data: {
                labels: ['Borrowed', 'Returned'],
                datasets: [{
                    data: [borrowedCount, returnedCount],
                    backgroundColor: ['#ffc107', '#198754'],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
    }
    
    // Render Priority Bar Chart
    var priorityCtx = document.getElementById('priorityChart');
    if (priorityCtx) {
        new Chart(priorityCtx, {
            type: 'bar',
            data: {
                labels: ['High', 'Medium', 'Low'],
                datasets: [{
                    label: 'Number of Books',
                    data: [highCount, mediumCount, lowCount],
                    backgroundColor: ['#dc3545', '#ffc107', '#0dcaf0'],
                    borderWidth: 1,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { stepSize: 1 }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }
}

// Initialize Home Page
$(document).ready(function() {
    loadDailyPoem();
    loadLatestActivity();
    loadAnalyticsCharts();
});