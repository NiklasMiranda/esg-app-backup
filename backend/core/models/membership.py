from django.contrib.auth.models import User
from django.db import models

from .company import Company


class CompanyMembership(models.Model):

    class Role(models.TextChoices):
        OWNER = "owner"
        ADMIN = "admin"
        EDITOR = "editor"
        VIEWER = "viewer"

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="company_memberships",
    )

    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name="memberships",
    )

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
    )

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("user", "company")
        verbose_name = "Company Membership"
        verbose_name_plural = "Company Memberships"

    def __str__(self):
        return f"{self.user.username} -> {self.company.name} ({self.role})"