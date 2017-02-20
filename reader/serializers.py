#!/usr/bin/env python
# -*- coding:utf-8 -*-
from rest_framework import serializers
from .models import *

#序列化，通过category获得source
class SourceSerializers(serializers.ModelSerializer):
    class Meta:
        model = Source
        fields = ("id","name","amount")

class CategorySerializers(serializers.ModelSerializer):
    source_set = SourceSerializers(many=True, read_only=True)

    class Meta:
        model = Category
        fields = ("id","name","amount","source_set")

# 序列化，通过source获得article
class ArticleSerializers(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = ("id","title","link","summary","time","key_word","status")


class SourceToArticleSerializer(serializers.ModelSerializer):

    # article_set = ArticleSerializers(many=True,read_only=True)
    article_set = serializers.SerializerMethodField('get_article')

    def get_article(self, source):
        begin = self.context['begin']
        end = self.context['end']
        articles = source.article_set.filter(status=0).order_by("-id")[begin:end]
        return ArticleSerializers(instance=articles, many=True).data

    class Meta:
        model = Source
        fields = ("id","name","amount","article_set")
