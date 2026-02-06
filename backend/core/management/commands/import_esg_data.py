import json
import re
from django.core.management.base import BaseCommand
from core.models import Category, SubCategory, Question

class Command(BaseCommand):
    help = 'Imports ESG data from JavaScript files into Django models.'

    def _extract_js_array(self, file_path, var_name):
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        # Find the array assignment, assuming it's a direct export
        match = re.search(rf'export const {var_name} = (\[.*?\])', content, re.DOTALL)
        if match:
            # Replace single quotes with double quotes for valid JSON
            json_string = match.group(1).replace("'", '"')
            # Fix unquoted keys if necessary (simple regex for common cases)
            json_string = re.sub(r'([{,]\s*)([a-zA-Z0-9_]+)(\s*:)', r'\1"\2"\3', json_string)
            json_string = re.sub(r',\s*([\]}])', r'\1', json_string) # Remove trailing commas
            return json.loads(json_string)
        return []

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting ESG data import...'))

        # Paths to your JS files
        dva_file_path = 'src/data/dvaQuestions.js'
        ia_file_path = 'src/data/iaQuestions.js'

        # Extract data from JS files
        dva_questions_data = self._extract_js_array(dva_file_path, 'dvaQuestions')
        ia_questions_data = self._extract_js_array(ia_file_path, 'iaQuestions')

        self.stdout.write(self.style.SUCCESS(f'Found {len(dva_questions_data)} DVA questions and {len(ia_questions_data)} IA questions.'))

        # Import DVA Questions
        for q_data in dva_questions_data:
            category, _ = Category.objects.get_or_create(
                code=q_data['category'],
                defaults={'name': f"Category {q_data['category']}"} # Default name, can be updated later
            )
            sub_category, _ = SubCategory.objects.get_or_create(
                category=category,
                label=q_data['label'],
                defaults={'title': f"SubCategory {q_data['label']}"} # Default title, can be updated later
            )
            Question.objects.get_or_create(
                id=q_data['id'], # Assuming IDs are unique and stable for initial import
                defaults={
                    'question_type': 'DVA',
                    'sub_category': sub_category,
                    'text': q_data['text'],
                    'purpose': q_data['purpose'],
                }
            )
        self.stdout.write(self.style.SUCCESS('DVA questions imported successfully.'))

        # Import IA Questions
        for q_data in ia_questions_data:
            category, _ = Category.objects.get_or_create(
                code=q_data['category'],
                defaults={'name': f"Category {q_data['category']}"}
            )
            # For IA, 'subcategory' from JS might be a better 'title' for SubCategory
            sub_category, _ = SubCategory.objects.get_or_create(
                category=category,
                label=q_data['label'],
                defaults={'title': q_data['subcategory']} # Use 'subcategory' from JS for title
            )
            Question.objects.get_or_create(
                id=q_data['id'], # Assuming IDs are unique and stable for initial import
                defaults={
                    'question_type': 'IA',
                    'sub_category': sub_category,
                    'text': q_data['text'],
                    'points': q_data['points'],
                    'number': q_data['number'],
                    'topic': q_data.get('secondSubcategory', ''), # Map secondSubcategory to topic
                }
            )
        self.stdout.write(self.style.SUCCESS('IA questions imported successfully.'))

        self.stdout.write(self.style.SUCCESS('ESG data import completed.'))
