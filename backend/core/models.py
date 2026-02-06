from django.db import models
from django.contrib.auth.models import User

class Company(models.Model):
    """Represents a client company."""
    name = models.CharField(max_length=255)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, help_text="Admin user linked to this company")

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Companies"

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
    topic = models.CharField(max_length=255, blank=True, help_text="e.g., Co2-udledninger. From iaQuestions.secondSubcategory")
    points = models.IntegerField(null=True, blank=True)
    number = models.CharField(max_length=20, blank=True, help_text="Hierarchical number, e.g., 1.1.1")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"[{self.question_type}/{self.sub_category.label}] {self.text[:80]}..."

    class Meta:
        ordering = ['question_type', 'sub_category', 'number', 'id']


class Answer(models.Model):
    """Stores a company's answer to a question for a specific year."""
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='answers')
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='answers')
    year = models.PositiveIntegerField(help_text="The reporting year")
    
    # DVA answers are boolean (True/False)
    boolean_answer = models.BooleanField(null=True, blank=True, help_text="For DVA questions")
    
    # IA answers are a "checked" state, and can have a metric
    is_answered = models.BooleanField(default=False, help_text="For IA questions (i.e., is the initiative implemented?)")
    metric_value = models.CharField(max_length=255, blank=True, help_text="Optional metric/value associated with an IA answer")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Answer for {self.company.name} on Q{self.question.id} ({self.year})"

    class Meta:
        # A company can only have one answer per question per year
        unique_together = ('company', 'question', 'year')
        ordering = ['-year', 'question']


class Document(models.Model):
    """A file uploaded to support an answer."""
    answer = models.ForeignKey(Answer, on_delete=models.CASCADE, related_name='documents')
    description = models.CharField(max_length=255, blank=True)
    file = models.FileField(upload_to='documents/%Y/%m/%d/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Document for {self.answer}"