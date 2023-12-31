from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
import openai
import os
from pydantic import BaseModel

app = FastAPI()
handler = Mangum(app)


openai.api_key = os.getenv("OPENAI_API_KEY")
openai.Model.list()


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

class UserInput(BaseModel):
    input: str
    task_type: str


@app.get("/")
async def api_chat():
    return {"message": "Hello World"}


@app.post("/api/competitor-research")
async def perform_competitor_research(input: UserInput):
    # Customize Chatbot

    system_messages = {
        "Market Research": "You are a competitive market research specialist. You have deep analytical skills, industry knowledge, and are responsible for competitor profiling, trend analysis, and forecasting market shifts. With this in mind perform competitor research with the following prompts.",
        "Personalized Email Outreach": "You are an expert in crafting personalized email outreach campaigns. Utilizing the power of personalized touchpoints, create an email sequence that resonates with the target recipient. Use the following details to generate the sequence.",
        "Social Media Posting": "You are a social media guru. Crafting engaging posts is second nature to you. Create a captivating social media post using the following prompts."
    }

    system_message = system_messages.get(input.task_type, "Invalid task type.")

    messages = [{"role": "system", "content": system_message}]

    try:
        messages.append(
            {"role": "user", "content": input.input})
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages
        )
        ChatGPT_reply = response.choices[0].message.content
        messages.append({"role": "assistant", "content": ChatGPT_reply})
        return ChatGPT_reply

    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=500, detail="An error occurred while processing the task.")
