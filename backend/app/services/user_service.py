from sqlalchemy.orm import Session
from app.models.user import User
import logging

logger = logging.getLogger("user_management_api")

def get_all_users(db: Session):
    return db.query(User).all()

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, user):
    db_user = User(name=user.name, email=user.email)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Log user creation for audit
    logger.info(f"User created: {db_user.email} (ID: {db_user.id})")
    
    # Return the model instance
    return db_user

def delete_user(db: Session, user_id: int):
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user:
        db.delete(db_user)
        db.commit()
        logger.info(f"User deleted: ID {user_id}")
        return True
    return False
