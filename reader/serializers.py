from rest_framework import serializers
from .models import *

class SourceSerializers(serializers.ModelSerializer):
    class Meta:
        model = Source
        fields = ("id","name","amount")

class CategorySerializers(serializers.ModelSerializer):
    source_set = SourceSerializers(many=True, read_only=True)
    class Meta:
        model = Category
        fields = ("id","name","amount","source_set")

