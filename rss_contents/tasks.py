#!/usr/bin/env python
# -*- coding:utf-8 -*-
from __future__ import absolute_import
from rss_contents.celery import app
import feedparser
from reader.models import Source,Article,Category,Filter,Filter_sign
from time import sleep
from datetime import date,datetime
from django.db.models import Max,Sum
# 分词用
import re
import jieba.analyse

# 文章处理
@app.task
def processArticle():
    while True:
        getArticle()
        sleep(5 * 60)

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
    # 获得属于该source的所有文章
    getLast = Article.objects.filter(source_id=id)
    # last_link = ""
    last_time = date.min
    # 如果Article这张表有内容，说明不是第一次，则getLast不为空，那么执行if里面的语句，否则不执行
    if getLast:
        # 获得在数据库中该source的最新的一篇文章，取id最大的则是，所以用Max
        last_id = Article.objects.filter(source_id=id).aggregate(last_id=Max("id"))
        # 获得id后，就可以获得该文章的link了
        # last_link = Article.objects.filter(id=last_id["last_id"]).values("link")[0]["link"]
        last_time = Article.objects.filter(id=last_id["last_id"]).values("time")[0]["time"]

    # 解析链接
    # 解析link，看看是否有更新
    f = feedparser.parse(link)
    # 去除标签、空格等其他无用字符的正则匹配
    htmlTags = re.compile('<[\s|\S]*?>|lt|nbsp|gt|&;')

    # 定义一个栈，用来控制更新
    stack = []
    for entry in f["entries"]:
        # if entry["link"] == last_link:
        if entry['published'].encode("utf-8") <= str(last_time):
            break
        else:
            stack.append(entry)

    for i in range(len(stack)):
        entry = stack.pop()
        get_link = entry["link"]
        # 如果是当前与数据库最新的数据匹配，那么就停止之后的数据抓取

        get_title = entry["title"].encode("utf-8")
        get_summary = entry['summary'].encode('utf-8')
        get_time = entry['published'].encode("utf-8")
        get_source_id = id

        # 获得关键词
        # 去掉html标签
        textSummary = htmlTags.sub('', get_summary)
        allContents = textSummary + get_title #把标题也加进来
        # 获得前十个关键词
        tags = jieba.analyse.extract_tags(allContents, topK=10)
        # 以列表的形式，存入数据库
        get_key_word = '["'+'","'.join(tags)+'"]'

        # 写入数据库
        article = Article()
        article.title = get_title
        article.link = get_link
        article.time = get_time

        if len(textSummary) > 280:
            textSummary = textSummary[:280]
        article.summary = textSummary

        article.source_id = get_source_id
        article.key_word = get_key_word
        article.save()

        # 更新到分类器中
        category_id = Source.objects.filter(id=get_source_id).values("category_id")[0]["category_id"]
        filter_list = Filter.objects.filter(category_id=category_id)
        for theFilter in filter_list:
            # 分类器的核心词库等
            key_words = theFilter.filter_word
            prior_data = theFilter.prior_data
            recommend_key_num = theFilter.recommend_key_num
            filter_key_num = theFilter.filter_key_num

            key_words = eval(key_words)
            prior_data = eval(prior_data)
            recommend_key_num = eval(recommend_key_num)
            filter_key_num = eval(filter_key_num)

            temp_sign = []
            for keyWord in eval(get_key_word):
                if keyWord.lower() in key_words:
                    temp_sign.append(1)
                else:
                    temp_sign.append(0)

            # 全部训练样本数
            sum = prior_data[0]
            # 全部推荐数
            recommend_sum = prior_data[1]
            # 全部过滤数
            filter_sum = prior_data[2]

            # 计算推荐概率和过滤概率
            i = 0
            for temp in temp_sign:
                if temp == 0:
                    recommend_sum *= (sum - recommend_key_num[i])
                    filter_sum *= (sum - filter_key_num[i])
                else:
                    recommend_sum *= recommend_key_num[i]
                    filter_sum *= filter_key_num[i]
                i += 1

            is_filter = 0
            if recommend_sum >= filter_sum:
                # 推荐
                is_filter = 1
            else:
                # 过滤
                is_filter = 2

            filter_sign = Filter_sign()
            filter_sign.filter_id = theFilter.id
            filter_sign.article_id = article.id
            filter_sign.is_filter = is_filter
            filter_sign.save()

        print "ok--"+str(id)

    # 更新source的amount总数,未读的总数
    source_amount = Article.objects.filter(source_id=id, status=0).count() #获得amount
    Source.objects.filter(id=id).update(amount=source_amount)
    print "article update success"
    # 更新category的amount未读总数
    category_id = Source.objects.filter(id=id).values("category_id")[0]["category_id"]
    category_amount = Source.objects.filter(category_id=category_id).aggregate(Sum('amount'))["amount__sum"]
    Category.objects.filter(id=category_id).update(amount=category_amount)

