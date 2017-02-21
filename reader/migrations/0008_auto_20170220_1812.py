# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('reader', '0007_auto_20170115_2228'),
    ]

    operations = [
        migrations.AddField(
            model_name='filter',
            name='filter_key_num',
            field=models.CharField(max_length=200, null=True),
        ),
        migrations.AddField(
            model_name='filter',
            name='prior_data',
            field=models.CharField(max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='filter',
            name='recommend_key_num',
            field=models.CharField(max_length=200, null=True),
        ),
    ]
