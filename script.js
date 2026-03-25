const textInput = document.getElementById('text-input');
const voiceSelect = document.getElementById('voice-select');
const rate = document.getElementById('rate');
const rateLabel = document.getElementById('rate-label');
const pitch = document.getElementById('pitch');
const pitchLabel = document.getElementById('pitch-label');
const playButton = document.getElementById('play-button');
const downloadButton = document.getElementById('download-button');

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

function speak() {
    let text = textInput.value.trim();
    if (!text) {
        alert("দয়া করে কিছু টেক্সট লিখুন!");
        return;
    }

    // --- Part 1: Play with SpeechSynthesis API ---
    if (synth.speaking) {
        synth.cancel();
    }

    // Clean text for SpeechSynthesis (remove newlines for smoother reading)
    const cleanText = text.replace(/\n/g, ' ');

    const utterThis = new SpeechSynthesisUtterance(cleanText);
    utterThis.lang = voiceSelect.value;
    utterThis.rate = parseFloat(rate.value);
    utterThis.pitch = parseFloat(pitch.value);

    // Error handling for playback
    utterThis.onerror = (event) => {
        console.error("SpeechSynthesis Error:", event);
        alert("প্লে করতে সমস্যা হচ্ছে। ব্রাউজারটি রিফ্রেশ করে আবার চেষ্টা করুন।");
    };

    synth.speak(utterThis);

    // --- Part 2: Prepare Download Link (with 200 char limit check) ---
    const downloadLang = voiceSelect.selectedOptions[0].getAttribute('data-download');
    
    // Google TTS has a 200 character limit for the free link.
    // If text is longer, we warn the user.
    if (text.length > 200) {
        downloadButton.onclick = (e) => {
            e.preventDefault();
            alert("দুঃখিত! গুগলের ফ্রি সার্ভিস থেকে একবারে ২০০ অক্ষরের বেশি ডাউনলোড করা সম্ভব নয়। দয়া করে ছোট টেক্সট দিয়ে চেষ্টা করুন।");
        };
        downloadButton.href = "#";
    } else {
        // Clean text for URL (remove special characters that might cause malformed request)
        const urlText = encodeURIComponent(text.replace(/\n/g, ' '));
        const downloadUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${downloadLang}&client=tw-ob&q=${urlText}`;
        
        downloadButton.onclick = null; // Remove the alert if text is small enough
        downloadButton.href = downloadUrl;
        downloadButton.target = "_blank";
        downloadButton.setAttribute('download', 'sohag-tts-voice.mp3');
    }
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
});

rate.addEventListener('input', () => {
    rateLabel.textContent = rate.value;
});

pitch.addEventListener('input', () => {
    pitchLabel.textContent = pitch.value;
});

