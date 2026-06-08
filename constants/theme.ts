/** Единые токены цветов — светлая и тёмная палитры. Семантика строк (пропуск, пожар и т.д.) см. semanticLineColors. */

export type SchemeName = 'light' | 'dark';

export interface AppPalette {
  scheme: SchemeName;
  headerGradient: readonly [string, string, string];
  mainGradient: readonly [string, string, string];
  textOnHeader: string;
  headerIconTint: string;
  modalBackdrop: string;
  modalSurface: string;
  modalBorderSubtle: string;
  modalTitle: string;
  modalMuted: string;
  modalPrimaryText: string;
  modalLink: string;
  modalDivider: string;
  closeHint: string;
  panelBg: string;
  panelBorder: string;
  panelShadow: string;
  primaryButton: string;
  primaryButtonDanger: string;
  textOnPrimary: string;
  borderOnPrimary: string;
  buttonInsetShadow: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  inputBorder: string;
  inputBg: string;
  inputText: string;
  inputPlaceholder: string;
  inputLabel: string;
  inputErrorBg: string;
  inputMuted: string;
  dropdownBg: string;
  modalGlass: string;
  modalGlassWarn: string;
  modalGlassBorder: string;
  modalTitleStrong: string;
  modalTitleWarn: string;
  /** Основной текст описания в предупреждающем модале (LOG, сброс и т.п.) */
  modalWarnBody: string;
  modalWarnBodyMuted: string;
  modalWarnRule: string;
  modalWarnCodeBg: string;
  modalWarnCodeText: string;
  modalWarnCodeBorder: string;
  modalBodyMuted: string;
  modalActionBlue: string;
  iosBlueTint: string;
  overlayStrong: string;
  listRowBg: string;
  listRowBorder: string;
  listRowText: string;
  listSelectedBg: string;
  listSelectedText: string;
  /** Фон «карточки» со списком запомненных устройств */
  listWindowBg: string;
  listWindowBorder: string;
  checkboxChecked: string;
  loadingSpinner: string;
  loadingTextOnGradient: string;
  loadingOverlayBg: string;
  screenTitle: string;
  /** Подстрочники на главной и экранах с градиентом */
  screenMutedText: string;
  /** Крупные заголовки разделов (конфиг, события, команды…) — заметнее и светлее основного текста */
  sectionHeading: string;

  rememberedPaneBg: string;
  rememberedFooterBg: string;

  glassModalHeading: string;
  glassModalBody: string;

  /** Текст на главном экране (блок статуса) */
  homeSubtleText: string;

  modalFormInk: string;
  modalFormRule: string;

  cardTint: string;
  cardBorder: string;
  cardShadowSoft: string;
  iconButtonBorder: string;
  blurTint: 'light' | 'dark';

  /** Карточки с иконкой (квадратные кнопки на главной) */
  squareCardBg: string;
  squareCardBorder: string;
  squareCardText: string;
  squareCardYellowBg: string;
  squareCardYellowBorder: string;
  squareCardYellowText: string;
  squareCardShadow: string;
}

/** Цветовые коды статусов (проходы, ошибки…) — сохранены как в текущем UI. */
export const semanticLineColors = {
  padDefaultBg: '#adc4ff31',
  padDefaultBorder: '#00047060',
  padDefaultShadow: '0px 2px 4px rgba(0, 0, 0, 0.25), inset -3px -3px 15px rgba(0, 0, 0, 0.25)',
  yellowBorder: '#ab7500c0',
  yellowBg: '#fff7b29d',
  yellowText: '#ab7500c0',
  greenBorder: '#254426a6',
  greenBg: '#a3eca7a8',
  greenText: '#254426c2',
  orangeBorder: '#ab7500c0',
  orangeBg: '#ffcd82ad',
  orangeText: '#ab7500da',
  redBorder: '#a70707bd',
  redBg: '#ff3f3f8e',
  redText: '#7c0707d2',
  blueBorder: '#32117Ac0',
  blueBg: '#82DCFF9d',
  blueText: '#32117Ac0',
  limeBorder: '#457A11c0',
  limeBg: '#85f1a7ab',
  limeText: '#457A11c0',
  defaultTextMuted: '#000670a8',
} as const;

