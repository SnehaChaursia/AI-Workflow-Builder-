import os
import requests
from dotenv import load_dotenv

load_dotenv()

N8N_URL = os.getenv("N8N_URL", "http://localhost:5678")
N8N_API_KEY = os.getenv("N8N_API_KEY")

HEADERS = {
    "X-N8N-API-KEY": N8N_API_KEY,
    "Content-Type": "application/json"
}

def build_n8n_workflow(workflow: dict):
    """Takes parsed workflow from Groq and creates it in n8n"""

    # Build n8n nodes from workflow steps
    nodes = []
    connections = {}

    # Add trigger node
    trigger_node = {
        "name": "Workflow Trigger",
        "type": "n8n-nodes-base.manualTrigger",
        "typeVersion": 1,
        "position": [250, 300],
        "parameters": {}
    }
    nodes.append(trigger_node)

    # Add a node for each step
    for i, step in enumerate(workflow["steps"]):
        node = {
            "name": f"Step {step['step_number']}: {step['action']}",
            "type": "n8n-nodes-base.noOp",  # placeholder node
            "typeVersion": 1,
            "position": [250 + (i + 1) * 250, 300],
            "parameters": {},
            "notes": f"{step['service']}: {step['description']}"
        }
        nodes.append(node)

    # Connect nodes in sequence
    for i in range(len(nodes) - 1):
        source = nodes[i]["name"]
        target = nodes[i + 1]["name"]
        connections[source] = {
            "main": [[{"node": target, "type": "main", "index": 0}]]
        }

    # Final n8n workflow payload
    payload = {
        "name": workflow["workflow_name"],
        "nodes": nodes,
        "connections": connections,
        "settings": {
            "executionOrder": "v1"
        }
    }

    # Send to n8n API
    response = requests.post(
        f"{N8N_URL}/api/v1/workflows",
        json=payload,
        headers=HEADERS
    )

    if response.status_code == 200 or response.status_code == 201:
        data = response.json()
        return {
            "success": True,
            "workflow_id": data.get("id"),
            "workflow_url": f"{N8N_URL}/workflow/{data.get('id')}",
            "message": "Workflow created in n8n!"
        }
    else:
        return {
            "success": False,
            "message": f"n8n error: {response.text}"
        }