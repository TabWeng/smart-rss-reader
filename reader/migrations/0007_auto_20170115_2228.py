# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('reader', '0006_article_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='article',
            name='summary',
            field=models.CharField(max_length=1000),
        ),
    ]
