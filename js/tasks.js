/* 
Doesn't validate codes or return dates from a backend due to the project's scope, mainly designed to meet project requirements for the tasks page (mark as complete = mark as returned etc.)

Registered book array fields:
id (js generated):
code:
userNotes:
returnDate:
priority:
status:
createdAt:
*/

// Load books from localStorage
function loadBooks() {
    var books = JSON.parse(localStorage.getItem('books')) || [];
    return books;
}

// Save books to localStorage
function saveBooks(books) {
    localStorage.setItem('books', JSON.stringify(books));
}

// Generate unique ID for each book
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Update tasks.html values
function updatePage() {
    var books = loadBooks();
    var returned = books.filter(b => b.status === 'returned').length;
    $('#total').text(books.length);
    $('#pendingBooks').text(books.length - returned);
    $('#returnedBooks').text(returned);
}

// Render books in tasks.html
function renderBooks(booksList) {
    var $htmlTable = $('#bookTableBody');
    $htmlTable.empty();

    // Append a row for each book in the loaded books array
    booksList.forEach(function(book) {
        $htmlTable.append(`
            <tr data-id="${book.id}">
                <td>${book.code}</td>
                <td>${book.userNotes}</td>
                <td>${book.returnDate}</td>
                <td>${book.priority}</td>
                <td>${book.status}</td>
                <td>
                    <button class="btn btn-sm btn-primary edit-btn me-1" title="Edit book">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-success complete-btn me-1" title="Mark as returned">
                        <i class="bi bi-check-lg"></i>
                    </button>
                    <button class="btn btn-sm btn-danger delete-btn" title="Delete book">
                        <i class="bi bi-trash"></i>
                    </button>
                    <button class="btn btn-sm btn-warning" title="Download eBook">
                        <i class="bi bi-file-earmark-text"></i>
                    </button>
                    <button class="btn btn-sm btn-warning" title="Download Audio">
                        <i class="bi bi-headphones"></i>
                    </button>
                </td>
            </tr>
        `);
    });

    updatePage();
    renderKanban();
}

// Render Kanban board
function renderKanban() {
    var books = loadBooks();
    
    // Clear both columns
    $('#kanban-borrowed, #kanban-returned').empty();
    
    // Count books in each status
    var counts = { borrowed: 0, returned: 0 };
    
    // Loop through all books and add them to the correct column
    books.forEach(function(book) {
        var status = book.status;
        
        // Only process books that are borrowed or returned
        if (status === 'borrowed' || status === 'returned') {
            counts[status]++;
            
            // Create priority badge
            var priorityBadge = book.priority === 'high' ? '<span class="badge bg-danger">High</span>' : 
                                book.priority === 'medium' ? '<span class="badge bg-warning text-dark">Medium</span>' : 
                                '<span class="badge bg-info text-dark">Low</span>';
            
            // Create the card HTML
            var cardHTML = `
                <div class="kanban-card" draggable="true" data-id="${book.id}">
                    <div class="d-flex justify-content-between align-items-start mb-1">
                        <div class="card-title mb-0">${book.code}</div>
                        ${priorityBadge}
                    </div>
                    <div class="card-text">${book.userNotes || 'No notes'}</div>
                    <div class="small text-muted">${book.returnDate ? 'Due: ' + book.returnDate : 'No return date'}</div>
                </div>
            `;
            
            // Append to the correct column
            $('#kanban-' + status).append(cardHTML);
        }
    });
    
    // Update the count badges
    $('#count-borrowed').text(counts.borrowed);
    $('#count-returned').text(counts.returned);
}

