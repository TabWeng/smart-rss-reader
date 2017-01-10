#!/usr/bin/python
# -*- coding:utf-8 -*-
from django.db import models
from django.utils import timezone

# Create your models here.

# 类别模型
class Category(models.Model):
    name = models.CharField(max_length=30)
    amount = models.IntegerField(default=0,null=True)

# RSS源模型
class Source(models.Model):
    name = models.CharField(max_length=50)
    rss_link = models.URLField()
    amount = models.IntegerField(default=0,null=True)
    # 外键，连接类别
    category = models.ForeignKey(Category)

# 文章模型
class Article(models.Model):
    title = models.CharField(max_length=80)
    link = models.URLField()
    summary = models.CharField(max_length=255)
    time = models.DateTimeField(default=timezone.now)
    key_word = models.CharField(max_length=200, null=True)
    # 外键，连接RSS源
    source = models.ForeignKey(Source)

# 过滤组模型
class Filter(models.Model):
    name = models.CharField(max_length=50)
    filter_word = models.CharField(max_length=510,null=True)
    # 外键，连接类别
    category = models.ForeignKey(Category)

# 过滤标记模型
class Filter_sign(models.Model):
    # 两组外键
    filter = models.ForeignKey(Filter)
    article = models.ForeignKey(Article)
    is_filter = models.NullBooleanField(default="null",null=True)

