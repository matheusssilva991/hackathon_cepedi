from django.db import models


class Consumption(models.Model):
    year = models.IntegerField(null=False)
    month = models.IntegerField(null=False)
    day = models.CharField(max_length=100, null=False)
    hour = models.IntegerField(null=False)
    consumption = models.FloatField(null=False)
    pattern = models.CharField(max_length=255, null=True)
    addressId = models.IntegerField(null=False, name='address_id')
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'consumption'

    def __str__(self):
        return f"{self.year}-{self.month}-{self.day} \
            {self.hour}:00:00 - {self.consumption} m³"


class Address(models.Model):
    street = models.CharField(max_length=255, null=False)
    neighborhood = models.CharField(max_length=255, null=False)
    complement = models.CharField(max_length=255, null=True)
    city = models.CharField(max_length=255, null=False)
    state = models.CharField(max_length=255, null=False)
    postalCode = models.CharField(max_length=255, null=False)
    number = models.CharField(max_length=255, null=False)
    amountPeople = models.IntegerField(null=False)
    cadUnico = models.CharField(max_length=255, null=False)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'address'

    def __str__(self):
        return f"{self.street}, {self.number}, {self.neighborhood}, \
            {self.city}, {self.state}, {self.postalCode}"
