from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Consumption, Address
from .serializers import ConsumptionSerializer
import pickle
import numpy as np


class PatchConsumption(APIView):
    def patch(self, request, pk, format=None):
        try:
            address = Address.objects.get(pk=pk)
            consumption = Consumption.objects.filter(address_id=address.id).latest('createdAt') # noqa
        except Consumption.DoesNotExist:
            return Response({"error": "Consumo não encontrado."},
                            status=status.HTTP_404_NOT_FOUND)

        labels_for_day = pickle.load(open("./ia_model/label_for_day.pkl",
                                          "rb"))
        labels_for_city = pickle.load(open("./ia_model/label_for_city.pkl",
                                           "rb"))
        labels_for_neighborhood = pickle.load(
            open("./ia_model/label_for_neighborhood.pkl", "rb"))

        data_predict = np.array([
            int(consumption.month),
            labels_for_day.transform([consumption.day])[0],
            int(consumption.hour),
            int(address.amountPeople),
            labels_for_city.transform([address.city])[0],
            labels_for_neighborhood.transform([address.neighborhood])[0],
            float(consumption.consumption)
        ]).reshape(1, -1)

        scaler = pickle.load(open('./ia_model/scaler.pkl', 'rb'))
        data_predict = scaler.transform(data_predict)

        random_forest = pickle.load(open('./ia_model/random_forest.sav', 'rb'))
        pattern = {'pattern': random_forest.predict(data_predict)[0]}

        serializer = ConsumptionSerializer(consumption, data=pattern,
                                           partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
