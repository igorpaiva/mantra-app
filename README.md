# <img src="./mantra-frontend/src/assets/mantra-logo-login.svg" alt="Mantra-logo" width="100" height="50"> Mantra - Flashcards App

> **Repeat it until you memorize it!**

Mantra is a modern web flashcards application that helps you memorize any content through repetition. With an intuitive interface, Mantra makes learning more efficient and fun.

[![Angular](https://img.shields.io/badge/Angular-19-DD0031?style=flat&logo=angular&logoColor=white)](https://angular.io/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.2-6DB33F?style=flat&logo=spring&logoColor=white)](https://spring.io/projects/spring-boot)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Java](https://img.shields.io/badge/Java-21-ED8B00?style=flat&logo=java&logoColor=white)](https://openjdk.java.net/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

## ✨ Features

### 🎯 **Flashcards**
- Create custom decks with unlimited cards
- Full **Markdown** support for advanced formatting
- Visual editor with toolbar for formatting (bold, italic, lists, headings)
- Real-time preview of formatted content

### 📱 **Responsive Interface**
- Modern and intuitive design
- Optimized navigation for desktop and mobile
- Swipe gestures for card navigation (mobile)
- Smooth card flip animations
- Custom theme with vibrant colors

### 🔐 **Authentication System**
- Secure login and registration
- JWT authentication
- Route protection
- Session management

### 💾 **Data Management**
- Complete CRUD for decks and cards
- PostgreSQL database persistence
- Real-time synchronization
- Automatic backup

### 🎨 **User Experience**
- Collapsible sidebar for navigation
- Progress counters during study sessions
- Visual feedback and notifications
- PWA (Progressive Web App) support

## 🖼️ Screenshots

### Desktop
*[Space reserved for desktop screenshots]*

### Mobile
*[Space reserved for mobile screenshots]*

### Mobile Demo
*[Space reserved for mobile GIF demonstrating functionality]*

## 🚀 Technologies Used

### Frontend
- **Angular 19** - Main framework
- **Angular Material** - UI components
- **TypeScript** - Programming language
- **Angular Animations** - Smooth animations
- **ngx-markdown** - Markdown rendering
- **HammerJS** - Touch/swipe gestures
- **Angular PWA** - Progressive Web App

### Backend  
- **Spring Boot 3.4.2** - Java framework
- **Spring Security** - Security and authentication
- **Spring Data JPA** - Data persistence
- **JWT** - Token-based authentication
- **PostgreSQL** - Database
- **Flyway** - Database migrations
- **ModelMapper** - Object mapping

## 🛠️ Installation and Setup

### Prerequisites
- **Node.js** 18+ 
- **Java** 21+
- **PostgreSQL** 13+
- **Angular CLI** 19+

### 1. Clone the repository
```bash
git clone https://github.com/igorpaiva/mantra-app.git
cd mantra-app
```

### 2. Backend Setup

```bash
cd mantra-backend

# Configure database in application.properties
# src/main/resources/application.properties

# Run migrations
./gradlew flywayMigrate

# Start backend server
./gradlew bootRun
```

Backend will be available at `http://localhost:8080`

### 3. Frontend Setup

```bash
cd mantra-frontend

# Install dependencies
npm install

# Start development server
ng serve
```

Frontend will be available at `http://localhost:4200`

## 🏗️ Project Structure

```
mantra-app/
├── mantra-backend/          # Spring Boot API
│   ├── src/main/java/       # Java source code
│   ├── src/main/resources/  # Resources and configurations
│   └── build.gradle         # Gradle dependencies
│
├── mantra-frontend/         # Angular Application
│   ├── src/app/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Application pages
│   │   ├── services/       # Angular services
│   │   ├── guards/         # Route guards
│   │   └── models/         # TypeScript types
│   ├── src/assets/         # Static resources
│   └── package.json        # NPM dependencies
│
└── README.md               # This file
```

## 🎮 How to Use

### 1. **Create Account**
- Access the application and click "Sign Up"
- Fill in your details and confirm your account

### 2. **Create a Deck**
- On the dashboard, click "Create new deck"
- Add a name and description
- Create cards with term and definition
- Use Markdown for advanced formatting

### 3. **Study**
- Select a deck on the home page
- Click "Study" to start
- Use swipe (mobile) or arrows to navigate
- Click on the card to see the answer

### 4. **Manage Decks**
- Edit existing decks
- Add or remove cards
- Organize your library

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Roadmap

- [ ] Statistics and progress system
- [ ] Spaced repetition algorithm
- [ ] Deck sharing
- [ ] Offline mode
- [ ] Deck export/import
- [ ] Image support in cards
- [ ] Dark mode
- [ ] Gamification with scoring

## 📄 License

This project is under the MIT license. See the [LICENSE](LICENSE) file for more details.

## 👨‍💻 Author

**Igor Paiva**
- GitHub: [@igorpaiva](https://github.com/igorpaiva)
- LinkedIn: [Igor Paiva](https://linkedin.com/in/igor-paiva-araujo)

---

⭐ If this project helped you, leave a star!
