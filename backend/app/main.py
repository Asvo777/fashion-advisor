from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.clothing import router as clothing_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(clothing_router)

@app.get("/health")
def health_check():
    return {"status": "ok"}

