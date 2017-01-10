#!/usr/bin/env python
# -*- coding:utf-8 -*-

from __future__ import absolute_import
from celery import Celery

app = Celery('rss_contents', include=['rss_contents.tasks'])

app.config_from_object('rss_contents.config')

if __name__ == '__main__':
    app.start()