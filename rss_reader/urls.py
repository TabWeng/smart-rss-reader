#!/usr/bin/python
# -*- coding:utf-8 -*-
"""rss_reader URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import include, url
from django.contrib import admin
from reader import views

urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),
    url(r'^index',views.index)
]

# api
urlpatterns += [
    # 侧边栏加载api
    url(r'^api/category_sidebar', views.CategoryListView.as_view()),
    # 添加类别
    url(r'api/add_category', views.addCategory),
    # 添加rss源时，检测rss链接是否可用
    url(r'api/check_rssLink', views.checkRssLink),
    # 添加RSS源
    url(r'api/add_rssLink', views.addRssLink),
    # 加载文章
    url(r'api/show_article', views.SourceToArticleListView.as_view()),
    # 通过类别加载文章
    url(r'api/show_category_article',views.showCategoryToArticle),
    # 通过文章状态
    url(r'api/update_article_status', views.updateArticleStatus),
    # 通过类别显示过滤组的选项
    url(r'api/show_filterGroup', views.showFilterGroup),
    # 添加过滤组时，检测过滤组名称是否可用
    url(r'api/check_filterName', views.checkFilterName),
    # 添加过滤组
    url(r'api/add_filter', views.addFilter)
]