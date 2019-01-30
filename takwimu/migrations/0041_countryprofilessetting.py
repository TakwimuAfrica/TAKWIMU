# -*- coding: utf-8 -*-
# Generated by Django 1.11.16 on 2018-11-09 12:08
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('wagtailcore', '0040_page_draft_title'),
        ('takwimu', '0040_countrypublishsetting'),
    ]

    operations = [
        migrations.CreateModel(
            name='CountryProfilesSetting',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('BF', models.BooleanField(default=True, verbose_name=b'Burkina Faso')),
                ('CD', models.BooleanField(default=True, verbose_name=b'Congo, the Democratic Republic of the')),
                ('ET', models.BooleanField(default=True, verbose_name=b'Ethiopia')),
                ('KE', models.BooleanField(default=True, verbose_name=b'Kenya')),
                ('NG', models.BooleanField(default=True, verbose_name=b'Nigeria')),
                ('SN', models.BooleanField(default=True, verbose_name=b'Senegal')),
                ('ZA', models.BooleanField(default=True, verbose_name=b'South Africa')),
                ('TZ', models.BooleanField(default=True, verbose_name=b'Tanzania, United Republic of')),
                ('UG', models.BooleanField(default=False, verbose_name=b'Uganda')),
                ('ZM', models.BooleanField(default=False, verbose_name=b'Zambia')),
                ('site', models.OneToOneField(editable=False, on_delete=django.db.models.deletion.CASCADE, to='wagtailcore.Site')),
            ],
            options={
                'verbose_name': 'Country Profiles',
            },
        ),
    ]