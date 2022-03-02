import { ILanguage } from './language';

export const AVAILABLE_LANGUAGES: Array<ILanguage> = [
  { code: 'ar-SA', shortCode: 'en', name: 'العَرَبِيَّة‎', enName: 'arabic', rtl: true },
  { code: 'zh-CN', shortCode: 'zh', name: '简化字', enName: 'chinese_sn', rtl: false },
  { code: 'zh-TW', shortCode: 'zh-tw', name: '正體字', enName: 'chinese_td', rtl: false },
  {
    code: 'en-GB',
    shortCode: 'en',
    name: 'English (UK)',
    enName: 'english_uk',
    rtl: false,
    defaults: ['en-AU', 'en-NZ']
  },
  { code: 'en-US', shortCode: 'en', name: 'English (US)', enName: 'english_us', rtl: false },
  { code: 'fr-FR', shortCode: 'fr', name: 'Français', enName: 'french', rtl: false },
  { code: 'ja-JP', shortCode: 'ja', name: '日本語', enName: 'japanese', rtl: false },
  { code: 'th-TH', shortCode: 'en', name: 'ไทย', enName: 'thai', rtl: false },
  { code: 'tr-TR', shortCode: 'tr', name: 'Türkçe', enName: 'turkish', rtl: false }
];

export const DEFAULT_LANGUAGE: ILanguage = AVAILABLE_LANGUAGES[4];
