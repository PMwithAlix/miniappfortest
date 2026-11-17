export type BaleWebApp = {
  initData?: string;
  initDataUnsafe?: { user?: { id?: number; first_name?: string; username?: string }; [key: string]: unknown };
  version?: string;
  platform?: string;
  colorScheme?: 'light' | 'dark';
  themeParams?: Record<string, string>;
  ready?: () => void;
  expand?: () => void;
  close?: () => void;
};
declare global { interface Window { Bale?: { WebApp?: BaleWebApp } } }

export function getBaleApp() { return window.Bale?.WebApp ?? null; }
export function initializeBaleApp() {
  const app = getBaleApp();
  try { app?.ready?.(); app?.expand?.(); } catch { /* Standalone browser preview is supported. */ }
  return app;
}