export type SemanticLineColors = {
  [K in keyof typeof semanticLineColors]: string;
};

/** Семантика строк списка физ. контактов и событий — тёмная тема (светлый контрастный текст). */
export const semanticLineColorsDark: SemanticLineColors = {
  padDefaultBg: 'rgba(100, 140, 255, 0.22)',
  padDefaultBorder: 'rgba(140, 170, 255, 0.48)',
  padDefaultShadow:
    '0px 2px 6px rgba(0, 0, 0, 0.45), inset -3px -3px 15px rgba(0, 0, 0, 0.35)',
  yellowBorder: 'rgba(255, 190, 100, 0.7)',
  yellowBg: 'rgba(72, 48, 18, 0.72)',
  yellowText: '#ffe8b8',
  greenBorder: 'rgba(130, 230, 150, 0.6)',
  greenBg: 'rgba(28, 68, 38, 0.72)',
  greenText: '#c8f5d0',
  orangeBorder: 'rgba(255, 170, 90, 0.7)',
  orangeBg: 'rgba(72, 44, 14, 0.72)',
  orangeText: '#ffd8a8',
  redBorder: 'rgba(255, 110, 110, 0.7)',
  redBg: 'rgba(72, 22, 22, 0.72)',
  redText: '#ffc8c8',
  blueBorder: 'rgba(110, 150, 255, 0.6)',
  blueBg: 'rgba(28, 48, 88, 0.72)',
  blueText: '#c4dcff',
  limeBorder: 'rgba(160, 235, 130, 0.6)',
  limeBg: 'rgba(36, 68, 22, 0.72)',
  limeText: '#d4f5b8',
  defaultTextMuted: '#eef2fc',
};

export function getSemanticLineColors(scheme: SchemeName): SemanticLineColors {
  return scheme === 'dark' ? semanticLineColorsDark : semanticLineColors;
}

