#!/usr/bin/python
# -*- coding:utf-8 -*-
from django.shortcuts import render
from reader.models import *
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from .serializers import CategorySerializer,SourceToArticleSerializer
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
        serializers = CategorySerializer(category, many=True)
        return Response(serializers.data)

# API
# 文章加载
class SourceToArticleListView(APIView):
    def get(self,request):
        get_id_arr = request.GET.get("id_arr")

        # 将字符串转化为列表
        id_arr = eval(get_id_arr)
        # 获得source的id
        get_id = id_arr[0]

        # 分页的起止
        begin = request.GET.get("begin")
        end = request.GET.get("end")

        source = Source.objects.filter(id=get_id)
        serializers = SourceToArticleSerializer(source, many=True,context={'begin':begin,"end":end})
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

        # 使用eval()将字符串转化为可执行代码，逆序
        articles = Article.objects.filter(eval(search_condition)).filter(status=0).order_by("-id")[begin:end]
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

#API
# 修改文章的状态
def updateArticleStatus(request):
    if request.is_ajax() and request.GET:
        get_article_id = request.GET.get("id")
        get_target_status = request.GET.get("status")
        # 修改为目标状态
        Article.objects.filter(id=get_article_id).update(status=get_target_status)
        return HttpResponse(returnStatusJson("200"),content_type="application/json")

#API
# 显示过滤组的选项
def showFilterGroup(request):
    if request.is_ajax() and request.GET:
        category_id = request.GET.get("category_id")
        source_id = request.GET.get("source_id")

        items = {}
        i = 0
        filters = Filter.objects.filter(category_id=category_id)
        # 若不为空
        if filters:
            for theFilter in filters:
                item = {
                    i:{
                        "id" : theFilter.id,
                        "name" : theFilter.name,
                        "filter_word" : theFilter.filter_word,
                        "recommend_show_num" : theFilter.recommend_show_num,
                        "filter_show_num" : theFilter.filter_show_num
                    }
                }
                i += 1
                items.update(item)

            content = {"filters":items}
            # return HttpResponse(json.dumps(items), content_type="application/json")
            return HttpResponse(returnStatusJson("200",content), content_type="application/json")
        else:
            return HttpResponse(returnStatusJson("404"), content_type="application/json")

#API
# 检测添加的过滤组名称是否可用
def checkFilterName(request):
    if request.is_ajax() and request.GET:
        filter_name = request.GET.get("filter_name")
        get_filter_name = Filter.objects.filter(name=filter_name)
        if get_filter_name:
            # 已经存在，不可添加
            return HttpResponse(returnStatusJson("400"), content_type="application/json")
        else:
            # 可添加
            return HttpResponse(returnStatusJson("200"), content_type="application/json")

#API
# 添加过滤组
def addFilter(request):
    if request.is_ajax() and request.GET:
        category_name = request.GET.get("category_name")
        filter_name = request.GET.get("filter_name")
        keyWord_arr = request.GET.get("keyWord_arr")

        theFilter = Filter()
        theFilter.name = filter_name
        category_id = Category.objects.filter(name=category_name).values("id")[0]["id"]
        theFilter.category_id = category_id
        theFilter.filter_word = keyWord_arr
        theFilter.save()

        sources = Source.objects.filter(category_id=category_id)
        search_condition = ""
        for source in sources:
            search_condition += "Q(source_id="+str(source.id)+")|"
        search_condition = search_condition[:-1]

        articles = Article.objects.filter(eval(search_condition)).filter(status=0)
        for article in articles:
            filter_sign = Filter_sign()
            filter_sign.article_id = article.id
            filter_sign.filter_id = theFilter.id
            filter_sign.save()

        return HttpResponse(returnStatusJson("200"), content_type="application/json")

#API
# 获得可训练的文章
def getFilterTrainArticle(request):
    if request.is_ajax() and request.GET:
        filter_id = request.GET.get("filter_id")
        begin = request.GET.get("begin")
        end = request.GET.get("end")

        filter_signs = Filter_sign.objects.filter(filter_id=filter_id)
        search_condition = ""
        for i in filter_signs:
            search_condition += "Q(id="+str(i.article_id)+")|"
        search_condition = search_condition[:-1]

        articles = Article.objects.filter(eval(search_condition),status=0)[begin:end].values("id","title","summary","key_word")
        items = {}
        num = 0
        for article in articles:
            item = {
               num:{
                   "id":article["id"],
                   "title":article["title"],
                   "summary":article["summary"],
                   "key_word":article["key_word"]
               }
            }
            num += 1
            items.update(item)

        contents = {"articles":items}

        return HttpResponse(returnStatusJson("200",contents), content_type="application/json")

# class ShowFilterGroupListView(APIView):
#     def get(self,request):
#         category_id = request.GET.get("category_id")
#         source_id = request.GET.get("source_id")
#
#         category = Category.objects.filter(id=category_id)
#
#         serializers = CategoryToFilterPlainSerializer(category,many=True,context={'source_id':source_id})
#         return Response(serializers.data)




