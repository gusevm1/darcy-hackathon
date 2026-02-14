from fastapi import FastAPI

from src.middleware.cors import add_cors
from src.routes.health import router as health_router

app = FastAPI(title="Darcy Hackathon API", version="0.1.0")

add_cors(app)
app.include_router(health_router)
