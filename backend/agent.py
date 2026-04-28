import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def parse_workflow(user_input: str):
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": """You are a workflow automation expert.
The user will describe a workflow in plain English.
Your job is to break it down into structured steps.

Return ONLY a JSON object like this (no extra text, no markdown, no backticks):
{
  "workflow_name": "short name",
  "trigger": "what starts the workflow",
  "steps": [
    {
      "step_number": 1,
      "action": "action name",
      "service": "app/service used",
      "description": "what happens"
    }
  ],
  "summary": "one line summary"
}"""
            },
            {
                "role": "user",
                "content": user_input
            }
        ],
        temperature=0.3,
    )

    response_text = response.choices[0].message.content
    workflow = json.loads(response_text)
    return workflow