

import requests
import json
import os

# Directory containing the images
image_dir = "test-png"

# Webhook URL
url = "http://localhost:5678/webhook-test/instant-analysis/"

print(f"Sending images from {image_dir} to webhook: {url}")
print("-" * 60)

# Get list of files in test-png
if os.path.exists(image_dir):
    image_files = [f for f in os.listdir(image_dir) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp'))]
    
    if len(image_files) >= 2:
        # Store images in variables
        image1 = image_files[0]
        image2 = image_files[1]
        
        print(f"Processing images: {image1} and {image2}")
        
        try:
            # Open both image files
            with open(os.path.join(image_dir, image1), 'rb') as f1, open(os.path.join(image_dir, image2), 'rb') as f2:
                files = {
                    'file1': (image1, f1, 'image/png'),
                    'file2': (image2, f2, 'image/png')
                }
                response = requests.post(url, files=files, timeout=30)
                
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 200:
                try:
                    data = response.json()
                    print("Webhook Response:")
                    print(json.dumps(data, indent=4))
                except json.JSONDecodeError:
                    print("Raw Response:")
                    print(response.text)
            else:
                print(f"Error Response: {response.text}")
        
        except requests.exceptions.RequestException as e:
            print(f"Request failed: {e}")
        except Exception as e:
            print(f"Error processing images: {e}")
    else:
        print("Not enough images found in the directory.")
else:
    print(f"Directory {image_dir} does not exist.")

