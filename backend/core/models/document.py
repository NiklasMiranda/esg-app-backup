from django.db import models

from ..validators import validate_file_security
from .company import Company


class Document(models.Model):
    """A file uploaded to support ESG documentation."""
    STATUS_CHOICES = (
        ('pending', 'Ikke-tjekket'),
        ('incomplete', 'Mangelfuldt'),
        ('approved', 'Godkendt'),
    )

    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='documents')
    year = models.PositiveIntegerField(help_text="The reporting year")
    topic = models.CharField(max_length=255, help_text="e.g., 1.1 CO2 udledninger")
    
    file = models.FileField(upload_to='documents/%Y/%m/%d/', validators=[validate_file_security])
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    admin_comment = models.TextField(blank=True, null=True, help_text="Admin feedback if status is incomplete")
    
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.file.name} ({self.company.name} - {self.year})"

    class Meta:
        ordering = ['-uploaded_at']