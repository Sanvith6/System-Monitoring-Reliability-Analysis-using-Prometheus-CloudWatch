import logging
import sys
from pythonjsonlogger import jsonlogger

def setup_logging():
    logger = logging.getLogger("user_management_api")
    logger.setLevel(logging.INFO)

    # Use JSON formatter for structured logging (CloudWatch ready)
    log_handler = logging.StreamHandler(sys.stdout)
    formatter = jsonlogger.JsonFormatter(
        '%(asctime)s %(name)s %(levelname)s %(message)s %(pathname)s %(lineno)d'
    )
    log_handler.setFormatter(formatter)
    
    # Avoid adding multiple handlers if already set
    if not logger.handlers:
        logger.addHandler(log_handler)
    
    return logger
