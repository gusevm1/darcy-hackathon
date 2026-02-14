from fastapi import FastAPI

from src.middleware.cors import add_cors
from src.routes.chat import router as chat_router
from src.routes.classify import router as classify_router
from src.routes.health import router as health_router
from src.routes.jurisdictions import router as jurisdictions_router
from src.routes.requirements import router as requirements_router

app = FastAPI(title="Darcy Hackathon API", version="0.1.0")

add_cors(app)
app.include_router(health_router)
app.include_router(chat_router)
app.include_router(classify_router)
app.include_router(jurisdictions_router)
app.include_router(requirements_router)
