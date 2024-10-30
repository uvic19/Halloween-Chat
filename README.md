Here's the updated README with the working link included:

# Halloween Chat Application

## Description
Halloween Chat is a real-time chat application built with React, designed to enhance your spooky season with engaging conversations. Users can log in, view chat lists, and participate in Halloween-themed discussions. The app features notifications for user interactions and efficiently manages user sessions.

## Features
- **User Authentication:** Users can log in using Firebase authentication.
- **Chat Interface:** A dynamic chat interface that updates in real time based on user interactions.
- **Real-Time Notifications:** Alerts users about new messages and updates.
- **User State Management:** Utilizes a global state store for managing user information and chat data.

## Technologies Used
- **React:** Frontend library for building the user interface.
- **Firebase:** Used for authentication and real-time data management.
- **Zustand:** A small, fast, and scalable bearbones state management solution.
- **JavaScript:** Main programming language for application logic.

## Live Demo
Check out the live application [here](https://halloween-chat.netlify.app/).

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/halloween-chat.git
   cd halloween-chat
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up Firebase:
   - Create a Firebase project and enable Authentication.
   - Add your Firebase configuration in the `lib/firebase.js` file.
4. Start the application:
   ```bash
   npm run dev
   ```

## Usage
- Open the application in your browser.
- Sign in with your credentials.
- Join the Halloween fun by selecting a chat from the list or creating a new one!

## Contribution
There are many features left to set, so users are encouraged to contribute to the project! Feel free to fork the repository and submit pull requests with new features, enhancements, or bug fixes.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
