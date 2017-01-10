#!/usr/bin/env python
# -*- coding:utf-8 -*-

from __future__ import absolute_import
from rss_contents.celery import app
import time

@app.task
def sayHi():
    print "Hi TabWeng"
    for i in range(1000):
        time.sleep(1)
        print i
