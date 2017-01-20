#!/usr/bin/python
# -*- coding:utf-8 -*-
from django.shortcuts import render
from reader.models import *
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from .serializers import CategorySerializers,SourceToArticleSerializer
from django.http import HttpResponse
from django.forms.models import model_to_dict
from django.db.models import Q
from .common import *
import json
from django.core.paginator import Paginator
from rss_contents import tasks
import feedparser
# Create your views here.

def index(request):
    # tasks.processArticle.delay()
    AppInitializer.initialize()
    return render(request,"index.html",locals())

# API
# 侧边栏加载
class CategoryListView(APIView):
    def get(self, request):
        category = Category.objects.all()
        serializers = CategorySerializers(category, many=True)
        return Response(serializers.data)

# API
# 文章加载
class SourceToArticleListView(APIView):
    def get(self,request):
        get_id = request.GET.get("id")
        source = Source.objects.filter(id=get_id)
        serializers = SourceToArticleSerializer(source, many=True)
        return Response(serializers.data)


# 初始化后台进程
class AppInitializer(object):
    initialized = False
    @classmethod
    def initialize(cls):
        if not cls.initialized:
            cls.initialized = True
            from rss_contents import tasks
            tasks.processArticle.delay()

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
            # 类别不存在，则可以添加
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

# API
# 显示类别文章
def showCategoryToArticle(request):
    if request.is_ajax() and request.GET:
        # 获得要查询的source分类
        get_source_id_arr = request.GET.get("id_arr")

        # 获得分页的开始和分页的结束位置
        begin = request.GET.get("begin")
        end = request.GET.get("end")

        get_source_id_arr = eval(get_source_id_arr) #将字符串转化为数组对象
        search_condition = ""
        for i in get_source_id_arr:
            search_condition += "Q(source_id="+i+")|"

        search_condition = search_condition[:-1]

        # 使用eval()将字符串转化为可执行代码
        articles = Article.objects.filter(eval(search_condition)).order_by("-id")[begin:end]
        items = {}
        i = 0
        for article in articles:
            source_name = Source.objects.filter(id=article.source_id).values("name")[0]["name"]
            item = {
                i:{
                    "id" : article.id,
                    "title" : article.title,
                    "link" : article.link,
                    "summary" : article.summary,
                    "status" : article.status,
                    "source_id" : article.source_id,
                    "source_name": source_name
                }
            }
            i += 1
            items.update(item)

        return HttpResponse(json.dumps(items),content_type="application/json")





