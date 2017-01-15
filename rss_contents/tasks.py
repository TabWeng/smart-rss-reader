#!/usr/bin/env python
# -*- coding:utf-8 -*-
from __future__ import absolute_import
from rss_contents.celery import app
import feedparser
from reader.models import Source,Article
from time import sleep
from django.db.models import Max
# 分词用
import re
import jieba.analyse

# 文章处理
@app.task
def processArticle():
    while True:
        getArticle()
        sleep(60 * 5)

# 获得文章
def getArticle():
    # 遍历获得source,存入列表
    links = Source.objects.values("rss_link","id")
    # 分别取出链接，进行操作
    for link in links:
        processLinks(link["rss_link"],link["id"])

# 对链接进行解析，并写入数据库
# link是要分析的链接，id是该链接对应的source
def processLinks(link,id):
    # 获取数据库最新的一条数据的link，如果是首次，则为空
    getLast = Article.objects.filter(source_id=id)
    last_link = ""
    if getLast:
        last_id = Article.objects.filter(source_id=id).aggregate(last_id=Max("id"))
        last_link = Article.objects.filter(id=last_id["last_id"]).values("link")[0]["link"]

    # 解析链接
    f = feedparser.parse(link)
    htmlTags = re.compile('<[\s|\S]*?>|lt|nbsp|gt')

    # 定义一个栈，用来控制更新
    stack = []
    for entry in f["entries"]:
        if entry["link"] == last_link:
            break
        else:
            stack.append(entry)

    for i in range(len(stack)):
        entry = stack.pop()
        get_link = entry["link"]
        # 如果是当前与数据库最新的数据匹配，那么就停止之后的数据抓取

        get_title = entry["title"].encode("utf-8")
        get_summary = entry['summary'].encode('utf-8')
        get_source_id = id

        # 获得关键词
        # 去掉html标签
        textSummary = htmlTags.sub('', get_summary)
        allContents = textSummary + get_title #把标题也加进来
        # 获得前十个关键词
        tags = jieba.analyse.extract_tags(allContents, topK=10)
        # 逗号分开，存入数据库
        get_key_word = ','.join(tags)

        article = Article()
        article.title = get_title
        article.link = get_link
        article.summary = textSummary
        article.source_id = get_source_id
        article.key_word = get_key_word
        article.save()



