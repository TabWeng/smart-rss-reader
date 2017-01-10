#!/usr/bin/env python
# -*- coding:utf-8 -*-

from __future__ import absolute_import

CELERY_RESULT_BACKEND = 'redis://127.0.0.1:6379/5'
BROKER_URL = 'redis://127.0.0.1:6379/6'

# CELERY_TIMEZONE = 'Asia/Shanghai'
#
# from datetime import timedelta
#
# CELERYBEAT_SCHEDULE = {
#     'add-every-1-seconds': {
#          'task': 'rss_contents.tasks.sayHi',
#          'schedule': timedelta(seconds=1),
#          'args': (16, 16)
#     },
# }