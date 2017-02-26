# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('reader', '0010_auto_20170223_1114'),
    ]

    operations = [
        migrations.AlterField(
            model_name='article',
            name='time',
            field=models.CharField(default=b'0', max_length=50),
        ),
    ]
