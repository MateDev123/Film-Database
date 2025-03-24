// Filmek betöltése localStorage-ból
let movies = JSON.parse(localStorage.getItem('movies')) || [
    {
        name: "Oppenheimer",
        type: "Dráma",
        quality: "4k",
        image: "/api/placeholder/400/320"
    }
];

// Pagination variables
let currentPage = 1;
const moviesPerPage = 8;

function saveMovies() {
    localStorage.setItem('movies', JSON.stringify(movies));
}

// Form mód frissítése (új/szerkesztés)
let isEditing = false;
let editingIndex = null;

function updateFormMode(editing) {
    isEditing = editing;
    const formTitle = document.getElementById('formTitle');
    const addMovieBtn = document.getElementById('addMovieBtn');
    const btnContent = addMovieBtn.querySelector('.addmoviebtn-content'); // A teljes tartalom

    formTitle.textContent = editing ? 'Film szerkesztése' : 'Új film hozzáadása';

    // Frissítjük a gomb szövegét
    if (btnContent) {
        btnContent.innerHTML = editing 
            ? `<span class="material-symbols-outlined addmoviebtn-icon">save</span>Adatok mentése`
            : `<span class="material-symbols-outlined addmoviebtn-icon">add_circle</span>Film hozzáadása`;
    }
}


function openPopup() {
        document.querySelector('.gpopup-container').style.display = 'block';
        document.body.style.overflow = 'hidden'; // Görgetés letiltása
    }

    function closePopup() {
        document.querySelector('.gpopup-container').style.display = 'none';
        document.body.style.overflow = 'auto'; // Görgetés engedélyezése
        clearForm();
    }

    document.querySelector('.open-gpopup-button').addEventListener('click', openPopup);
    document.querySelector('.close-gpopup').addEventListener('click', closePopup);
    
    // Popup bezárása kattintásra a háttéren
    document.querySelector('.gpopup-container').addEventListener('click', (e) => {
        if (e.target === document.querySelector('.gpopup-container')) {
            closePopup();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closePopup();
        }
    });

function addOrUpdateMovie() {
    const name = document.getElementById('movieName').value;
    const type = document.getElementById('movieType').value;
    const quality = document.getElementById('movieQuality').value;
    const image = document.getElementById('movieImage').value;

    if (name && type && quality && image) {
        if (isEditing && editingIndex !== null) {
            movies[editingIndex] = { name, type, quality, image };
            updateFormMode(false);
            editingIndex = null;
        } else {
            movies.push({ name, type, quality, image });
        }
        saveMovies();
        renderMovies();
        clearForm();
        updateMovieCounter();
    } else {
        alert('Kérlek tölts ki minden mezőt!');
    }
}

function deleteMovie(index) {
    if (confirm('Biztosan törlöd a filmet?')) {
        movies.splice(index, 1);
        saveMovies();
        renderMovies();
        updateMovieCounter();
    }
}

function editMovie(index) {
    const movie = movies[index];
    document.getElementById('movieName').value = movie.name;
    document.getElementById('movieType').value = movie.type;
    document.getElementById('movieQuality').value = movie.quality;
    document.getElementById('movieImage').value = movie.image;
    
    // Előnézet frissítése
    const imagePreview = document.getElementById('imagePreview');
    const placeholder = document.getElementById('previewPlaceholder');
    const container = document.querySelector('.image-preview-container');

    imagePreview.src = movie.image;
    imagePreview.style.display = 'block';
    placeholder.style.display = 'none';

    // Kép méretének korlátozása szerkesztésnél is
    imagePreview.style.maxHeight = '250px';
    imagePreview.style.width = 'auto';
    imagePreview.style.objectFit = 'contain';
    
    container.style.height = '250px'; // Biztosítjuk, hogy ne nőjön nagyobbra

    editingIndex = index;
    updateFormMode(true);
    openPopup();
}
  // Módosítsuk a clearForm függvényt
    function clearForm() {
        document.getElementById('movieName').value = '';
        document.getElementById('movieType').value = 'Akció';
        document.getElementById('movieQuality').value = '4k';
        document.getElementById('movieImage').value = '';
        
        // Előnézet alaphelyzetbe állítása
        const imagePreview = document.getElementById('imagePreview');
        const placeholder = document.getElementById('previewPlaceholder');
        imagePreview.style.display = 'none';
        placeholder.style.display = 'flex';
        placeholder.innerHTML = `
            <span class="material-symbols-outlined" style="font-size: 48px;">image</span>
            <p>Kép előnézet</p>
        `;
        
        updateFormMode(false);
    }

