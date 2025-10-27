

import requests
import json

# Test barcodes:
# coca cola : 3174780000363
# haldirams : 8904004403732
# sprite : 8901764032912

# Configuration
barcode = "3017620429484"
user_type = "Adult men"  # Change this to test different user types: "Adult men", "Adult women (moderate activity)", "Adult women (sedentary)", "Pregnant women"

# Construct URL with user_type
if user_type:
    url = f"http://localhost:5678/webhook-test/fetch-data/?code={barcode}&user_type={user_type}"
else:
    url = f"http://localhost:5678/webhook-test/fetch-data/?code={barcode}"

print(f"Testing webhook with barcode: {barcode}")
print(f"User type: {user_type}")
print(f"URL: {url}")
print("-" * 60)

try:
    response = requests.get(url, timeout=30)
    print(f"Status Code: {response.status_code}")

    if response.status_code == 200:
        data = response.json()
        print("\nProduct Analysis Data:")
        print(json.dumps(data, indent=4))
    else:
        print(f"Error Response: {response.text}")

except requests.exceptions.RequestException as e:
    print(f"Request failed: {e}")
except json.JSONDecodeError as e:
    print(f"JSON decode error: {e}")
    print(f"Raw response: {response.text if 'response' in locals() else 'No response'}")

