import json
import os
from django.core.management.base import BaseCommand, CommandError
from core.models import Question, Category as QuestionCategory, SubCategory # Rename Category to avoid conflict

class Command(BaseCommand):
    help = 'Imports IA questions from a JSON file into the database.'

    def handle(self, *args, **options):
        # Determine the base directory of the Django project (esg_api)
        # This assumes the command is run from the project root or the backend directory
        project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
        json_file_path = os.path.join(project_root, 'ia_questions_data.json')

        if not os.path.exists(json_file_path):
            raise CommandError(f'JSON file not found at {json_file_path}')

        self.stdout.write(f'Attempting to import questions from: {json_file_path}')

        try:
            with open(json_file_path, 'r', encoding='utf-8') as f:
                questions_data = json.load(f)
        except json.JSONDecodeError:
            raise CommandError(f'Error decoding JSON from {json_file_path}. Please check file format.')
        except Exception as e:
            raise CommandError(f'Error reading file {json_file_path}: {e}')

        self.stdout.write(f'Found {len(questions_data)} questions in the JSON file.')

        for q_data in questions_data:
            question_id = q_data.get('id')
            label = q_data.get('label')
            text = q_data.get('text')
            category_name = q_data.get('category')
            subcategory_name = q_data.get('subcategory')
            second_subcategory_name = q_data.get('secondSubcategory')
            points = q_data.get('points')
            number = q_data.get('number')

            if not all([question_id, label, text, category_name, subcategory_name, points, number]):
                self.stderr.write(self.style.WARNING(f'Skipping question {question_id} due to missing required fields: {q_data}'))
                continue
            
            # Find or create Category and SubCategory objects
            # Note: The model "Category" and "SubCategory" must exist in core.models
            # Ensure Category and SubCategory models have `name` field for lookup
            # Assuming Category and SubCategory are defined in core.models
            # and have a 'name' field for their respective values

            
            # Map category_name (E, S, G) to full names for the Category model
            category_full_name = {
                'E': 'Environmental',
                'S': 'Social',
                'G': 'Governance',
            }.get(category_name, category_name) # Fallback to code if not found

            # Find or create Category (E, S, G)
            try:
                main_category, created = QuestionCategory.objects.get_or_create(
                    code=category_name, # Use 'code' field for E, S, G
                    defaults={'name': category_full_name}
                )
                if created:
                    self.stdout.write(self.style.SUCCESS(f'Created Category: {main_category.name} ({main_category.code})'))
            except Exception as e:
                self.stderr.write(self.style.ERROR(f"Error getting/creating main Category '{category_name}': {e}"))
                continue

            # Find or create SubCategory (E1, S1, G1 etc.)
            # The 'label' from the JSON (e.g., 'E1') maps to SubCategory.label
            # The 'subcategory' from the JSON (e.g., 'Klimaforandringer') maps to SubCategory.title
            try:
                sub_category_obj, created = SubCategory.objects.get_or_create(
                    category=main_category,
                    label=label, # Use 'label' field for E1, S1, G1
                    defaults={'title': subcategory_name} # Use 'subcategory_name' for the title
                )
                if created:
                    self.stdout.write(self.style.SUCCESS(f'Created SubCategory: {sub_category_obj.label}: {sub_category_obj.title}'))
            except Exception as e:
                self.stderr.write(self.style.ERROR(f"Error getting/creating SubCategory '{label} - {subcategory_name}': {e}"))
                continue
            
            # Create or update the Question
            try:
                question, created = Question.objects.update_or_create(
                    id=question_id,
                    defaults={
                        'sub_category': sub_category_obj, # Link to the SubCategory object
                        'question_type': 'IA', # Explicitly set to IA
                        'text': text,
                        'topic': second_subcategory_name, # Map to 'topic' field
                        'points': points,
                        'number': number,
                        'is_active': True, # Default to active
                    }
                )
                if created:
                    self.stdout.write(self.style.SUCCESS(f'Successfully created question ID {question.id}: {question.text[:50]}...'))
                else:
                    self.stdout.write(self.style.WARNING(f'Successfully updated question ID {question.id}: {question.text[:50]}...'))

            except Exception as e:
                self.stderr.write(self.style.ERROR(f"Error importing question ID {question_id}: {e}"))

        self.stdout.write(self.style.SUCCESS('IA questions import completed.'))

