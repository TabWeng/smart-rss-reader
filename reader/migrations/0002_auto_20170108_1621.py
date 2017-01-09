# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('reader', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='article',
            name='key_word',
            field=models.CharField(max_length=200, null=True),
        ),
        migrations.AlterField(
            model_name='category',
            name='amount',
            field=models.IntegerField(null=True),
        ),
        migrations.AlterField(
            model_name='filter',
            name='filter_word',
            field=models.CharField(max_length=510, null=True),
        ),
        migrations.AlterField(
            model_name='source',
            name='amount',
            field=models.IntegerField(null=True),
        ),
    ]