export function createLightPalette(): AppPalette {
  return {
    scheme: 'light',
    headerGradient: ['#1A2253', '#0F1987', '#008CC8'],
    mainGradient: ['#DDE3F2', '#F6F9FF', '#CFD8EE'],
    textOnHeader: '#fcfcfcbd',
    headerIconTint: 'rgba(252, 252, 252, 0.85)',
    modalBackdrop: 'rgba(0, 0, 0, 0.45)',
    modalSurface: '#f5f8fc',
    modalBorderSubtle: 'rgba(26, 34, 83, 0.12)',
    modalTitle: '#4d5f8a',
    modalMuted: '#7f8cb0',
    modalPrimaryText: '#52608f',
    modalLink: '#008CC8',
    modalDivider: 'rgba(26, 34, 83, 0.12)',
    closeHint: '#5a6488',
    panelBg: '#ffffff33',
    panelBorder: '#000670d0',
    panelShadow: '0px 0px 4px rgba(0, 0, 0, 0.1)',
    primaryButton: '#0375BB',
    primaryButtonDanger: '#BB0306',
    textOnPrimary: '#FFFFFF',
    borderOnPrimary: '#ffffff94',
    buttonInsetShadow:
      '0px 2px 4px rgba(0, 0, 0, 0.25), inset -3px -3px 15px rgba(0, 0, 0, 0.25)',
    textPrimary: '#1A2253',
    textSecondary: '#5a6488',
    textTertiary: '#1a225381',
    inputBorder: '#1a225381',
    inputBg: '#96ced43d',
    inputText: '#1A2253',
    inputPlaceholder: 'rgba(26, 34, 83, 0.28)',
    inputLabel: '#1a225381',
    inputErrorBg: '#ffe6e6',
    inputMuted: '#999999',
    dropdownBg: '#c3dde03d',
    modalGlass: 'rgba(255, 255, 255, 0.78)',
    modalGlassWarn: 'rgba(255, 237, 220, 0.72)',
    modalGlassBorder: 'rgba(255, 255, 255, 0.62)',
    modalTitleStrong: '#4e6088',
    modalTitleWarn: '#580000e1',
    modalWarnBody: '#580000',
    modalWarnBodyMuted: '#58000099',
    modalWarnRule: '#580000',
    modalWarnCodeBg: '#fff8f0',
    modalWarnCodeText: '#1a1a1a',
    modalWarnCodeBorder: '#58000033',
    modalBodyMuted: '#697591',
    modalActionBlue: '#007AFF',
    iosBlueTint: '#007AFF',
    overlayStrong: 'rgba(0, 0, 0, 0.5)',
    listRowBg: '#ffffffe0',
    listRowBorder: '#1A2253',
    listRowText: '#1A2253',
    listSelectedBg: '#0A3A99',
    listSelectedText: '#ffffffe0',
    listWindowBg: 'rgba(38, 78, 120, 0.24)',
    listWindowBorder: '#00067033',
    checkboxChecked: '#4630EB',
    loadingSpinner: '#008CC8',
    loadingTextOnGradient: '#fff',
    loadingOverlayBg: 'rgba(255, 255, 255, 0.21)',
    screenTitle: '#7686b8',
    screenMutedText: '#8e9bc9',
    sectionHeading: '#6f80b0',
    rememberedPaneBg: 'rgba(38, 78, 120, 0.24)',
    rememberedFooterBg: 'rgba(32, 72, 110, 0.28)',
    glassModalHeading: '#4f638c',
    glassModalBody: '#6e7c94',
    homeSubtleText: '#8794c4',
    modalFormInk: '#5f6f94',
    modalFormRule: 'rgba(80, 100, 150, 0.32)',
    cardTint: '#adc4ff31',
    cardBorder: '#00067057',
    cardShadowSoft: '0px 0px 4px rgba(0, 0, 0, 0.1)',
    iconButtonBorder: '#00067057',
    blurTint: 'light',
    squareCardBg: '#FFFFFF',
    squareCardBorder: '#000670c2',
    squareCardText: '#000670c2',
    squareCardYellowBg: '#FFE7C3',
    squareCardYellowBorder: '#703A00',
    squareCardYellowText: '#703A00',
    squareCardShadow: '0px 0px 4px #0000003d',
  };
}