function toggleMenu(index) {
    const allMenus = document.querySelectorAll('.popup-menu');
    allMenus.forEach((menu, i) => {
        if (i !== index) {
            menu.classList.remove('show-menu');
        }
    });
    
    const menu = document.getElementById(`menu-${index}`);
    menu.classList.toggle('show-menu');
}

document.getElementById('filterQuality').addEventListener('change', renderMovies);
    document.getElementById('filterType').addEventListener('change', renderMovies);

    function renderMovies() {
        const container = document.getElementById('moviesContainer');
        container.innerHTML = '';
        
        const searchValue = document.getElementById('searchInput').value.toLowerCase();
        const filterType = document.getElementById('filterType').value;
        const filterQuality = document.getElementById('filterQuality').value;
    
        const filteredMovies = movies.filter(movie => {
            return (
                (!filterType || movie.type === filterType) &&
                (!filterQuality || movie.quality === filterQuality) &&
                movie.name.toLowerCase().includes(searchValue)
            );
        });
    
        const totalPages = Math.max(1, Math.ceil(filteredMovies.length / moviesPerPage));
        currentPage = Math.min(currentPage, totalPages);
        
        const startIndex = (currentPage - 1) * moviesPerPage;
        const endIndex = Math.min(startIndex + moviesPerPage, filteredMovies.length);
        const moviesToShow = filteredMovies.slice(startIndex, endIndex);
    
        moviesToShow.forEach((movie, index) => {
            const originalIndex = movies.findIndex(m => 
                m.name === movie.name && 
                m.type === movie.type && 
                m.quality === movie.quality && 
                m.image === movie.image
            );
            
            const card = document.createElement('div');
            card.className = 'movie-card';
            
            let qualityIcon = '';
            switch (movie.quality) {
                case '4k+': qualityIcon = '<span class="material-symbols-outlined">4k_plus</span>'; break;
                case '4k': qualityIcon = '<span class="material-symbols-outlined">4k</span>'; break;
                case '1080p': qualityIcon = '<span class="material-symbols-outlined">full_hd</span>'; break;
                case '720p': qualityIcon = '<span class="material-symbols-outlined">hd</span>'; break;
                default: qualityIcon = '<span class="material-symbols-outlined">sd</span>';
            }
    
            card.innerHTML = `
                <img src="${movie.image}" alt="${movie.name}" class="movie-image" onclick="openModal('${movie.image}')">
                <div class="movie-info">
                    <h3>${movie.name}</h3>
                    <p>Típus: ${movie.type}</p>
                    <p>Minőség: ${qualityIcon}</p>
                </div>
                <div class="hamburger-menu" onclick="toggleMenu(this, ${index})">
                    <div class="hamburger-lines-container">
                        <div class="hamburger-line"></div>
                        <div class="hamburger-line"></div>
                        <div class="hamburger-line"></div>
                    </div>
                </div>
                <div class="popup-menu" id="menu-${index}">
                    <button onclick="editMovie(${originalIndex})">Szerkesztés</button>
                    <button class="delete-button" onclick="deleteMovie(${originalIndex})">Törlés</button>
                </div>
            `;
            container.appendChild(card);
    
            setTimeout(() => {
                const titleElement = card.querySelector('h3');
                if (movie.name.length > 30) {
                    titleElement.classList.add('long-title');
                }
            }, 0);
        });
    
        updatePaginationControls(totalPages);
    }

// Add this function to handle the menu toggle
function toggleMenu(element, index) {
    // Close all other open menus first
    document.querySelectorAll('.hamburger-menu.active').forEach(menu => {
        if (menu !== element) {
            menu.classList.remove('active');
            const menuId = menu.getAttribute('data-menu-id');
            if (menuId) {
                document.getElementById(`menu-${menuId}`).classList.remove('active');
            }
        }
    });

    // Toggle the clicked menu
    element.classList.toggle('active');
    document.getElementById(`menu-${index}`).classList.toggle('active');
}

