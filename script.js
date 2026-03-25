const textInput = document.getElementById('text-input');
const charCount = document.getElementById('char-count');
const voiceSelect = document.getElementById('voice-select');
const rate = document.getElementById('rate');
const rateLabel = document.getElementById('rate-label');
const pitch = document.getElementById('pitch');
const pitchLabel = document.getElementById('pitch-label');
const processButton = document.getElementById('process-button');
const cardsContainer = document.getElementById('cards-container');

// Languages for playback and download link
const languages = [
    { name: 'Bangla (Bangladesh)', code: 'bn-BD', downloadCode: 'bn' },
    { name: 'English (US)', code: 'en-US', downloadCode: 'en' },
    { name: 'Hindi', code: 'hi-IN', downloadCode: 'hi' },
    { name: 'Arabic', code: 'ar-SA', downloadCode: 'ar' },
    { name: 'Spanish', code: 'es-ES', downloadCode: 'es' },
    { name: 'French', code: 'fr-FR', downloadCode: 'fr' }
];

function populateLanguages() {
    voiceSelect.innerHTML = '';
    languages.forEach(lang => {
        const option = document.createElement('option');
        option.textContent = lang.name;
        option.value = lang.code;
        option.setAttribute('data-download', lang.downloadCode);
        voiceSelect.appendChild(option);
    });
}

populateLanguages();

let synth = window.speechSynthesis;

// Update char count on input
textInput.addEventListener('input', () => {
    charCount.textContent = `${textInput.value.length} chars`;
});

// Function to split text into chunks of 180 chars without breaking words
function splitText(text, limit = 180) {
    const chunks = [];
    let start = 0;

    while (start < text.length) {
        let end = start + limit;
        if (end < text.length) {
            // Find last space to not break words
            const lastSpace = text.lastIndexOf(' ', end);
            if (lastSpace > start) {
                end = lastSpace;
            }
        }
        chunks.push(text.substring(start, end).trim());
        start = end;
    }
    return chunks.filter(c => c.length > 0);
}

function createCard(chunk, index) {
    const card = document.createElement('div');
    card.className = 'bg-[#1A1A1A] p-5 rounded-lg border border-gray-700 hover:border-[#D4AF37] transition-all duration-300 flex flex-col justify-between';
    
    const downloadLang = voiceSelect.selectedOptions[0].getAttribute('data-download');
    const downloadUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${downloadLang}&client=tw-ob&q=${encodeURIComponent(chunk)}`;

    card.innerHTML = `
        <div class="mb-4">
            <span class="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">Block #${index + 1}</span>
            <p class="text-sm text-gray-300 mt-2 leading-relaxed">${chunk}</p>
        </div>
        <div class="flex gap-3 mt-4">
            <button class="play-card-btn flex-1 bg-[#D4AF37] text-black font-bold py-2 px-4 rounded hover:shadow-[0_0_10px_#D4AF37] transition-all duration-300">
                Play
            </button>
            <a href="${downloadUrl}" target="_blank" download="sohag-tts-block-${index+1}.mp3" class="flex-1 border border-[#D4AF37] text-[#D4AF37] font-bold py-2 px-4 rounded hover:bg-[#D4AF37] hover:text-black transition-all duration-300 text-center text-sm">
                Download
            </a>
        </div>
    `;

    // Play functionality for this specific card
    card.querySelector('.play-card-btn').addEventListener('click', () => {
        if (synth.speaking) synth.cancel();
        const utterThis = new SpeechSynthesisUtterance(chunk);
        utterThis.lang = voiceSelect.value;
        utterThis.rate = parseFloat(rate.value);
        utterThis.pitch = parseFloat(pitch.value);
        synth.speak(utterThis);
    });

    return card;
}

processButton.addEventListener('click', () => {
    const text = textInput.value.trim();
    if (!text) {
        alert("দয়া করে কিছু টেক্সট লিখুন!");
        return;
    }

    const chunks = splitText(text);
    cardsContainer.innerHTML = ''; // Clear previous cards
    
    chunks.forEach((chunk, index) => {
        const card = createCard(chunk, index);
        cardsContainer.appendChild(card);
    });

    // Smooth scroll to results
    cardsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

rate.addEventListener('input', () => {
    rateLabel.textContent = rate.value;
});

pitch.addEventListener('input', () => {
    pitchLabel.textContent = pitch.value;
});

