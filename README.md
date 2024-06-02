###**Emergency Alert App Vision Document**###
1. Introduction
1.1 Purpose
The purpose of the Emergency Alert App is to provide users with a reliable and efficient solution for sending emergency alerts to their selected contacts. The app focuses on user authentication, emergency contact management, and real-time communication using SMS and Firebase services.
1.2 Scope
The app will include features such as user authentication, the ability to add and manage emergency contacts, sending emergency alerts via SMS, and real-time updates. It aims to offer a user-friendly interface with robust security measures and seamless communication capabilities.
2. Features
2.1 User Authentication
•	Users can sign up, log in, and reset their passwords.
•	Firebase Authentication will be used to securely manage user accounts.
2.2 Emergency Contacts
•	Users can add, edit, and remove emergency contacts.
•	The list of emergency contacts will be stored in Firebase Firestore and Real Time db for persistence.
2.3 Navigation
•	The app will use @react-navigation for seamless navigation between screens.
•	Screens include Home, Contacts, and Settings, each serving specific functionalities.
2.4 Send Emergency Alerts via SMS
•	Users can trigger an emergency alert by tapping a dedicated button.
•	The app will utilize expo-sms to send predefined alert messages to selected contacts via SMS.
2.5 Real-time Updates
•	Firebase Realtime Database will be employed to provide real-time updates on the status of emergency alerts.
•	Users and their emergency contacts will receive immediate feedback on the alert status.
2.6 Customizable Alert Message
•	Users can customize the emergency alert message through app settings.
3. Tech Stack
•	React Native with Expo
•	Firebase for user authentication, Firestore for data storage, and Realtime Database for real-time updates
•	@react-navigation for navigation
•	expo-sms for sending SMS alerts
•	**expo-location** for sending location coordinates along with message
4. Optional Enhancements
4.1 Push Notifications
•	Send push notifications to emergency contacts in addition to SMS.
4.2 Emergency Services Integration
•	Connect with emergency services or local authorities for enhanced functionality.
5. User Interface and Experience
•	The UI will follow a clean and intuitive design to ensure ease of use.
•	A bottom tab navigator will facilitate navigation between Home, Contacts, and Settings screens.
•	Visual feedback, such as alerts and confirmation messages, will enhance the user experience.
6. Security Measures
•	Firebase Authentication will secure user accounts.
•	Firestore security rules will control access to user data.
7. Conclusion
The Emergency Alert App aims to provide users with a reliable and user-friendly solution for sending emergency alerts to their contacts. By leveraging Firebase services and Expo APIs, the app will offer real-time communication capabilities and ensure the security and privacy of user data. The optional enhancements provide additional features to enhance the overall functionality of the app.
##
**The Figma Design doc for this project is here:** https://www.figma.com/proto/WS9ON8NnVF9KJoyM1cfxbL/bootstrap_ui?node-id=2-1380&starting-point-node-id=2%3A1380&t=1opKEN6l6JtVEes9-1
###
This is a react native project created with expo. I use Firebase on the backend to handle auth, and storage. 
###
#- To run the project, export the project to expo.dev or download expo go on your mobile phone. 
#- Once downloaded. cd into the folder, run npm install and npx expo start to get the project up and running.
#- Enjoy! 

