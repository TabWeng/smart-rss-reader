# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('reader', '0002_auto_20170108_1621'),
    ]

    operations = [
        migrations.AlterField(
            model_name='category',
            name='amount',
            field=models.IntegerField(default=0, null=True),
        ),
        migrations.AlterField(
            model_name='source',
            name='amount',
            field=models.IntegerField(default=0, null=True),
        ),
    ]
