> **Name:** CHAUHAN KRISH YOGESHBHAI<br /> **Enroll No:** 22002171310015<br /> **Branch:** CST<br /> **Roll No:** 09<br />

# Estate Master

**Estate Master** is a real estate website that provides a platform for listing and managing properties. The frontend is built with **ReactJS** using **TailwindCSS** for styling, while the backend is powered by **Django Rest Framework (DRF)**, with **PostgreSQL** as the database.

## Tech Stack

- **Frontend:** ReactJS, TailwindCSS
- **Backend:** Django Rest Framework (DRF)
- **Database:** PostgreSQL
- **Build Tool:** Vite

## Features

- User authentication (TokenAuthentication)
- OTP based verification
- Property listing with filtering and searching capabilities
- Agent management and property association
- Property status management (availability, pricing, etc.)

## Installation and Setup

### Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (LTS version)
- Python (version 3.8 or later)
- PostgreSQL (version 12.x or later)
- npm or yarn (for frontend dependencies)
- pip (for backend dependencies)

### Frontend Setup (React)

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/estatemaster.git
   cd estatemaster
   ```

2. Navigate to the `frontend` directory:

   ```bash
   cd frontend
   ```

3. Install the dependencies:

   Using npm:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) to view the project.

### Backend Setup (Django)

1. Create and activate a Python virtual environment:

   ```bash
   python3 -m venv venv
   source venv/Scripts/activate
   ```

2. Navigate to the `backend` directory:

   ```bash
   cd backend
   ```

3. Install the backend dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Create a PostgreSQL database for the project:

   ```bash
   psql
   CREATE DATABASE estatemaster;
   ```

5. Update the `settings.py` file in Django to reflect your PostgreSQL setup:

   ```python
   DATABASES = {
       'default': {
           'ENGINE': 'django.db.backends.postgresql',
           'NAME': 'estatemaster',
           'USER': 'your_username',
           'PASSWORD': 'your_password',
           'HOST': 'localhost',
           'PORT': '5432',
       }
   }
   ```

6. Apply migrations to set up the database schema:

   ```bash
   python manage.py migrate
   ```

7. Create a superuser to access the Django admin:

   ```bash
   python manage.py createsuperuser
   ```

8. Start the Django development server:

   ```bash
   python manage.py runserver
   ```

   The backend will be accessible at [http://localhost:8000](http://localhost:8000).
