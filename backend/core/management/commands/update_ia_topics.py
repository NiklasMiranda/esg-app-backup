import json
import os
from django.core.management.base import BaseCommand, CommandError
from core.models import Question, SubCategory

class Command(BaseCommand):
    help = 'Updates the topic field for existing IA questions based on a JSON map with full details.'

    def handle(self, *args, **options):
        # Determine the path to the JSON map file
        project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
        json_file_path = os.path.join(project_root, 'ia_question_details_for_update.json')

        if not os.path.exists(json_file_path):
            raise CommandError(f'JSON details file not found at {json_file_path}')

        self.stdout.write(f'Attempting to update IA question topics from: {json_file_path}')

        try:
            with open(json_file_path, 'r', encoding='utf-8') as f:
                questions_for_update = json.load(f)
        except json.JSONDecodeError:
            raise CommandError(f'Error decoding JSON from {json_file_path}. Please check file format.')
        except Exception as e:
            raise CommandError(f'Error reading file {json_file_path}: {e}')

        self.stdout.write(f'Loaded {len(questions_for_update)} question details for update.')

        updated_count = 0
        for q_detail in questions_for_update:
            sub_category_label = q_detail.get('sub_category_label')
            number = q_detail.get('number')
            text = q_detail.get('text')
            topic_value = q_detail.get('topic')

            if not all([sub_category_label, number, text, topic_value]):
                self.stderr.write(self.style.WARNING(f'Skipping entry due to missing required fields: {q_detail}'))
                continue
            
            try:
                # Find the SubCategory first
                sub_category_obj = SubCategory.objects.get(label=sub_category_label)
                
                # Then find the Question using question_type, sub_category, number, and text
                question = Question.objects.get(
                    question_type='IA',
                    sub_category=sub_category_obj,
                    number=number,
                    text=text # Use text for more specific matching
                )

                if question.topic != topic_value:
                    question.topic = topic_value
                    question.save()
                    updated_count += 1
                    self.stdout.write(self.style.SUCCESS(f'Updated question {number} in {sub_category_label} with topic: "{topic_value}"'))
                else:
                    self.stdout.write(self.style.MIGRATE_HEADING(f'Question {number} in {sub_category_label} already has topic: "{topic_value}". Skipping.'))
            except SubCategory.DoesNotExist:
                self.stderr.write(self.style.ERROR(f'SubCategory with label "{sub_category_label}" not found. Skipping question {number}.'))
            except Question.DoesNotExist:
                self.stderr.write(self.style.WARNING(f'IA Question with number "{number}" and text "{text[:50]}..." in {sub_category_label} not found. Skipping.'))
            except Question.MultipleObjectsReturned:
                self.stderr.write(self.style.ERROR(f'Multiple IA Questions found for number "{number}" and text "{text[:50]}..." in {sub_category_label}. Manual inspection needed.'))
            except Exception as e:
                self.stderr.write(self.style.ERROR(f'Error updating question {number} in {sub_category_label}: {e}'))

        self.stdout.write(self.style.SUCCESS(f'Successfully updated {updated_count} IA question topics.'))