// Add event listener to close menus when clicking outside
document.addEventListener('click', (event) => {
    if (!event.target.closest('.hamburger-menu') && !event.target.closest('.popup-menu')) {
        document.querySelectorAll('.hamburger-menu.active').forEach(menu => {
            menu.classList.remove('active');
        });
        document.querySelectorAll('.popup-menu.active').forEach(menu => {
            menu.classList.remove('active');
        });
    }
});

// Az input mező automatikus méretezése
document.getElementById('currentPageInput').addEventListener('input', function(e) {
    // Létrehozunk egy ideiglenes span elemet a szélesség kiszámításához
    const tempSpan = document.createElement('span');
    tempSpan.style.visibility = 'hidden';
    tempSpan.style.position = 'absolute';
    tempSpan.style.whiteSpace = 'pre';
    tempSpan.style.font = window.getComputedStyle(this).font;
    tempSpan.textContent = this.value || '0';
    document.body.appendChild(tempSpan);
    
    // Kiszámoljuk a szükséges szélességet és hozzáadunk egy kis extra helyet
    const width = tempSpan.getBoundingClientRect().width;
    this.style.width = `${Math.max(48, width + 16)}px`; // Minimum 48px szélesség
    
    document.body.removeChild(tempSpan);
});

        // Modal kezelő függvények
        function openModal(imageUrl) {
            const modal = document.getElementById('imageModal');
            const modalImg = document.getElementById('modalImage');
            modal.style.display = "block";
            modalImg.src = imageUrl;
            document.body.style.overflow = 'hidden'; // Görgetés letiltása
        }

        // Modal bezárása kattintásra
        const modal = document.getElementById('imageModal');
        const closeBtn = document.querySelector('.close-button');

        closeBtn.onclick = function() {
            closeModal();
        }

        modal.onclick = function(event) {
            if (event.target === modal) {
                closeModal();
            }
        }

        function closeModal() {
            const modal = document.getElementById('imageModal');
            modal.style.display = "none";
            document.body.style.overflow = 'auto'; // Görgetés visszaállítása
        }

        // ESC billentyű kezelése
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                closeModal();
            }
        });

function updatePaginationControls(totalPages) {
    const firstPageBtn = document.getElementById('firstPage');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const lastPageBtn = document.getElementById('lastPage');
    const currentPageInput = document.getElementById('currentPageInput');
    const totalPagesSpan = document.getElementById('totalPages');

    // Frissítjük az input mezőt és az összes oldalszámot
    currentPageInput.value = currentPage;
    totalPagesSpan.textContent = totalPages;
    
    // Frissítjük az input mező minimum és maximum értékét
    currentPageInput.min = 1;
    currentPageInput.max = totalPages;

    // Gombok állapotának frissítése
    firstPageBtn.disabled = currentPage === 1;
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;
    lastPageBtn.disabled = currentPage === totalPages;
}

// JSON letöltés funkció
function downloadMoviesAsJson() {
    const jsonData = JSON.stringify(movies, null, 4);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'movies.json';
    a.click();
    
    URL.revokeObjectURL(url);
}

// JSON feltöltés funkció
function uploadMoviesFromJson(event) {
    const fileInput = document.getElementById('uploadJsonInput');
    const file = fileInput.files[0];

    if (!file) {
        alert('Kérlek válassz ki egy JSON fájlt!');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const jsonData = JSON.parse(e.target.result);
            if (Array.isArray(jsonData) && jsonData.every(movie => movie.name && movie.type && movie.quality && movie.image)) {
                movies = jsonData;
                localStorage.setItem('movies', JSON.stringify(movies));
                currentPage = 1;
                renderMovies();
                updateMovieCounter();
                alert('A filmek sikeresen visszaálltak!');
            } else {
                throw new Error('A fájl formátuma nem megfelelő.');
            }
        } catch (error) {
            alert('Hiba a fájl feldolgozása közben: ' + error.message);
        }
    };
    reader.readAsText(file);
}

