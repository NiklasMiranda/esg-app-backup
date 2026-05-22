from django.contrib.auth.models import User
from django.db import models


class Company(models.Model):
    """Represents a client company."""
    name = models.CharField(max_length=255)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, help_text="Admin user linked to this company")

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Companies"