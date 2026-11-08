# Выпуск в Google Play и App Store

Приложение — тот же сайт, упакованный Capacitor (`capacitor.config.ts`, папки `android/` и `ios/`). Код один; после каждого изменения сайта:

```bash
pnpm app:sync
```

(собирает сайт в `dist/` и копирует его в `android/` и `ios/`). Netlify эти папки не пересобирает.

## Что уже сделано в коде
- Capacitor 8, платформы Android и iOS, значки и заставки (`resources/`, `pnpm app:icons`).
- Напоминание о повторении: Settings → «Daily reminder» (видно только в приложении). Локальное уведомление, на 14 дней вперёд, день с выполненным планом пропускается (`src/services/reminders.ts`).
- Удаление аккаунта в приложении (`database/delete-account.sql` нужно запустить в Supabase).

## `appId` — менять только ДО первой загрузки в магазин
Сейчас `app.spellsprint.learn` (`capacitor.config.ts`). После публикации сменить нельзя. Если купите домен, принято писать его наоборот (`com.вашдомен.spellsprint`). После смены: `rm -rf android ios`, `pnpm exec cap add android`, `pnpm exec cap add ios`, `pnpm app:icons`, снова `pnpm app:sync`.

## Android (Google Play) — на вашем компьютере
1. Установить Android Studio (в комплекте JDK и SDK).
2. `pnpm app:sync`, затем `pnpm exec cap open android`, Run на эмуляторе или телефоне. Проверить: вход, практику, напоминание (включить, поставить время через 2 минуты).
3. Ключ подписи: Build → Generate Signed App Bundle → создать keystore. **Файл keystore и пароли хранить отдельно и в git не класть**: без них приложение не обновить.
4. Получить `.aab`, загрузить в Play Console (аккаунт $25).
5. Новый личный аккаунт: закрытое тестирование минимум 12 тестировщиков 14 дней, потом можно публиковать.

## iOS (App Store)
Нужен macOS с Xcode (свой Mac или облачная сборка Codemagic / GitHub Actions на macOS) и Apple Developer Program ($99 в год).
1. `pnpm app:sync`, `pnpm exec cap open ios`, в Xcode выбрать Team, включить Signing.
2. Archive → Distribute → App Store Connect.
3. Для проверяющих приложите тестовый аккаунт (почта и пароль) в App Review Information.

## Что требуют обе карточки
- Ссылка на политику конфиденциальности: `https://<домен>/#privacy`. Адрес для вопросов: `VITE_CONTACT_EMAIL` в Netlify.
- Скриншоты телефона (минимум 2, лучше 4–8), краткое и полное описание, категория «Education».
- Анкета данных: хранятся email и прогресс обучения, данные не продаются, не передаются рекламным сервисам; удаление аккаунта есть в приложении.
- Возраст: без насилия и азартных игр; регистрация через email. Если разрешены дети до 13, придётся пройти программу для детей: проще указать 13+.

## Известные задачи
- Ссылки из писем открывают приложение через `spellsprint://auth` (код: `startAppLinks` в `supabase.ts`, фильтр в `AndroidManifest.xml`, `CFBundleURLTypes` в `Info.plist`). Нужен один шаг в панели Supabase: `docs/launch-setup.md`, пункт 3a. Проверить на телефоне: регистрация → письмо → ссылка открывает приложение и входит; то же для сброса пароля. Для настоящих App Links (https) позже понадобится домен.
- Иконка-заглушка, если не проверены `android/app/src/main/res/mipmap-*`: пересоздаётся `pnpm app:icons`.