document.addEventListener('DOMContentLoaded', () => {
    // Popup handlers
    const popupButton = document.querySelector('.open-gpopup-button');
    const popupContainer = document.querySelector('.gpopup-container');
    const closePopupButton = document.querySelector('.close-gpopup');
    
    popupButton?.addEventListener('click', openPopup);
    closePopupButton?.addEventListener('click', closePopup);
    popupContainer?.addEventListener('click', (e) => {
        if (e.target === popupContainer) closePopup();
    });

    // Modal handlers
    const modal = document.getElementById('imageModal');
    const closeBtn = document.querySelector('.close-button');
    
    closeBtn?.addEventListener('click', closeModal);
    modal?.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.getElementById('filterQuality').addEventListener('change', () => {
    renderMovies();
    updateMovieCounter();
});

document.getElementById('filterType').addEventListener('change', () => {
    renderMovies();
    updateMovieCounter();
});

document.getElementById('searchInput').addEventListener('input', () => {
    renderMovies();
    updateMovieCounter();
});

    // Movie handlers
    const addMovieBtn = document.getElementById('addMovieBtn');
    const searchInput = document.getElementById('searchInput');
    const filterType = document.getElementById('filterType');

    addMovieBtn?.addEventListener('click', addOrUpdateMovie);
    searchInput?.addEventListener('input', () => {
        currentPage = 1;
        renderMovies();
    });
    filterType?.addEventListener('change', () => {
        currentPage = 1;
        renderMovies();
    });

    // Pagination handlers
    const paginationButtons = {
        first: document.getElementById('firstPage'),
        prev: document.getElementById('prevPage'),
        next: document.getElementById('nextPage'),
        last: document.getElementById('lastPage')
    };

    paginationButtons.first?.addEventListener('click', () => {
        currentPage = 1;
        renderMovies();
    });
    paginationButtons.prev?.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderMovies();
        }
    });
    paginationButtons.next?.addEventListener('click', () => {
        if (currentPage < Math.ceil(movies.length / moviesPerPage)) {
            currentPage++;
            renderMovies();
        }
    });
    paginationButtons.last?.addEventListener('click', () => {
        currentPage = Math.ceil(movies.length / moviesPerPage);
        renderMovies();
    });
     // JSON letöltés gomb kezelése
    const downloadJsonBtn = document.getElementById('downloadJsonBtn');
    downloadJsonBtn?.addEventListener('click', downloadMoviesAsJson);
});

// Oldalszám input kezelése
document.getElementById('currentPageInput').addEventListener('change', (e) => {
    let newPage = parseInt(e.target.value);
    const totalPages = Math.ceil(movies.length / moviesPerPage);
    
    // Ellenőrizzük, hogy érvényes-e a megadott oldalszám
    if (isNaN(newPage) || newPage < 1) {
        newPage = 1;
    } else if (newPage > totalPages) {
        newPage = totalPages;
    }
    
    currentPage = newPage;
    e.target.value = newPage; // Frissítjük az input mezőt a korrigált értékkel
    renderMovies();
});

    // JSON feltöltés gomb kezelése
    const uploadJsonBtn = document.getElementById('uploadJsonBtn');
const uploadJsonInput = document.getElementById('uploadJsonInput');

uploadJsonBtn?.addEventListener('click', () => {
    uploadJsonInput?.click();
});
    // Frissítsük az uploadJsonInput eseménykezelőjét
    document.getElementById('uploadJsonInput').addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            handleJsonFile(file);
        }
    });
    
// Megakadályozzuk, hogy az input mezőbe invalid értékeket írjanak
document.getElementById('currentPageInput').addEventListener('keypress', (e) => {
    // Csak számokat engedünk meg
    if (!/[0-9]/.test(e.key)) {
        e.preventDefault();
    }
});

// Focus elvesztésekor ellenőrizzük az értéket
document.getElementById('currentPageInput').addEventListener('blur', (e) => {
    if (e.target.value === '') {
        e.target.value = currentPage;
    }
});

