from django.db import models


class Category(models.Model):
    """Top-level ESG category (E, S, G)."""
    code = models.CharField(max_length=1, unique=True)
    name = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.code}: {self.name}"

    class Meta:
        verbose_name_plural = "Categories"

class SubCategory(models.Model):
    """A sub-category like E1: Climate Change."""
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name='sub_categories')
    label = models.CharField(max_length=10, unique=True)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.label}: {self.title}"

    class Meta:
        verbose_name_plural = "Sub-categories"
        ordering = ['label']