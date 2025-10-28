

import requests
import json

# Prompt for query input
query = "what are the  drinks that i asked you for analysis? "

# Construct URL with query
url = f"http://localhost:5678/webhook/chat-bot/?query={query}"

print(f"Testing webhook with query: {query}")
print(f"URL: {url}")
print("-" * 60)

try:
    response = requests.get(url, timeout=30)
    print(f"Status Code: {response.status_code}")

    if response.status_code == 200:
        data = response.json()
        print("\nChatbot Response:")
        print(json.dumps(data, indent=4))
    else:
        print(f"Error Response: {response.text}")

except requests.exceptions.RequestException as e:
    print(f"Request failed: {e}")
except json.JSONDecodeError as e:
    print(f"JSON decode error: {e}")
    print(f"Raw response: {response.text if 'response' in locals() else 'No response'}")

