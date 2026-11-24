from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.clothing import router as clothing_router
from app.routers.users import router as users_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(clothing_router)
app.include_router(users_router)

@app.get("/health")
def health_check():
    return {"status": "ok"}

