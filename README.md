# InternGuide : Internship Showcase and Tracking Platform 

## Introduction  
The **Internship Showcase and Tracking Platform** is a web-based system designed to:  
- Showcase internship statistics across various departments  
- Track faculty mentor assignments using **TF-IDF-based matching** for optimal pairings  
- Monitor internship progress for students with real-time updates  
- Facilitate communication via **Nodemailer** for automated email notifications  
- Securely store student resumes using **Firebase Storage**  

The platform provides transparency and allows all stakeholders (students, faculty, management, and employers) to visualize internship data and assess its alignment with academic and sustainability goals. 
This was made as a part of our Full Stack Development Course in Fr. Conceicao Rodrigues College of Engineering (Computer Engineering, Sem 4)

---

##  Demo  and PPT
- [Video Demo](https://drive.google.com/file/d/1Z27QPewM5Ow9hwI_T0peg5mpyTXmA0T3/view?usp=sharing)
- [PPT](https://drive.google.com/file/d/1FWGbLUsY5n8WkbrO7CjYR6BY0fAzm3MD/view?usp=sharing)

---

## Features  

### 1. Viewers (Public, Employers, Prospective Interns)  
- View department-wise internship statistics  
- Explore available internships and their alignment with:  
  - **Sustainable Development Goals (SDGs)**  
  - **Program Outcomes (POs)**  
  - **Program Educational Objectives (PEOs)**  
- Filter internships by:  
  - Department  
  - SDG  
  - PO/PEO mapping  
  - Industry sector  
- Contact internship providers for collaboration or networking  

### 2. Students (Internship Seekers)  
- Browse and apply for internships  
- **Upload resumes** securely via **Firebase Storage**  
- Track application status and deadlines  
- View **TF-IDF-matched faculty mentor** details  
- Monitor internship progress with:  
  - Task tracking  
  - Deadline reminders  
  - Learning outcome logs  
- Receive feedback from mentors and industry supervisors  
- Generate personalized reports on:  
  - Skill development  
  - SDG contributions  
- Receive automated email alerts (**Nodemailer**) for:  
  - Application updates  
  - Mentor assignments  
  - Deadline reminders  

### 3. Faculty Coordinators (Mentors, Course Instructors)  
- View **algorithmically assigned mentees** (TF-IDF matching)  
- Monitor internship progress and track milestones  
- Evaluate student performance based on:  
  - Industry criteria  
  - Academic rubrics  
- Collaborate with industry supervisors  
- Generate reports on:  
  - Internship success rates  
  - SDG/PO/PEO alignment  

### 4. Admins (System Moderators, Platform Administrators)  
- Manage internship listings (approve, edit, remove)  
- Assign roles to:  
  - Students  
  - Faculty  
  - Industry mentors  
- Monitor department-wise:  
  - Internship data  
  - Student participation rates  
- Send bulk notifications via **Nodemailer** for:  
  - Deadline alerts  
  - Mentor assignments  
  - System updates  
- Generate detailed reports on:  
  - Student performance  
  - SDG contributions  

### 5. Management (Institutional Coordinators, University Officials)  
- View institution-wide internship statistics  
- Track **SDG contributions** of internships  
- Evaluate program success based on:  
  - Student performance  
  - Industry collaboration  
- Generate department-level analytics:  
  - Participation trends  
  - PO/PEO alignment  
  - Employer feedback  

---

## Key Functional Requirements  
- **Internship Listing & Management**: Admins/faculty can post and moderate opportunities  
- **TF-IDF Mentor-Mentee Matching**: Automated optimal pairing based on skills/expertise  
- **SDG/PO/PEO Mapping**: Ensure alignment with academic and sustainability goals  
- **Nodemailer Integration**: Automated emails for applications, approvals, and alerts  
- **Firebase Resume Storage**: Secure document upload and retrieval  
- **Internship Progress Tracking**: Milestones, tasks, and feedback logging  
- **Role-Based Access Control**: Secure permissions for all user types  

---

## Technology Stack  

### Frontend  
- **React.js**: Dynamic and responsive UI  
- **Firebase Storage**: Secure resume uploads and management  

### Backend  
- **Node.js + Express.js**: REST API development  
- **Nodemailer**: Automated email notifications  

### Database  
- **MongoDB**: Flexible document storage for internships and user data  

### Algorithms  
- **TF-IDF (Term Frequency-Inverse Document Frequency)**:  
  - Analyzes student skills and mentor expertise  
  - Calculates weighted relevance scores  
  - Automates optimal mentor assignments  

---

## Installation & Setup

### ⚙️ Prerequisites
- Node.js ≥ v16  
- MongoDB (Atlas)  
- Firebase project  
- SMTP credentials (Nodemailer)  
- Python 3 (for TF-IDF)  

---

###  Backend Setup  
```sh
cd backend
npm install
npm run start
# .env
PORT=8000  
MONGODB_URL=
JWT_SECRET=  
JWT_EXPIRES_IN=
GEMINI_API_KEY= 
GEMINI_API_URL=
```

---

###  Frontend Setup  
```sh
cd frontend
npm install
npm run start
# .env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

---

###  Nodemailer (Email API)  
```sh
cd nodemailer/email-api
npm install
node server.js
# .env
EMAIL_USER=
EMAIL_PASS=  
PORT=8001  
```

---

###  Python TF-IDF Server  
```sh
cd python
pip install -r requirements.txt
python mentor_matching.py
```
