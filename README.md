# Alkify Music 🎵 - React Frontend

[![React](https://img.shields.io/badge/React-19+-61DAFB.svg?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6+-646CFF.svg?logo=vite)](https://vitejs.dev/)

Фронтенд музыкальной платформы Alkify Music с интеграцией **самописного Alkify API**. Полнофункциональный плеер, поиск и возможность добавления собственных треков.

> 🔥 **Собственный API сервер**: [alkify-music-api](https://github.com/alkmanistik/alkify-music-api)  
> Написан на Spring Boot с использованием Java 21, обеспечивает весь функционал платформы

## 📌 Основные возможности

- 🎧 Воспроизведение треков через собственный плеер
- 🔍 Поиск по трекам, альбомам и исполнителям
- ➕ Добавление собственных треков (MP3/WAV)
- 📚 Управление плейлистами
- 🔐 Аутентификация через JWT
- 🎨 Адаптивный интерфейс

## 🖼️ Скриншоты интерфейса

<div align="center">
  <img src="https://github.com/alkmanistik/alkify-music-react/blob/166ed5e7964f2a16d84065113c6e3591864e5540/preview/HomePage.png" width="400" alt="Home Page"/>
  <img src="https://github.com/alkmanistik/alkify-music-react/blob/166ed5e7964f2a16d84065113c6e3591864e5540/preview/ArtistPage.png" width="400" alt="Artist Page"/>
  <br/>
  <img src="https://github.com/alkmanistik/alkify-music-react/blob/166ed5e7964f2a16d84065113c6e3591864e5540/preview/SearchPage.png" width="400" alt="Search Page"/>
  <img src="https://github.com/alkmanistik/alkify-music-react/blob/166ed5e7964f2a16d84065113c6e3591864e5540/preview/AdminPanel.png" width="400" alt="Admin Panel"/>
</div>

## 🚀 Технологический стек

- **Frontend**:
  - React 19+
  - TypeScript 5+
  - Vite 6+
- **Стилизация**:
  - CSS Modules / TailwindCSS
- **API**:
  - Axios для HTTP-запросов

## 🚀 Установка и запуск
### Файл переменных окружения (.env)
```
VITE_API_URL=
```