export function createDarkPalette(): AppPalette {
  return {
    scheme: 'dark',
    headerGradient: ['#0d1028', '#0a1248', '#005a82'],
    mainGradient: ['#121725', '#1a2135', '#0f1628'],
    textOnHeader: 'rgba(252, 252, 252, 0.92)',
    headerIconTint: 'rgba(252, 252, 252, 0.9)',
    modalBackdrop: 'rgba(0, 0, 0, 0.65)',
    modalSurface: '#1c2438',
    modalBorderSubtle: 'rgba(180, 196, 255, 0.15)',
    modalTitle: '#eef2fb',
    modalMuted: '#b8c7e8',
    modalPrimaryText: '#e8edfc',
    modalLink: '#5ec8ff',
    modalDivider: 'rgba(180, 196, 255, 0.12)',
    closeHint: '#96a3c4',
    panelBg: 'rgba(30, 40, 72, 0.55)',
    panelBorder: 'rgba(140, 170, 255, 0.35)',
    panelShadow: '0px 0px 12px rgba(0, 0, 0, 0.45)',
    primaryButton: '#1a8fd4',
    primaryButtonDanger: '#e04548',
    textOnPrimary: '#FFFFFF',
    borderOnPrimary: 'rgba(255,255,255,0.35)',
    buttonInsetShadow:
      '0px 2px 4px rgba(0, 0, 0, 0.45), inset -3px -3px 15px rgba(0, 0, 0, 0.35)',
    textPrimary: '#e8ecf8',
    textSecondary: '#b0bbd8',
    textTertiary: 'rgba(200, 214, 255, 0.82)',
    inputBorder: 'rgba(140, 170, 230, 0.45)',
    inputBg: 'rgba(36, 48, 80, 0.65)',
    inputText: '#e8ecf8',
    inputPlaceholder: 'rgba(200, 214, 255, 0.35)',
    inputLabel: 'rgba(200, 214, 255, 0.82)',
    inputErrorBg: 'rgba(80, 30, 30, 0.45)',
    inputMuted: '#8899b8',
    dropdownBg: 'rgba(36, 48, 80, 0.55)',
    modalGlass: 'rgba(26, 34, 58, 0.82)',
    modalGlassWarn: 'rgba(58, 48, 36, 0.78)',
    modalGlassBorder: 'rgba(200, 210, 255, 0.22)',
    modalTitleStrong: '#eef1ff',
    modalTitleWarn: '#ffb0b0',
    modalWarnBody: '#f5e6d8',
    modalWarnBodyMuted: 'rgba(245, 228, 212, 0.72)',
    modalWarnRule: 'rgba(255, 190, 150, 0.45)',
    modalWarnCodeBg: 'rgba(22, 18, 14, 0.92)',
    modalWarnCodeText: '#ebe4dc',
    modalWarnCodeBorder: 'rgba(255, 170, 110, 0.28)',
    modalBodyMuted: '#cdd6ea',
    modalActionBlue: '#4da3ff',
    iosBlueTint: '#4da3ff',
    overlayStrong: 'rgba(0, 0, 0, 0.65)',
    listRowBg: 'rgba(32, 44, 72, 0.85)',
    listRowBorder: 'rgba(130, 160, 240, 0.45)',
    listRowText: '#e8ecf8',
    listSelectedBg: '#2563b8',
    listSelectedText: 'rgba(255, 255, 255, 0.96)',
    listWindowBg: 'rgba(32, 52, 92, 0.65)',
    listWindowBorder: 'rgba(130, 160, 230, 0.22)',
    checkboxChecked: '#6b8cff',
    loadingSpinner: '#5ec8ff',
    loadingTextOnGradient: '#e8ecf8',
    loadingOverlayBg: 'rgba(12, 16, 28, 0.45)',
    screenTitle: '#dde5fb',
    screenMutedText: 'rgba(200, 210, 248, 0.92)',
    sectionHeading: '#d0dbf6',
    rememberedPaneBg: 'rgba(20, 28, 54, 0.55)',
    rememberedFooterBg: 'rgba(20, 28, 54, 0.55)',
    glassModalHeading: '#f2f5ff',
    glassModalBody: '#d9e0f4',
    homeSubtleText: 'rgba(190, 204, 240, 0.95)',
    modalFormInk: 'rgba(215, 224, 250, 0.96)',
    modalFormRule: 'rgba(170, 190, 240, 0.28)',
    cardTint: 'rgba(100, 140, 255, 0.18)',
    cardBorder: 'rgba(140, 170, 255, 0.28)',
    cardShadowSoft: '0px 0px 6px rgba(0, 0, 0, 0.35)',
    iconButtonBorder: 'rgba(140, 170, 230, 0.35)',
    blurTint: 'dark',
    squareCardBg: 'rgba(40, 52, 88, 0.9)',
    squareCardBorder: 'rgba(140, 170, 255, 0.42)',
    squareCardText: 'rgba(220, 230, 255, 0.95)',
    squareCardYellowBg: 'rgba(90, 60, 24, 0.75)',
    squareCardYellowBorder: '#c9883a',
    squareCardYellowText: '#ffd699',
    squareCardShadow: '0px 0px 10px rgba(0, 0, 0, 0.45)',
  };
}
