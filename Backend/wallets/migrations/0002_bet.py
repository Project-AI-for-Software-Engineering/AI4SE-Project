# Generated by Django 4.2.14 on 2024-07-26 12:36

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('wallets', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Bet',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('eventId', models.TextField()),
                ('home', models.TextField()),
                ('away', models.TextField()),
                ('amount', models.DecimalField(decimal_places=2, max_digits=10)),
                ('bet', models.TextField()),
                ('result', models.TextField()),
                ('sender', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sent_bet', to='wallets.wallet')),
            ],
        ),
    ]
