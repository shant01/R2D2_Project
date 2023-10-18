from fastapi import APIRouter,  HTTPException
from fastapi.responses import StreamingResponse

import openai
import os
from pydantic import BaseModel


router = APIRouter()

openai.api_key = os.getenv("OPENAI_API_KEY")
openai.Model.list()



class UserInput(BaseModel):
    input: str

################################# Market GPT #################################
@router.post("/api/competitor-research")
# input_data: CompetitorResearchInput, user_input
async def perform_competitor_research(input: UserInput): 
    # Customize Chatbot
    messages = [{"role": "system",
                 "content": "You are a financial experts that specializes in real estate investment and negotiation"}]

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
        raise HTTPException(
            status_code=500, detail="An error occurred while processing the task.") 
################################# Market GPT #################################