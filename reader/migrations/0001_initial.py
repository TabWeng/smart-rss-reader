# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Article',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('title', models.CharField(max_length=80)),
                ('link', models.URLField()),
                ('summary', models.CharField(max_length=255)),
                ('key_word', models.CharField(max_length=200)),
            ],
        ),
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=30)),
                ('amount', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='Filter',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=50)),
                ('filter_word', models.CharField(max_length=510)),
                ('category', models.ForeignKey(to='reader.Category')),
            ],
        ),
        migrations.CreateModel(
            name='Filter_sign',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('is_filter', models.NullBooleanField(default=b'null')),
                ('article', models.ForeignKey(to='reader.Article')),
                ('filter', models.ForeignKey(to='reader.Filter')),
            ],
        ),
        migrations.CreateModel(
            name='Source',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=50)),
                ('rss_link', models.URLField()),
                ('amount', models.IntegerField()),
                ('category', models.ForeignKey(to='reader.Category')),
            ],
        ),
        migrations.AddField(
            model_name='article',
            name='source',
            field=models.ForeignKey(to='reader.Source'),
        ),
    ]
