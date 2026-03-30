const supportedLangs = ["fr", "en", "de", "it", "es"]

function detectBrowserLang() {
    const lang = navigator.language
    return lang.split("-")[0]
}

function getInitialLanguage() {
    // 1. choix utilisateur
    const saved = localStorage.getItem("lang")
    if (saved && supportedLangs.includes(saved)) {
        return saved
    }

    // 2. navigateur
    const browserLang = detectBrowserLang()
    if (supportedLangs.includes(browserLang)) {
        return browserLang
    }

    // 3. fallback
    return "en"
}

let currentLang = getInitialLanguage()

function setLanguage(lang) {
    currentLang = lang
    localStorage.setItem("lang", lang)
    renderUI()
}

function t(key) {
    return translations[currentLang]?.[key]
        || translations["en"]?.[key]
        || key
}

function renderUI() {
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const [type, key] = el.dataset.i18n.split(":")
        if (type === "placeholder") {
            el.placeholder = t(key)
        } else {
            el.innerText = t(key)
        }
    })
}