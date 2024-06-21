from rest_framework import serializers
from .models import Address, Consumption


class ConsumptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Consumption
        fields = '__all__'


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = '__all__'
