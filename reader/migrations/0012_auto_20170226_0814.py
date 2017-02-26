# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('reader', '0011_auto_20170224_0809'),
    ]

    operations = [
        migrations.AlterField(
            model_name='filter',
            name='filter_key_num',
            field=models.CharField(default=b'[0,0,0,0,0,0,0,0,0,0]', max_length=200, null=True),
        ),
        migrations.AlterField(
            model_name='filter',
            name='prior_data',
            field=models.CharField(default=b'[2,1,1]', max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='filter',
            name='recommend_key_num',
            field=models.CharField(default=b'[1,1,1,1,1,1,1,1,1,1]', max_length=200, null=True),
        ),
    ]
