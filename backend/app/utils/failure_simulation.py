import random
import time
import asyncio
import logging
from fastapi import HTTPException

logger = logging.getLogger("user_management_api")

class FailureSimulator:
    def __init__(self):
        self.latency_enabled = False
        self.errors_enabled = False
        self.latency_probability = 1.0  # 100% chance for clear testing
        self.error_probability = 1.0    # 100% chance for clear testing

    async def simulate(self):
        # Simulate high latency
        if self.latency_enabled:
            delay = 3.0 # Fixed 3s delay for clear spike
            logger.warning(f"SIMULATION: Injecting {delay:.2f}s latency")
            await asyncio.sleep(delay)

        # Simulate 500 errors
        if self.errors_enabled and random.random() < self.error_probability:
            logger.error("SIMULATION: Injecting 500 Internal Server Error")
            raise HTTPException(status_code=500, detail="Simulated Internal Server Error")

simulator = FailureSimulator()
