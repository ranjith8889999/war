import logging
import logging.handlers
import os
from datetime import datetime

class LogConfig:
    """Logging configuration for the application"""
    
    # Create logs directory if it doesn't exist
    LOGS_DIR = os.path.join(os.path.dirname(__file__), '..', 'logs')
    os.makedirs(LOGS_DIR, exist_ok=True)
    
    # Log file paths
    LOG_FILE = os.path.join(LOGS_DIR, 'app.log')
    ERROR_LOG_FILE = os.path.join(LOGS_DIR, 'error.log')
    
    # Log format
    LOG_FORMAT = '%(asctime)s - %(name)s - %(levelname)s - [%(filename)s:%(lineno)d] - %(funcName)s() - %(message)s'
    DATE_FORMAT = '%Y-%m-%d %H:%M:%S'
    
    # Logging configuration dictionary
    LOGGING_CONFIG = {
        'version': 1,
        'disable_existing_loggers': False,
        'formatters': {
            'standard': {
                'format': LOG_FORMAT,
                'datefmt': DATE_FORMAT
            },
            'detailed': {
                'format': '%(asctime)s | %(levelname)-8s | %(name)-20s | [%(filename)s:%(lineno)d] | %(funcName)s() | %(message)s',
                'datefmt': DATE_FORMAT
            }
        },
        'handlers': {
            'console': {
                'class': 'logging.StreamHandler',
                'level': 'INFO',
                'formatter': 'standard',
                'stream': 'ext://sys.stdout'
            },
            'file': {
                'class': 'logging.handlers.RotatingFileHandler',
                'level': 'INFO',
                'formatter': 'detailed',
                'filename': LOG_FILE,
                'maxBytes': 10485760,  # 10MB
                'backupCount': 5,
            },
            'error_file': {
                'class': 'logging.handlers.RotatingFileHandler',
                'level': 'ERROR',
                'formatter': 'detailed',
                'filename': ERROR_LOG_FILE,
                'maxBytes': 5242880,  # 5MB
                'backupCount': 3,
            }
        },
        'loggers': {
            '': {
                'level': 'DEBUG',
                'handlers': ['console', 'file', 'error_file']
            },
            'werkzeug': {
                'level': 'INFO',
                'handlers': ['console', 'file']
            },
            'apscheduler': {
                'level': 'INFO',
                'handlers': ['console', 'file']
            }
        }
    }

def setup_logger(name):
    """Setup logger for a specific module"""
    logger = logging.getLogger(name)
    return logger
