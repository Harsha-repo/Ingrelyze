from sys import stdout
from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import requests
import json



# imports from django rest framework
from rest_framework.response import Response  # for giving a cool interface for hadnling rest api's responses
from rest_framework import status           # for giving the status codes for the data transferred
from rest_framework.decorators import api_view  # to make a view as an api view (POST , GET)


# Create your views here.


@csrf_exempt
@require_http_methods(["POST", "GET", "OPTIONS"])
def barcode_lookup(request):
    response = None
    if request.method == 'OPTIONS':
        response = JsonResponse({})
    else:
        try:
            data = json.loads(request.body)
            barcode = data.get('barcode')
            if not barcode:
                response = JsonResponse({'error': 'Barcode is required'}, status=400)
            else:
                url = f"http://localhost:5678/webhook/barcode?code={barcode}"
                webhook_response = requests.get(url, timeout=30)        # fetches the data from webhook ( workflow of n8n ) and stores in response variable
                webhook_response.raise_for_status()
                json_data = webhook_response.json()
                print(json_data)
                response = JsonResponse(json_data, safe=False)
        except requests.exceptions.RequestException as req_err:
            response = JsonResponse({'error': f'Request error: {str(req_err)}'}, status=500)
        except json.JSONDecodeError as json_err:
            response = JsonResponse({'error': f'JSON decode error: {str(json_err)}'}, status=500)
        except Exception as e:
            response = JsonResponse({'error': str(e)}, status=500)

    # Add CORS headers
    response['Access-Control-Allow-Origin'] = '*'
    response['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS'
    response['Access-Control-Allow-Headers'] = 'Content-Type'
    return response


@csrf_exempt
@require_http_methods(["POST", "GET", "OPTIONS"])
def analysis_lookup(request):
    if request.method == 'OPTIONS':
        response = JsonResponse({})
        response['Access-Control-Allow-Origin'] = '*'
        response['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS'
        response['Access-Control-Allow-Headers'] = 'Content-Type'
        return response
    else:
        try:
            data = json.loads(request.body)
            barcode = data.get('barcode')
            if not barcode:
                response = JsonResponse({'error': 'Barcode is required'}, status=400)
            else:
                url = f"http://localhost:5678/webhook/fetch-data/?code={barcode}"  # Assuming different webhook endpoint for analysis
                webhook_response = requests.get(url, timeout=20)        # fetches the analysis data from webhook
                webhook_response.raise_for_status()
                json_data = webhook_response.json()
                print(json_data)
                response = JsonResponse(json_data, safe=False)
        except requests.exceptions.RequestException as req_err:
            response = JsonResponse({'error': f'Request error: {str(req_err)}'}, status=500)
        except json.JSONDecodeError as json_err:
            response = JsonResponse({'error': f'JSON decode error: {str(json_err)}'}, status=500)
        except Exception as e:
            response = JsonResponse({'error': str(e)}, status=500)

    # Add CORS headers
    response['Access-Control-Allow-Origin'] = '*'
    response['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS'
    response['Access-Control-Allow-Headers'] = 'Content-Type'
    return response