function displayBooks() {
    var books = loadBooks();
    var searchText = $('#searchBook').val()
    var statusFilter = $('#filterStatus').val();
    var sortMethod = $('#sortBy').val();

    var filteredBooks = books.filter(function(book) {
        var matchesSearch = book.code.includes(searchText) || 
                            (book.userNotes && book.userNotes.includes(searchText));
        var matchesStatus = statusFilter === 'all' || book.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // 3. Sort the filtered books
    filteredBooks.sort(function(a, b) {
        if (sortMethod === 'newest') {
            return new Date(b.createdAt) - new Date(a.createdAt);
        } else if (sortMethod === 'oldest') {
            return new Date(a.createdAt) - new Date(b.createdAt);
        } else if (sortMethod === 'returnDate') {
            // Handle empty dates by pushing them to the end
            if (!a.returnDate) return 1;
            if (!b.returnDate) return -1;
            return new Date(a.returnDate) - new Date(b.returnDate);
        } else if (sortMethod === 'priority') {
            var priorityWeight = { 'high': 3, 'medium': 2, 'low': 1 };
            return priorityWeight[b.priority] - priorityWeight[a.priority];
        }
        return 0;
    });

    // 4. Render to the screen
    renderBooks(filteredBooks);
}

// "Edit Book" button functionality in tasks.html, shows the hidden modal and applies inputs to the book
$(document).on('click', '.edit-btn', function() {
    var bookId = $(this).closest('tr').data('id');
    var books = loadBooks();
    var book = books.find(b => b.id === bookId);
    
    if (book) {
        $('#editBookId').val(book.id);
        $('#editBookCode').val(book.code);
        $('#editUserNotes').val(book.userNotes);
        $('#editReturnDate').val(book.returnDate);
        $('#editBookPriority').val(book.priority);
        
        var editModal = new bootstrap.Modal(document.getElementById('editBookModal'));
        editModal.show();
    }
});

// Save button functionality in the edit book modal
$('#saveEditBookBtn').on('click', function() {
    var bookId = $('#editBookId').val();
    var books = loadBooks();
    var bookIndex = books.findIndex(b => b.id === bookId);
    
    if (bookIndex !== -1) {
        books[bookIndex].code = $('#editBookCode').val().trim();
        books[bookIndex].userNotes = $('#editUserNotes').val().trim();
        books[bookIndex].returnDate = $('#editReturnDate').val();
        books[bookIndex].priority = $('#editBookPriority').val();
        
        saveBooks(books);
        
        var modalEl = document.getElementById('editBookModal');
        var modal = bootstrap.Modal.getInstance(modalEl);
        modal.hide();
        
        displayBooks();
    }
});

// "Add Book" button functionality. Adds the input fields to localStorage books array
$('#bookForm').on('submit', function(e) {
    e.preventDefault();

    var code = $('#bookCode').val();
    var userNotes = $('#userNotes').val();
    var returnDate = $('#returnDate').val();
    var priority = $('#bookPriority').val();

    if(!code){
        alert('Please input a book code');
        return;
    }

    var newBook = {
        id: generateId(),
        code: code,
        userNotes: userNotes,
        returnDate: returnDate,
        priority: priority,
        status: 'borrowed',
        createdAt: new Date().toISOString()
    };

    var books = loadBooks();
    books.push(newBook);
    saveBooks(books);
    this.reset();
    displayBooks();
});

// Mark as returned button functionality
$(document).on('click', '.complete-btn', function() {
    var bookId = $(this).closest('tr').data('id');
    var books = loadBooks();
    
    books = books.map(function(book) {
        if (book.id === bookId) {
            book.status = book.status === 'returned' ? 'borrowed' : 'returned';
        }
        return book;
    });
    
    saveBooks(books);
    displayBooks();
});

// Delete button functionality
$(document).on('click', '.delete-btn', function() {
    if (!confirm('Are you sure you want to delete this book? You cannot re-add it if you do not have the code')) {
        return;
    }
    
    var bookId = $(this).closest('tr').data('id');
    var books = loadBooks();
    
    books = books.filter(function(book) {
        return book.id !== bookId;
    });
    
    saveBooks(books);
    displayBooks();
});

// Event listener for the search box, calls the function any of these elements has an input change
$('#searchBook, #filterStatus, #sortBy').on('input change', function() {
    displayBooks();
});

// Drag and drop functionality for Kanban
function setupKanbanDragDrop() {
    // When a card starts being dragged
    $(document).on('dragstart', '.kanban-card', function(e) {
        var bookId = $(this).data('id');
        e.originalEvent.dataTransfer.setData('text/plain', bookId);
        $(this).addClass('dragging');
    });
    
    // When dragging ends
    $(document).on('dragend', '.kanban-card', function() {
        $(this).removeClass('dragging');
        $('.kanban-column').removeClass('drag-over');
    });
    
    // When dragging over a column
    $(document).on('dragover', '.kanban-column', function(e) {
        e.preventDefault(); // Required to allow dropping
        $(this).addClass('drag-over');
    });
    
    // When leaving a column
    $(document).on('dragleave', '.kanban-column', function() {
        $(this).removeClass('drag-over');
    });
    
    // When dropping on a column
    $(document).on('drop', '.kanban-column', function(e) {
        e.preventDefault();
        $(this).removeClass('drag-over');
        
        var bookId = e.originalEvent.dataTransfer.getData('text/plain');
        var newStatus = $(this).attr('id').replace('kanban-', ''); // e.g., "kanban-borrowed" -> "borrowed"
        
        // Update the book's status
        var books = loadBooks();
        books = books.map(function(book) {
            if (book.id === bookId) {
                book.status = newStatus;
            }
            return book;
        });
        
        saveBooks(books);
        displayBooks();
    });
}

setupKanbanDragDrop();
displayBooks();
