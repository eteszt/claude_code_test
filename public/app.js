const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const searchBtn = document.getElementById('searchBtn');
const errorDiv = document.getElementById('error');
const searchResultsDiv = document.getElementById('searchResults');
const videoListDiv = document.getElementById('videoList');
const resultCountSpan = document.getElementById('resultCount');
const videoDetailsDiv = document.getElementById('videoDetails');
const backBtn = document.getElementById('backBtn');

let currentResults = [];

// Keresés form submit
searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const query = searchInput.value.trim();
    const sortBy = sortSelect.value;
    if (!query) return;

    setLoading(true);
    hideError();
    hideSearchResults();
    hideVideoDetails();

    try {
        const response = await fetch('/api/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query, sortBy })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Hiba történt');
        }

        currentResults = data.results;
        displaySearchResults(data.results);

    } catch (error) {
        showError(error.message);
    } finally {
        setLoading(false);
    }
});

// Vissza gomb
backBtn.addEventListener('click', () => {
    hideVideoDetails();
    showSearchResults();
});

function setLoading(loading) {
    const btnText = searchBtn.querySelector('.btn-text');
    const loader = searchBtn.querySelector('.loader');

    if (loading) {
        searchBtn.disabled = true;
        btnText.style.display = 'none';
        loader.style.display = 'inline-block';
    } else {
        searchBtn.disabled = false;
        btnText.style.display = 'inline';
        loader.style.display = 'none';
    }
}

function showError(message) {
    errorDiv.textContent = `❌ ${message}`;
    errorDiv.style.display = 'block';
}

function hideError() {
    errorDiv.style.display = 'none';
}

function hideSearchResults() {
    searchResultsDiv.style.display = 'none';
}

function showSearchResults() {
    searchResultsDiv.style.display = 'block';
}

function hideVideoDetails() {
    videoDetailsDiv.style.display = 'none';
}

function displaySearchResults(results) {
    if (results.length === 0) {
        showError('Nem találhatók eredmények');
        return;
    }

    // Eredmények számának beállítása
    resultCountSpan.textContent = results.length;

    // Lista kiürítése
    videoListDiv.innerHTML = '';

    // Videó kártyák létrehozása
    results.forEach((video, index) => {
        const card = document.createElement('div');
        card.className = 'video-card';
        card.onclick = () => window.open(video.url, '_blank');

        card.innerHTML = `
            <img src="${video.thumbnail}" alt="${video.title}" class="video-card-thumbnail">
            <div class="video-card-info">
                <div>
                    <div class="video-card-title">${video.title}</div>
                    <div class="video-card-author">📺 ${video.author}</div>
                </div>
                <div class="video-card-meta">
                    <span>⏱️ ${video.duration}</span>
                    <span>👁️ ${formatViewCount(video.viewCount)}</span>
                    <span>📅 ${video.uploadedAt}</span>
                </div>
            </div>
        `;

        videoListDiv.appendChild(card);
    });

    showSearchResults();
    searchResultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

async function showVideoDetails(url) {
    hideSearchResults();

    // Megkeressük a videót az eredmények között
    const video = currentResults.find(v => v.url === url);

    if (video) {
        // Ha megvan a keresési eredményekben, használjuk azt
        displayVideoDetailsFromSearch(video);
    } else {
        // Ha nincs (nem kellene előfordulnia), próbáljuk lekérni az API-ból
        setLoading(true);
        try {
            const response = await fetch('/api/video-info', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Hiba történt');
            }

            displayVideoDetails(data);

        } catch (error) {
            showError(error.message);
            showSearchResults();
        } finally {
            setLoading(false);
        }
    }
}

function displayVideoDetailsFromSearch(video) {
    // A keresési eredményből kapott videó részletek használata
    document.getElementById('thumbnail').src = video.thumbnail;
    document.getElementById('thumbnail').alt = video.title;

    document.getElementById('title').textContent = video.title;
    document.getElementById('author').textContent = `📺 ${video.author}`;

    document.getElementById('views').textContent = formatViewCount(video.viewCount);
    document.getElementById('likes').textContent = 'N/A'; // Keresésből nem jön
    document.getElementById('duration').textContent = video.duration;
    document.getElementById('uploadDate').textContent = video.uploadedAt;

    document.getElementById('description').textContent = 'Nincs elérhető részletes leírás';

    document.getElementById('videoId').textContent = video.videoId;
    document.getElementById('category').textContent = 'N/A';
    document.getElementById('channel').textContent = video.author;

    document.getElementById('keywordsSection').style.display = 'none';
    document.getElementById('videoLink').href = video.url;

    videoDetailsDiv.style.display = 'block';
    videoDetailsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function displayVideoDetails(data) {
    // Thumbnail
    document.getElementById('thumbnail').src = data.thumbnail;
    document.getElementById('thumbnail').alt = data.title;

    // Cím és csatorna
    document.getElementById('title').textContent = data.title;
    document.getElementById('author').textContent = `📺 ${data.author}`;

    // Statisztikák
    document.getElementById('views').textContent = data.viewCount.toLocaleString('hu-HU');
    document.getElementById('likes').textContent = data.likes
        ? data.likes.toLocaleString('hu-HU')
        : 'N/A';
    document.getElementById('duration').textContent = data.duration;
    document.getElementById('uploadDate').textContent = data.uploadDate;

    // Leírás
    const description = data.description && data.description.length > 500
        ? data.description.substring(0, 500) + '...'
        : (data.description || 'Nincs elérhető leírás');
    document.getElementById('description').textContent = description;

    // További információk
    document.getElementById('videoId').textContent = data.videoId;
    document.getElementById('category').textContent = data.category;
    document.getElementById('channel').textContent = data.channelName;

    // Címkék
    const keywordsSection = document.getElementById('keywordsSection');
    const keywordsDiv = document.getElementById('keywords');

    if (data.keywords && data.keywords.length > 0) {
        keywordsDiv.innerHTML = '';
        data.keywords.slice(0, 15).forEach(keyword => {
            const tag = document.createElement('span');
            tag.className = 'tag';
            tag.textContent = keyword;
            keywordsDiv.appendChild(tag);
        });
        keywordsSection.style.display = 'block';
    } else {
        keywordsSection.style.display = 'none';
    }

    // Link
    document.getElementById('videoLink').href = data.url;

    // Részletek megjelenítése
    videoDetailsDiv.style.display = 'block';
    videoDetailsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function formatViewCount(count) {
    if (count >= 1000000) {
        return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
        return (count / 1000).toFixed(1) + 'K';
    }
    return count.toLocaleString('hu-HU');
}

// URL beillesztéskor automatikusan kitöltés
searchInput.addEventListener('paste', () => {
    setTimeout(() => {
        searchInput.value = searchInput.value.trim();
    }, 10);
});

// Keresési tippek toggle
const tipsToggle = document.getElementById('tipsToggle');
const tipsContent = document.getElementById('tipsContent');
const toggleIcon = document.querySelector('.toggle-icon');

tipsToggle.addEventListener('click', () => {
    tipsContent.classList.toggle('open');
    toggleIcon.classList.toggle('open');
});

// Gyors keresési gombok
document.querySelectorAll('.quick-search').forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const query = button.getAttribute('data-query');
        searchInput.value = query;
        searchForm.dispatchEvent(new Event('submit'));
    });
});
