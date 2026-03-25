import { setLanguage, getCurrentLanguage } from './language-manager';
import { translations } from '../data/translations.js';

// Define types for translations
type TranslationKey = keyof typeof translations;

function updateContent(lang: string) {
    // Cast strict to TranslationKey if we are sure, or default to a safe value
    const safeLang = (lang in translations ? lang : 'es') as TranslationKey;
    const t = translations[safeLang];

    // Update navigation
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (!key) return;

        const keys = key.split('.');
        let value: any = t; // Using any here for deep object traversal simplicity

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k as keyof typeof value];
            } else {
                value = undefined;
                break;
            }
        }

        if (value && typeof value === 'string') {
            el.textContent = value;
        }
    });

    // Update active language button
    document.querySelectorAll('.lang-text').forEach(span => {
        if (span.getAttribute('data-lang') === lang) {
            span.classList.add('active');
        } else {
            span.classList.remove('active');
        }
    });

    // Update HTML lang attribute
    document.documentElement.lang = lang;
}

// Initialize
const langButton = document.getElementById('lang-toggle');
const currentLang = getCurrentLanguage();
updateContent(currentLang);

// Toggle language on click
langButton?.addEventListener('click', () => {
    const newLang = getCurrentLanguage() === 'es' ? 'en' : 'es';
    setLanguage(newLang);
    updateContent(newLang);
});

// Listen for language changes from other components
window.addEventListener('languageChange', (e: Event) => {
    const customEvent = e as CustomEvent<{ lang: string }>;
    updateContent(customEvent.detail.lang);
});
