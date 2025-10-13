

import requests
import json
import re

#  coca cola : 3174780000363
# haldirams : 8904004403732

barcode = "8904004403732"
url = f"http://localhost:5678/webhook-test/fetch-data/?code={barcode}"

response = requests.get(url)
print(f"Status Code: {response.status_code}")
data = response.json()

print("Product Data:")
print(json.dumps(data, indent=4))  # Pretty-print the JSON response

result = data