// Dokumentum kattintás figyelése a menük bezárásához
document.addEventListener('click', (event) => {
    if (!event.target.closest('.hamburger-menu')) {
        const allMenus = document.querySelectorAll('.popup-menu');
        allMenus.forEach(menu => menu.classList.remove('show-menu'));
    }
});

// Érvényes filmek számolása
function updateMovieCounter() {
    const searchValue = document.getElementById('searchInput').value.toLowerCase();
    const filterType = document.getElementById('filterType').value;
    const filterQuality = document.getElementById('filterQuality').value;

    const filteredMovies = movies.filter(movie => {
        return (
            (!filterType || movie.type === filterType) &&
            (!filterQuality || movie.quality === filterQuality) &&
            movie.name.toLowerCase().includes(searchValue)
        );
    });

    document.getElementById('totalMovies').textContent = filteredMovies.length;
}


document.getElementById('movieImage').addEventListener('input', function(e) {
        const imageUrl = e.target.value;
        const imagePreview = document.getElementById('imagePreview');
        const container = document.querySelector('.image-preview-container');
        const placeholder = document.getElementById('previewPlaceholder');
        
        if (imageUrl) {
            imagePreview.src = imageUrl;
            imagePreview.onload = function() {
                // Állítsuk be a konténer méreteit a kép méretei alapján
                container.style.height = imagePreview.naturalHeight + 'px';
                container.style.minHeight = 'auto';
                
                // Mutassuk meg a képet
                imagePreview.style.display = 'block';
                placeholder.style.display = 'none';
                
                // Ha a kép túl nagy, igazítsuk a konténert
                if (imagePreview.naturalHeight > 250) {
                    container.style.height = '250px';
                    imagePreview.style.height = '100%';
                }
            };
            
            imagePreview.onerror = function() {
                // Hiba esetén alapértelmezett méret
                container.style.height = '200px';
                container.style.minHeight = '200px';
                imagePreview.style.display = 'none';
                placeholder.style.display = 'flex';
                placeholder.className = 'preview-placeholder error';
                placeholder.innerHTML = `
                    <span class="material-symbols-outlined" style="font-size: 28px; color: #ff4444;">error</span>
                    <p>Nem sikerült betölteni a képet</p>
                `;
            };
        } else {
            // Üres URL esetén alapértelmezett méret
            container.style.height = '200px';
            container.style.minHeight = '200px';
            imagePreview.style.display = 'none';
            placeholder.style.display = 'flex';
            placeholder.className = 'preview-placeholder';
            placeholder.innerHTML = `
                <span class="material-symbols-outlined" style="font-size: 48px;">image</span>
                <p>Kép előnézet</p>
            `;
        }
    });

    // Drag & Drop kezelése
    const dropZone = document.getElementById('jsonDropZone');
    
    dropZone.addEventListener('click', () => {
        document.getElementById('uploadJsonInput').click();
    });

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.add('dragover');
        });
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.remove('dragover');
        });
    });

    dropZone.addEventListener('drop', handleDrop);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const file = dt.files[0];
        
        if (file && file.type === 'application/json') {
            handleJsonFile(file);
        } else {
            alert('Csak JSON fájlt tölthetsz fel!');
        }
    }

    function handleJsonFile(file) {
        if (file.size > 5 * 1024 * 1024) { // 5MB
            alert('A fájl mérete nem lehet nagyobb 5MB-nál!');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const jsonData = JSON.parse(e.target.result);
                if (Array.isArray(jsonData) && jsonData.every(movie => 
                    movie.name && movie.type && movie.quality && movie.image)) {
                    movies = jsonData;
                    localStorage.setItem('movies', JSON.stringify(movies));
                    currentPage = 1;
                    renderMovies();
                    updateMovieCounter();
                    closePopup();
                    alert('A filmek sikeresen feltöltve!');
                } else {
                    throw new Error('Érvénytelen JSON formátum');
                }
            } catch (error) {
                alert('Hiba a fájl feldolgozása közben: ' + error.message);
            }
        };
        reader.readAsText(file);
    }
    

// Kezdeti számláló frissítése
renderMovies();
updateMovieCounter(); // <- Új sor
