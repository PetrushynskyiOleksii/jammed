"""This module provides entry point for jammed server application."""

import os
import logging

from app.core import create_app


def init_logging():
    """
    Initialize logging stream with debug level to console and
    create file logger with info level if permission to file allowed.
    """
    log_format = "%(asctime)s - %(levelname)s: %(name)s: %(message)s"
    logging.basicConfig(format=log_format, level=logging.DEBUG)

    log_dir = os.environ.get("LOG_DIR")
    log_filepath = f"{log_dir}/server.log"
    if log_dir and os.path.isfile(log_filepath) and os.access(log_filepath, os.W_OK):
        formatter = logging.Formatter(log_format)
        file_handler = logging.FileHandler(log_filepath)
        file_handler.setLevel(logging.INFO)
        file_handler.setFormatter(formatter)
        logging.getLogger("").addHandler(file_handler)


if __name__ == '__main__':
    init_logging()

    app = create_app()
    app.run(host="0.0.0.0", port=5000)
