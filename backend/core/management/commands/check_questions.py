import os
from django.core.management.base import BaseCommand
from core.models import Question, Category, SubCategory # Import all models for comprehensive check

class Command(BaseCommand):
    help = 'Checks the count and provides samples of IA and DVA questions in the database.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('--- Verifying Questions in Database ---'))

        total_questions = Question.objects.count()
        ia_questions_count = Question.objects.filter(question_type='IA').count()
        dva_questions_count = Question.objects.filter(question_type='DVA').count()

        self.stdout.write(f"Total questions: {total_questions}")
        self.stdout.write(f"IA questions: {ia_questions_count}")
        self.stdout.write(f"DVA questions: {dva_questions_count}")

        # Sample IA Question
        sample_ia = Question.objects.filter(question_type='IA').select_related('sub_category', 'sub_category__category').first()
        if sample_ia:
            self.stdout.write(self.style.SUCCESS('\nSample IA Question:'))
            self.stdout.write(f"  ID: {sample_ia.id}")
            self.stdout.write(f"  Type: {sample_ia.question_type}")
            self.stdout.write(f"  Category Code: {sample_ia.sub_category.category.code}")
            self.stdout.write(f"  SubCategory Label: {sample_ia.sub_category.label}")
            self.stdout.write(f"  Text: '{sample_ia.text}'") # Print full text for verification
            self.stdout.write(f"  Topic: {sample_ia.topic if sample_ia.topic else 'N/A (optional field)'}")
            self.stdout.write(f"  Points: {sample_ia.points if sample_ia.points is not None else 'N/A'}")
            self.stdout.write(f"  Number: {sample_ia.number if sample_ia.number else 'N/A'}")
        else:
            self.stdout.write(self.style.WARNING('\nNo IA questions found.'))

        # Sample DVA Question
        sample_dva = Question.objects.filter(question_type='DVA').select_related('sub_category', 'sub_category__category').first()
        if sample_dva:
            self.stdout.write(self.style.SUCCESS('\nSample DVA Question:'))
            self.stdout.write(f"  ID: {sample_dva.id}")
            self.stdout.write(f"  Type: {sample_dva.question_type}")
            self.stdout.write(f"  Category Code: {sample_dva.sub_category.category.code}")
            self.stdout.write(f"  SubCategory Label: {sample_dva.sub_category.label}")
            self.stdout.write(f"  Text: '{sample_dva.text}'") # Print full text for verification
            self.stdout.write(f"  Purpose: {sample_dva.purpose if sample_dva.purpose else 'N/A'}")
            self.stdout.write(f"  DVA Description: {sample_dva.dva_description[:50] if sample_dva.dva_description else 'N/A'}")
        else:
            self.stdout.write(self.style.WARNING('\nNo DVA questions found.'))
        
        # Check a few more questions to get a better sense
        self.stdout.write(self.style.SUCCESS('\n--- Additional Samples (IA) ---'))
        for q_id in [20, 40, 60, 80, 100]: # Sample some IA question IDs
            q = Question.objects.filter(question_type='IA', id=q_id).first()
            if q:
                self.stdout.write(f"IA Q{q.id}: '{q.text}'")

        self.stdout.write(self.style.SUCCESS('\n--- Additional Samples (DVA) ---'))
        for q_id in [1020, 1040, 1060, 1080, 1100]: # Sample some DVA question IDs (original IDs + 1000)
            q = Question.objects.filter(question_type='DVA', id=q_id).first()
            if q:
                self.stdout.write(f"DVA Q{q.id}: '{q.text}'")


        self.stdout.write(self.style.SUCCESS('\n--- Database Verification Complete ---'))