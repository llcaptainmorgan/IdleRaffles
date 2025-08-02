Event Engagement System README
Project Overview
The Event Engagement System is a digital raffle platform designed to enhance attendee experience at events like raffles and gun fests. It provides a modern, engaging, and anonymous way for attendees to participate in Bingo games (with potential for additional raffle games) via a Progressive Web App (PWA). The system prioritizes user anonymity, operational efficiency, and resilience against technical failures, while maintaining person-to-person interaction for prize verification.
This is a private repository. All code, documentation, and assets are confidential and intended solely for authorized project contributors.
Privacy and Licensing

Repository Privacy: This is a private repository. Unauthorized access or distribution of its contents is strictly prohibited.
Image Ownership: Images used in this project are not owned by the developer. Rights are distributed among multiple sources. Camp Freedom owns all rights to its proprietary images and the overall product, excluding AI-generated images created via Imagen 3 and Grok. 
AI Licensing Note: Licensing for AI-generated content may change. If licensing terms for AI-generated products (Imagen 3, Grok, or similar) are updated, this project will be deprecated until compliance with new terms is ensured.

Features

Anonymous ID Card (Physical Component):

Laminated, vertical business card with a unique QR code and alphanumeric code (e.g., OP987AM) for single-use access to a Bingo game entry in the PWA.
Ensures attendee anonymity by avoiding personal data collection.
Pre-generated and stored in a secure database for tracking.


Progressive Web App (PWA):

Accessible via modern smartphone browsers (no app store download required).
Features:
Login: QR code scan or manual code entry for anonymous access.
Dashboard: Displays active games, event info, and donation pages.
Bingo Game: Auto-marks drawn numbers, supports multiple cards, and provides real-time updates via WebSockets.
Offline Resilience: Caches static assets and game state locally, with a discreet "network error" dropdown widget.
Win Notification: Detects Bingo wins and guides users to prize claim areas.
Donation Pages: Professional sub-pages for partner organizations with integrated payment gateways.




Backend Server:

Manages user IDs, game logic, and real-time updates via WebSockets.
Maintains an Event Log as the definitive record of all game actions (draws, card activations, wins, prize claims).
Hosted on a reliable cloud provider (e.g., AWS, Google Cloud) for uptime and scalability.
Secure credential storage using environment variables or a configuration file.


Staff Interface:

Secure, web-based dashboard for staff to:
Activate cards upon purchase.
View and verify wins via the Event Log.
Record prize claims with winner names (collected verbally).


Accessible via dedicated, secure staff network (e.g., mobile hotspot).



Worst-Case Scenario: Network Crashes & App Dysfunction
To ensure event continuity during persistent network issues:

Immediate Action:
Announce a pause in digital gameplay via PA system and direct attendees to a "Raffle Support" station.


Manual Fallback:
Use a physical Bingo cage or manual random number generator for draws.
Announce numbers over PA system; attendees mark cards manually.
Staff verify wins against the Event Log (accessed via a dedicated staff network).


Prize Redemption:
Staff confirm wins using the Event Log and card IDs, even if the PWA is offline.


Preventative Measures:
Host on a robust cloud provider with CDN for static assets.
Stress-test the system for concurrent users.
Use a dedicated staff network (hotspot or wired connection) for the staff interface.



Handling Ties in Bingo
Multiple winners may achieve Bingo on the same drawn number. The system uses a random selection among simultaneous ties:

Process: The server identifies all cards achieving Bingo on a given number, then uses a secure random number generator to select one winner from the tied group.
Transparency: The tie-breaking rule is clearly communicated in the PWA rules, event signage, and staff announcements to ensure fairness.

Development Notes

Technology Stack:
PWA: HTML, CSS, JavaScript (likely with a framework like React for component-based UI).
Backend: Node.js or similar, with WebSocket support (e.g., Socket.IO) and a database (e.g., PostgreSQL) for the Event Log.
Hosting: AWS/Google Cloud/Heroku for scalability.


Security:
Use HTTPS for all data transfers.
Store staff credentials in environment variables or a secure configuration file (never hardcoded).
Implement robust error handling and retry logic for WebSocket connections.


Future Scalability:
Modular design allows for additional raffle games (e.g., digital scratch-offs, wheel spins).
Event Log provides anonymous data for participation and donation analytics.



Setup Instructions

Clone the Repository:git clone <private-repo-url>


Install Dependencies:
Backend: npm install (or equivalent for your backend framework).
PWA: Install required libraries (e.g., React, Socket.IO client).


Configure Environment:
Set up environment variables for backend credentials and database connection.
Example .env file:DATABASE_URL=your_database_connection_string
STAFF_AUTH_SECRET=your_secure_secret




Run Locally:
Backend: npm start (or equivalent).
PWA: Serve via a local development server (e.g., npm run dev for Vite/React).


Deploy:
Deploy backend to a cloud provider.
Use a CDN for PWA static assets.
Ensure a dedicated staff network is configured for the event.



Testing

Unit Tests: Test game logic, WebSocket connections, and Event Log accuracy.
Load Testing: Simulate thousands of concurrent users to ensure scalability.
Offline Testing: Verify PWA behavior in offline mode and resync functionality.

Contributing
This is a private project. Only authorized contributors may submit changes. Contact the project owner for access.
Contact
For inquiries, contact the project owner through the authorized channel provided by Camp Freedom.
