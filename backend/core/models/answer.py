from django.db import models

from .company import Company
from .question import Question


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

    # New: Link to documents
    documents = models.ManyToManyField('Document', blank=True, related_name='answers')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Answer for {self.company.name} on Q{self.question.id} ({self.year})"

    class Meta:
        # A company can only have one answer per question per year
        unique_together = ('company', 'question', 'year')
        ordering = ['-year', 'question']