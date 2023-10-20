from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from openai_routes import router as openai_router # Corrected import
from mangum import Mangum


app = FastAPI()
handler = Mangum(app=app)

origins = [
    "http://localhost:3000",
    "localhost:3000"
]

# Configure middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Include the openai_router, not just "router"
app.include_router(openai_router)

@app.get("/")
async def api_chat():
    return {"message": "Hello World"}
