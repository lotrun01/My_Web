// Language management
let currentLang: string = typeof localStorage !== 'undefined' ? (localStorage.getItem('language') || 'en') : 'en';

export function getCurrentLanguage(): string {
    return currentLang;
}

export function setLanguage(lang: string): void {
    currentLang = lang;
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem('language', lang);
    }

    // Dispatch custom event for components to update
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('languageChange', { detail: { lang } }));
    }
}

export function initLanguage(): void {
    if (typeof localStorage === 'undefined') return;

    // Set initial language from localStorage or default to Spanish
    const savedLang = localStorage.getItem('language') || 'es';
    currentLang = savedLang;

    // Update HTML lang attribute
    document.documentElement.lang = savedLang;
}

// Initialize on load
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        initLanguage();
    });
}
