const form = document.getElementById('videoForm');
const urlInput = document.getElementById('urlInput');
const searchBtn = document.getElementById('searchBtn');
const errorDiv = document.getElementById('error');
const resultsDiv = document.getElementById('results');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const url = urlInput.value.trim();
    if (!url) return;

    // UI állapot beállítása - betöltés
    setLoading(true);
    hideError();
    hideResults();

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

        // Sikeres válasz - adatok megjelenítése
        displayResults(data);

    } catch (error) {
        showError(error.message);
    } finally {
        setLoading(false);
    }
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

function hideResults() {
    resultsDiv.style.display = 'none';
}

function displayResults(data) {
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
    const description = data.description.length > 500
        ? data.description.substring(0, 500) + '...'
        : data.description;
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

    // Eredmények megjelenítése
    resultsDiv.style.display = 'block';

    // Scroll az eredményekhez
    resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// URL beillesztéskor automatikusan kitöltés
urlInput.addEventListener('paste', () => {
    setTimeout(() => {
        urlInput.value = urlInput.value.trim();
    }, 10);
});
