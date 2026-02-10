import json
import os
from django.core.management.base import BaseCommand, CommandError
from core.models import Question, Category as QuestionCategory, SubCategory # Import SubCategory

class Command(BaseCommand):
    help = 'Imports DVA questions from a JSON file into the database.'

    def handle(self, *args, **options):
        project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
        json_file_path = os.path.join(project_root, 'dva_questions_data.json') # Expect in backend directory

        if not os.path.exists(json_file_path):
            raise CommandError(f'JSON file not found at {json_file_path}')

        self.stdout.write(f'Attempting to import DVA questions from: {json_file_path}')

        try:
            with open(json_file_path, 'r', encoding='utf-8') as f:
                questions_data = json.load(f)
        except json.JSONDecodeError:
            raise CommandError(f'Error decoding JSON from {json_file_path}. Please check file format.')
        except Exception as e:
            raise CommandError(f'Error reading file {json_file_path}: {e}')

        self.stdout.write(f'Found {len(questions_data)} DVA questions in the JSON file.')

        for q_data in questions_data:
            question_id = q_data.get('id')
            category_name = q_data.get('category')
            label = q_data.get('label')
            purpose = q_data.get('purpose')
            text = q_data.get('text')
            
            # DVA questions do not have secondSubcategory, points, number directly in the JSON
            # However, question text is mandatory

            if not all([question_id, category_name, label, purpose, text]):
                self.stderr.write(self.style.WARNING(f'Skipping DVA question {question_id} due to missing required fields: {q_data}'))
                continue
            
            # Map category_name (E, S, G) to full names for the Category model
            category_full_name = {
                'E': 'Environmental',
                'S': 'Social',
                'G': 'Governance',
            }.get(category_name, category_name)

            # Find or create Category (E, S, G)
            try:
                main_category, created = QuestionCategory.objects.get_or_create(
                    code=category_name,
                    defaults={'name': category_full_name}
                )
                if created:
                    self.stdout.write(self.style.SUCCESS(f'Created Category: {main_category.name} ({main_category.code})'))
            except Exception as e:
                self.stderr.write(self.style.ERROR(f"Error getting/creating main Category '{category_name}': {e}"))
                continue

            # Find or create SubCategory (E1, S1, G1 etc.)
            # For DVA questions, the subcategory title is often just the label or a generic description
            try:
                sub_category_obj, created = SubCategory.objects.get_or_create(
                    category=main_category,
                    label=label,
                    defaults={'title': f'{category_full_name} {label}'} # Generic title for DVA subcategories
                )
                if created:
                    self.stdout.write(self.style.SUCCESS(f'Created SubCategory: {sub_category_obj.label}: {sub_category_obj.title}'))
            except Exception as e:
                self.stderr.write(self.style.ERROR(f"Error getting/creating SubCategory '{label}': {e}"))
                continue
            
            # Create or update the Question
            try:
                question, created = Question.objects.update_or_create(
                    id=question_id,
                    defaults={
                        'sub_category': sub_category_obj,
                        'question_type': 'DVA', # Explicitly set to DVA
                        'text': text,
                        'purpose': purpose, # Set the purpose field
                        'is_active': True,
                        # DVA questions from JS don't have topic, points, number, dva_description, typical_industries
                        # These will remain null/blank as per model definition
                    }
                )
                if created:
                    self.stdout.write(self.style.SUCCESS(f'Successfully created DVA question ID {question.id}: {question.text[:50]}...'))
                else:
                    self.stdout.write(self.style.WARNING(f'Successfully updated DVA question ID {question.id}: {question.text[:50]}...'))

            except Exception as e:
                self.stderr.write(self.style.ERROR(f"Error importing DVA question ID {question_id}: {e}"))

        self.stdout.write(self.style.SUCCESS('DVA questions import completed.'))
