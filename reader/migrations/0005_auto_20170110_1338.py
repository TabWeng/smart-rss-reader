# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('reader', '0004_article_time'),
    ]

    operations = [
        migrations.AlterField(
            model_name='article',
            name='time',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]
