from django.urls import path
from .views import PatchConsumption

urlpatterns = [
    path('consumption/<int:pk>', PatchConsumption.as_view(),
         name='consumption-update')
]
