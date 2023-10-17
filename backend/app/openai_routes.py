from fastapi import APIRouter,  HTTPException
from fastapi.responses import StreamingResponse

import openai
import os
from pydantic import BaseModel


router = APIRouter()

openai.api_key = os.getenv("OPENAI_API_KEY")
print(os.getenv("OPENAI_API_KEY"))
openai.Model.list()


class CompetitorResearchInput(BaseModel):
    task: str


class UserInput(BaseModel):
    text: str


@router.post("/api/ask-openai", response_model=dict)
async def ask_openai(input: UserInput):
    try:
        user_text = input.text

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a poetic assistant, skilled in explaining complex programming concepts with creative flair."},
                {"role": "user", "content": user_text}
            ]
        )

        openai_response = response.choices[0].text  # Get the first response

        return {"response": openai_response}

    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred.")


################################# Market GPT #################################
# Define a Pydantic model to parse input data

# Create an API endpoint for competitor research
@router.post("/api/competitor-research")
async def perform_competitor_research(input_data: CompetitorResearchInput):
    try:
        # Send the task to the OpenAI GPT model
        response = openai.Completion.create(
            engine="text-davinci-002",
            prompt=input_data.task,
            max_tokens=50,  # Adjust the number of tokens as needed
            n=1,             # Number of responses to generate
            stop=None        # List of stop words to end the response
        )

        # Extract the generated response from the OpenAI response
        generated_response = response.choices[0].text.strip()

        return {"result": generated_response}

    except Exception as e:
        raise HTTPException(
            status_code=500, detail="An error occurred while processing the task.")
################################# Market GPT #################################


@router.post("/api/check-openai")
async def check_openai():
    try:
        # Send a test request to OpenAI
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a poetic assistant, skilled in explaining complex programming concepts with creative flair."},
                {"role": "user", "content": "Compose a poem that explains the concept of recursion in programming."}
            ]
        )

        print(response.choices[0].text)

        # If successful, return the response
        return {"message": "OpenAI API is working.", "response": response.choices[0].text}
    except Exception as e:
        # If there's an error, return an error message
        return {"message": "OpenAI API is not working.", "error": str(e)}
