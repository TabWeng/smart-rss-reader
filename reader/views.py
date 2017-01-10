#!/usr/bin/python
# -*- coding:utf-8 -*-
from django.shortcuts import render
from reader.models import *
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from .serializers import CategorySerializers,SourceSerializers
from django.http import HttpResponse
from django.forms.models import model_to_dict
from .common import *
import feedparser
# Create your views here.

def index(request):
    return render(request,"index.html",locals())

# API
# 侧边栏加载
class CategoryListView(APIView):
    def get(self, request):
        category = Category.objects.all()
        serializers = CategorySerializers(category, many=True)
        return Response(serializers.data)

# API
# 添加类别
def addCategory(request):
    if request.is_ajax() and request.GET:
        get_name = request.GET.get("name")
        find_category = Category.objects.filter(name=get_name)
        if find_category:
            # 类别已经存在
            return HttpResponse(returnStatusJson("400"), content_type="application/json")
        else:
            # 类别不存在
            category = Category()
            category.name = get_name
            category.save()
            contents = model_to_dict(category)
            return HttpResponse(returnStatusJson("200",contents),content_type="application/json")

# API
# 检测 rss 链接是否可用，若可用，返回rss标题名称
def checkRssLink(request):
    if request.is_ajax() and request.GET:
        get_link = request.GET.get("rss_link")
        find_source = Source.objects.filter(rss_link=get_link)
        if find_source:
            # 已经存在rss
            return HttpResponse(returnStatusJson("400"),content_type="application/json")
        else:
            # 不存在rss，添加
            f = feedparser.parse(get_link)
            if f['entries'] == []:
                # 如果不是有效的rss源地址，则返回404
                return HttpResponse(returnStatusJson("404"),content_type="application/json")
            else:
                # 返回rss源的标题
                rss_title = f['feed']['title']
                contents = {"title":rss_title}
                return HttpResponse(returnStatusJson("200",contents),content_type="application/json")

# API
# 添加RSS源
def addRssLink(request):
    if request.is_ajax() and request.GET:
        get_link = request.GET.get("rss_link")
        get_name = request.GET.get("name")
        get_category = request.GET.get("category")
        category_id = Category.objects.filter(name=get_category)[0].id
        # 保存到数据
        source = Source()
        source.rss_link = get_link
        source.name = get_name
        source.category_id = category_id
        source.save()
        contents = {
            "id":source.id,
            "rss_link":get_link,
            "name":get_name,
            "amount":source.amount,
            "category_id": category_id,
        }
        return HttpResponse(returnStatusJson("200",contents),content_type="application/json")
    else:
        return HttpResponse(returnStatusJson("404"), content_type="application/json")

# 轮询获得文章
def getArticle():
    pass


