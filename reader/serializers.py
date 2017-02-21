#!/usr/bin/env python
# -*- coding:utf-8 -*-
from rest_framework import serializers
from .models import *

#序列化，通过category获得source
class SourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Source
        fields = ("id","name","amount")


class CategorySerializer(serializers.ModelSerializer):
    source_set = SourceSerializer(many=True, read_only=True)

    class Meta:
        model = Category
        fields = ("id","name","amount","source_set")


# 序列化，通过source获得article
class ArticleSerializer(serializers.ModelSerializer):
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
        return ArticleSerializer(instance=articles, many=True).data

    class Meta:
        model = Source
        fields = ("id","name","amount","article_set")


# class FilterSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Filter
#         fields = ("id","name","filter_word","recommend_show_num","filter_show_num")
#
#
# class CategoryToFilterPlainSerializer(serializers.ModelSerializer):
#     filter_set = serializers.SerializerMethodField('get_filter')
#
#     def get_filter(self, category):
#         source_id = self.context['source_id']
#         if(source_id == "all"):
#             filters = category.filter_set.all()
#         else:
#             filters = category.filter_set.filter()