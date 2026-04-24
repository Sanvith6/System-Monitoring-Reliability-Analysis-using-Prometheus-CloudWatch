import time
import logging
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from prometheus_client import Counter, Histogram, generate_latest
from app.routers import users, health
from app.utils.logger import setup_logging
from app.database import engine, Base
from app.utils.failure_simulation import simulator

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize logging
setup_logging()
logger = logging.getLogger("user_management_api")

# Prometheus Metrics
REQUEST_COUNT = Counter("http_requests_total", "Total HTTP Requests", ["method", "endpoint", "status"])
REQUEST_LATENCY = Histogram("http_request_latency_seconds", "Request latency in seconds", ["method", "endpoint"])

app = FastAPI(
    title="User Management API",
    description="A production-ready API for managing users, ready for AWS deployment.",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify actual origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request timing and metrics middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    
    # Simulate failure if enabled (now inside timing block)
    if "/api/v1" in request.url.path:
        await simulator.simulate()
        
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    
    # Observe metrics
    REQUEST_LATENCY.labels(
        method=request.method, 
        endpoint=request.url.path
    ).observe(process_time)
    
    REQUEST_COUNT.labels(
        method=request.method, 
        endpoint=request.url.path, 
        status=response.status_code
    ).inc()
    
    # Log the request with enhanced context
    logger.info(
        "Request processed",
        extra={
            "method": request.method,
            "path": request.url.path,
            "status_code": response.status_code,
            "latency": f"{process_time:.4f}s"
        }
    )
    return response

@app.get("/metrics")
def metrics():
    return Response(generate_latest(), media_type="text/plain")

# Include routers
app.include_router(health.router, prefix="/api/v1", tags=["Health"])
app.include_router(users.router, prefix="/api/v1", tags=["Users"])

@app.get("/")
async def root():
    return {"message": "Welcome to the User Management API. Access /docs for documentation."}

@app.post("/api/v1/simulate/latency")
async def toggle_latency(enabled: bool):
    simulator.latency_enabled = enabled
    return {"latency_simulation": "enabled" if enabled else "disabled"}

@app.post("/api/v1/simulate/errors")
async def toggle_errors(enabled: bool):
    simulator.errors_enabled = enabled
    return {"error_simulation": "enabled" if enabled else "disabled"}
