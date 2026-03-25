const textInput = document.getElementById('text-input');
const voiceSelect = document.getElementById('voice-select');
const rate = document.getElementById('rate');
const rateLabel = document.getElementById('rate-label');
const pitch = document.getElementById('pitch');
const pitchLabel = document.getElementById('pitch-label');
const playButton = document.getElementById('play-button');
const downloadButton = document.getElementById('download-button');

// Google Translate TTS Supports these languages
const languages = [
    { name: 'Bangla (Bangladesh)', code: 'bn' },
    { name: 'English (US)', code: 'en' },
    { name: 'Hindi', code: 'hi' },
    { name: 'Arabic', code: 'ar' },
    { name: 'Spanish', code: 'es' },
    { name: 'French', code: 'fr' }
];

function populateLanguages() {
    voiceSelect.innerHTML = '';
    languages.forEach(lang => {
        const option = document.createElement('option');
        option.textContent = lang.name;
        option.value = lang.code;
        voiceSelect.appendChild(option);
    });
}

populateLanguages();

let audio = new Audio();

function speak() {
    const text = textInput.value.trim();
    if (!text) {
        alert("দয়া করে কিছু টেক্সট লিখুন!");
        return;
    }

    const lang = voiceSelect.value;
    // Google Translate TTS URL (Secret Hack)
    // Note: It has a character limit (~200 chars). For longer text, splitting is needed.
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang}&client=tw-ob`;

    audio.src = ttsUrl;
    audio.play();

    // Prepare download link
    downloadButton.href = ttsUrl;
    downloadButton.target = "_blank"; // Open in new tab if direct download is blocked
    downloadButton.setAttribute('download', 'sohag-tts-voice.mp3');
}

playButton.addEventListener('click', (event) => {
    event.preventDefault();
    speak();
});

downloadButton.addEventListener('click', (event) => {
    const text = textInput.value.trim();
    if (!text) {
        event.preventDefault();
        alert('আগে কিছু টেক্সট লিখে "Play Audio" বাটনে ক্লিক করুন।');
    }
    // Note: Some browsers might block cross-origin downloads from translate.google.com
    // In that case, the link will open in a new tab where user can right-click to save.
});

rate.addEventListener('input', () => {
    rateLabel.textContent = rate.value;
    // Note: Google Translate TTS doesn't support pitch/rate change via URL parameter easily
});

pitch.addEventListener('input', () => {
    pitchLabel.textContent = pitch.value;
});

