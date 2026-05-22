from django.db import models

from .category import SubCategory


class Question(models.Model):
    """A single question in the ESG assessment."""
    QUESTION_TYPES = (
        ('DVA', 'Double Materiality Assessment'),
        ('IA', 'Initiative Analysis'),
    )
    
    PURPOSE_CHOICES = (
        ('impact', 'Impact'),
        ('finansiel', 'Financial'),
        (None, 'N/A'),
    )

    question_type = models.CharField(max_length=3, choices=QUESTION_TYPES)
    sub_category = models.ForeignKey(SubCategory, on_delete=models.PROTECT, related_name='questions')
    text = models.TextField()
    is_active = models.BooleanField(default=True)
    
    # DVA-specific fields
    purpose = models.CharField(max_length=10, choices=PURPOSE_CHOICES, null=True, blank=True)
    dva_description = models.TextField(blank=True, help_text="Description for DVA questions")
    typical_industries = models.TextField(blank=True)

    # IA-specific fields
    topic = models.CharField(max_length=255, blank=True, null=True, help_text="e.g., Co2-udledninger. From iaQuestions.secondSubcategory")
    points = models.IntegerField(null=True, blank=True)
    number = models.CharField(max_length=20, blank=True, help_text="Hierarchical number, e.g., 1.1.1")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"[{self.question_type}/{self.sub_category.label}] {self.text[:80]}..."

    class Meta:
        ordering = ['question_type', 'sub_category', 'number', 'id']