
import requests
import json
import re


barcode = "8410199013545"
url = f"http://localhost:5678/webhook-test/barcode/?code={barcode}"

response = requests.get(url)
print(f"Status Code: {response.status_code}")
data = response.json()

print("Product Data:")
print(json.dumps(data, indent=4))  # Pretty-print the JSON response

result = data

