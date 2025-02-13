# Event Management System - Backend

This repository contains the backend of an **Event Management System** that allows users to manage their events, invite others to events, and receive notifications about upcoming events.

## Brief Overview

The **Event Management System** provides a platform where users can:
- Register and log in.
- Create and manage events.
- Invite other users to events.
- Track the status of invitations (e.g., accepted, declined, or pending).
- Receive notifications about upcoming events via WebSockets.

## Architecture of the Application

The backend follows a **RESTful API architecture**, with routes and controllers handling various functionalities such as user management, event management, and invitation handling.

### Key Technologies:
- **Node.js** with **Express**: The server-side framework handling HTTP requests.
- **MongoDB**: The database to store user, event, and invitation data.
- **Mongoose**: ODM to interact with MongoDB.
- **WebSockets**: For real-time notifications to users about upcoming events.

### Core Features:
1. **Authentication**: JWT-based authentication system to securely log users in and register new users.
2. **Event Management**: Users can create, update, delete, and view events.
3. **Invitation System**: Users can send invitations to other users to join events. Invitations have status (`pending`, `accepted`, `declined`).
4. **Real-Time Notifications**: WebSocket connections are established to notify users about upcoming events.

---

## How to Run the Application

### Prerequisites:
- **Node.js** installed on your machine.

### Step-by-Step Guide:

1. **Clone the repository**:
    ```bash
    git clone https://your-repository-url.git
    cd your-repository-folder
    ```

2. **Install dependencies**:
   For **backend**:
        ```bash
        npm install
        ```

3. **Run the backend**:
    ```bash
    npm run start
    ```
    This command will start the backend server. By default, it runs on `http://localhost:5000`.

5. **Access the application**: 
    - The backend is running at `http://localhost:5000` (it serves as the API for the frontend).

---

## How I Implemented the Additional Feature

The feature involves handling invitations to events, where users can send invitations to other users to join the event. The status of the invite can be updated (accepted, declined, or pending), and the system must track this status.

To implement this:

1. **Updated the Event Schema**:
   - Modified the event schema to track **who is sending the invite** (via `invitedBy` field).
   - Modified the `invitations` array within the event schema to include the **user ID** and **status** of the invitation.
   - Ensured that the **status** of each invitation (`pending`, `accepted`, or `declined`) is properly stored and updated.

2. **Created an RSVP System**:
   - Developed a controller that handles the acceptance or decline of invitations by updating the invitation status.
   - Added API routes to handle the sending of invites, accepting or declining invites, and tracking invite status.

3. **Real-Time Notification**:
   - Used **WebSockets** to notify users when an invitation is accepted or declined.

---

## Assumptions Made

1. **Users must have an account**: Invitations can only be sent to users who have an existing account on the platform.
2. **WebSocket connections** are established for notifications when the invite status changes. This assumes users have WebSocket support on their devices.
3. **One user can invite multiple others**: The invitation system supports multiple invitees for a single event, but all invitees must be registered users.
4. **JWT authentication**: I assumed that users would always be authenticated when interacting with the event and invitation system.

---

## API Endpoints

### Authentication Routes:
- **POST `/auth/register`**: Register a new user.
- **POST `/auth/login`**: Log in a user and obtain a JWT token.
- **POST `/auth/logout`**: Log out a user (protected route).

### Event Management Routes:
- **POST `/api/events`**: Create a new event.
- **GET `/api/events`**: Get all events for the authenticated user.
- **GET `/api/events/:id`**: Get details of a specific event.
- **PUT `/api/events/:id`**: Update an event.
- **DELETE `/api/events/:id`**: Delete an event.

### Invitation Routes:
- **POST `/api/events/:eventId/invite`**: Send invitations to users for an event.
- **GET `/api/events/invited/:userId`**: Get all events the user has been invited to.
- **GET `/api/events/sent-invites/:userId`**: Get all events the user has sent invitations to.
- **POST `/api/events/:eventId/invitation/:invitationId/rsvp`**: Accept or decline an invitation.

---

## Conclusion

This Event Management System allows users to effectively manage their events, track the status of invitations, and receive real-time notifications. The application leverages **WebSockets** for notifications and **MongoDB** for persistent storage of user, event, and invitation data.

Feel free to reach out for more details or clarifications.

---
