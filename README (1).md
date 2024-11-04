
# JobSage - Smart Recruiting Platform

JobSage is a smart recruiting platform that streamlines the recruitment process by enabling job seekers, recruiters, and admins to manage job postings, applications, interviews, and more. Built using HTML, CSS, JavaScript, Firebase, and Gemini AI, JobSage is designed to make recruiting efficient and accessible. 

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

## Project Overview
JobSage is a web-based recruiting platform with role-based authentication, designed for:
- **Recruiters**: Managing job postings, applications, and scheduling interviews.
- **Job Seekers**: Applying for jobs, tracking application status, and preparing for interviews with AI-generated questions based on their resume.
- **Admins**: Accessing a recruitment dashboard with metrics on applications and job postings.

This project leverages Firebase for database management and user authentication and uses Gemini AI to assist candidates by generating interview questions.

## Features
### General
- **Role-based Authentication**: Provides different functionalities for recruiters, job seekers, and admins based on their roles.

### Recruiter
- **Job Posting and Management**: Create, edit, and publish job postings.
- **Interview Generation and Scheduling**: Schedule interviews and generate interview-related data.
- **Application Tracking**: View and manage applications, track the progress of each application.

### Job Seeker
- **Job Application**: Apply to published job postings.
- **Application Status Tracking**: View the status of applications (e.g., in-progress, rejected, offered).
- **Interview Preparation with AI**: Generate interview questions using Gemini AI based on resume information.

### Admin
- **Recruitment Dashboard**: Access a dashboard showing application metrics, including counts of rejected, offered, and in-progress applications.
- **Published Job Overview**: View all published job postings.

## Technology Stack
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Firebase for data management and authentication
- **AI Integration**: Gemini AI for generating personalized interview questions

## Installation
To set up and run JobSage locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/jobsage.git
   cd jobsage
   ```

2. **Configure Firebase**:
   - Set up a Firebase project in the Firebase Console.
   - Add Firebase configuration details to your project.

3. **Install dependencies** (if any):
   This project uses plain JavaScript, so dependencies are minimal, but if any are required, use npm to install them.

4. **Run the Project**:
   - Open `index.html` in your browser to start the application locally.

## Usage
### Recruiter Workflow
1. Log in as a recruiter.
2. Post, edit, and publish job listings.
3. Schedule interviews and manage applications.

### Job Seeker Workflow
1. Log in as a job seeker.
2. View all published jobs and apply.
3. Check application status and prepare for interviews with AI-generated questions.

### Admin Workflow
1. Log in as an admin.
2. Access the recruitment dashboard to view application metrics.
3. View all active job postings.

## Future Enhancements
- **Enhanced AI Features**: Deeper integration with Gemini AI for advanced interview question suggestions.
- **Real-Time Updates**: Auto-refreshing dashboard metrics.
- **Advanced Analytics**: Detailed reports on recruitment trends.
- **In-App Messaging**: Communication between job seekers and recruiters.

## Contributing
Contributions are welcome! If you'd like to contribute to JobSage, please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-name`).
5. Open a pull request.

## License
This project is licensed under the MIT License.
