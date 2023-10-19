# R2D2_Project

A web application that takes user input and performs market research based on the user's specified criteria.

## Table of Contents

- [Frontend](#frontend)
  - [Installation](#installation)
  - [Running](#running)
- [Backend](#backend)
  - [Installation](#installation-1)
  - [Running](#running-1)


---

## Frontend

### Installation
To install the necessary dependencies for the frontend, navigate to the 'frontend' directory in your terminal and run:

```bash
npm install
```

### Running
To run the frontend, navigate to the 'frontend' directory in your terminal and execute:

```bash
npm start
```

## Backend

### Installation
To install the necessary dependencies for the backend, make sure you have Python and `pip` installed. Then, navigate to the 'backend' directory in your terminal and create a virtual environment (if not already created):

Activate the virtual environment:

```bash
source venv/bin/activate
```

Install Python Packages
```bash
pip install -r requirements.txt
```
### Running
While still inside the 'backend' directory and with the virtual environment activated, navigate to the 'app' folder and run the following command to start the backend server using Uvicorn:

```bash
uvicorn main:app --reload
```
The backend server will be accessible at http://localhost:8000.

Make sure both the frontend and backend servers are running to use the application effectively.

## AWS
