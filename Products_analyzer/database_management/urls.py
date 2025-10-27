

from django.urls import path
from . import views

urlpatterns = [
    #web urls

    #path('data/',views.test_database_webhook, name = 'test_database_webhook' ),
    path('barcode-lookup/', views.barcode_lookup, name='barcode_lookup'),
    path('analysis-lookup/', views.analysis_lookup, name='analysis_lookup'),
    path('nutrient-analysis-lookup/', views.nutrient_analysis_lookup, name='nutrient_analysis_lookup'),
]
