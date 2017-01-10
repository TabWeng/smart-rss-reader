# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('reader', '0003_auto_20170108_1641'),
    ]

    operations = [
        migrations.AddField(
            model_name='article',
            name='time',
            field=models.DateTimeField(default=datetime.datetime(2017, 1, 9, 23, 44, 17, 893000, tzinfo=utc)),
        ),
    ]
