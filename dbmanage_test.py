
import requests
import json
import re
# YOGURT : 4056489148739
# ketchup : 50457236

barcode = "8904004401172"
url = f"http://localhost:5678/webhook-test/barcode/?code={barcode}"

response = requests.get(url)
print(f"Status Code: {response.status_code}")
data = response.json()

print("Product Data:")
print(json.dumps(data, indent=4))  # Pretty-print the JSON response

result = data

