# Generated by Django 5.0.4 on 2024-05-02 19:16

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='SVG_image',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('width', models.PositiveIntegerField()),
                ('height', models.PositiveIntegerField()),
                ('description', models.CharField(blank=True, max_length=200)),
                ('pub_date', models.DateTimeField()),
                ('permitted_users', models.ManyToManyField(to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]