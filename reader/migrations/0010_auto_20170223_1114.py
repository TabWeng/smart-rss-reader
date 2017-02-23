# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('reader', '0009_auto_20170220_2027'),
    ]

    operations = [
        migrations.AddField(
            model_name='filter_sign',
            name='is_train',
            field=models.IntegerField(default=0, null=True),
        ),
        migrations.AlterField(
            model_name='filter_sign',
            name='is_filter',
            field=models.IntegerField(default=0, null=True),
        ),
    ]
