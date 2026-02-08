import { Injectable, signal, computed, effect } from '@angular/core';
import { Language, Translations } from './translation.types';
import { TRANSLATIONS_IT } from './translations.it';
import { TRANSLATIONS_EN } from './translations.en';

/**
 * Translation Service
 * Manages application language and provides translation functionality
 * Uses Angular signals for reactive language switching
 */
@Injectable({
    providedIn: 'root',
})
export class TranslationService {
    private readonly STORAGE_KEY = 'audio-store-language';
    private readonly DEFAULT_LANGUAGE: Language = 'it';

    // Translation maps
    private readonly translationMap: Record<Language, Translations> = {
        it: TRANSLATIONS_IT,
        en: TRANSLATIONS_EN,
    };

    // Reactive state
    private readonly _currentLanguage = signal<Language>(this.getInitialLanguage());

    // Public signals
    public readonly currentLanguage = this._currentLanguage.asReadonly();
    public readonly translations = computed(() => this.translationMap[this._currentLanguage()]);

    constructor() {
        // Persist language changes to localStorage
        effect(() => {
            const lang = this._currentLanguage();
            localStorage.setItem(this.STORAGE_KEY, lang);
        });
    }

    /**
     * Get initial language from localStorage or use default
     */
    private getInitialLanguage(): Language {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored === 'it' || stored === 'en') {
            return stored;
        }
        return this.DEFAULT_LANGUAGE;
    }

    /**
     * Set the current language
     * @param language - Language to set ('it' | 'en')
     */
    setLanguage(language: Language): void {
        this._currentLanguage.set(language);
    }

    /**
     * Toggle between Italian and English
     */
    toggleLanguage(): void {
        const current = this._currentLanguage();
        this.setLanguage(current === 'it' ? 'en' : 'it');
    }

    /**
     * Get translation for a specific key using dot notation
     * @param key - Translation key in dot notation (e.g., 'header.logoText')
     * @returns Translated string or the key itself if not found
     */
    translate(key: string): string {
        const keys = key.split('.');
        let value: any = this.translations();

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                // Return key if translation not found (for debugging)
                console.warn(`Translation key not found: ${key}`);
                return key;
            }
        }

        return typeof value === 'string' ? value : key;
    }

    /**
     * Get a specific translation section
     * Useful for components that need multiple translations from the same section
     */
    getSection<K extends keyof Translations>(section: K): Translations[K] {
        return this.translations()[section];
    }

    /**
     * Check if current language is Italian
     */
    isItalian(): boolean {
        return this._currentLanguage() === 'it';
    }

    /**
     * Check if current language is English
     */
    isEnglish(): boolean {
        return this._currentLanguage() === 'en';
    }

    /**
     * Get language display name
     */
    getLanguageDisplayName(): string {
        return this._currentLanguage() === 'it' ? 'Italiano' : 'English';
    }

    /**
     * Get language code for display (IT/EN)
     */
    getLanguageCode(): string {
        return this._currentLanguage().toUpperCase();
    }
}
