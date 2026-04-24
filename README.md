# AWS 3-Tier User Management System

A production-ready full-stack application designed for AWS deployment, featuring a modern React dashboard, FastAPI backend, and PostgreSQL database.

## 🏗️ Architecture
- **Frontend**: React 18 + Tailwind CSS v3 (Nginx)
- **Backend**: FastAPI + SQLAlchemy 2.0 (Python 3.11)
- **Database**: PostgreSQL 15
- **Orchestration**: Docker Compose

## 🚀 Quick Start
```bash
docker-compose up --build -d
```
- **Frontend**: [http://localhost:3001](http://localhost:3001)
- **Backend API**: [http://localhost:8000](http://localhost:8000)
- **API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

## 📁 Project Structure
Refer to [structure.txt](./structure.txt) for a detailed file-by-file breakdown.

## ✨ Features
- ✅ **Premium UI**: Modern, responsive dashboard with stat cards.
- ✅ **CloudWatch Ready**: Structured JSON logging.
- ✅ **Health Monitoring**: Integrated health checks for all tiers.
- ✅ **Secure**: Non-root Docker users and Pydantic validation.
