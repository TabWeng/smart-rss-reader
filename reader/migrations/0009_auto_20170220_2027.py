# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('reader', '0008_auto_20170220_1812'),
    ]

    operations = [
        migrations.AddField(
            model_name='filter',
            name='filter_show_num',
            field=models.IntegerField(default=0, null=True),
        ),
        migrations.AddField(
            model_name='filter',
            name='recommend_show_num',
            field=models.IntegerField(default=0, null=True),
        ),
    ]
