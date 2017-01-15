#!/usr/bin/env python
# -*- coding:utf-8 -*-

from __future__ import absolute_import
import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'rss_reader.settings')

# from django.conf import settings

app = Celery('rss_contents', include=['rss_contents.tasks'])

app.config_from_object('rss_contents.config')
# app.config_from_object('django.conf:settings')
# app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)

# if __name__ == '__main__':
    # app.start()