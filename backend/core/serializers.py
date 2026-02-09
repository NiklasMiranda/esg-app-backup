from rest_framework import serializers
from .models import Company, Category, SubCategory, Question, Answer, Document
from django.db import transaction

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class SubCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SubCategory
        fields = '__all__'

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'

class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = '__all__'

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = '__all__'

class IaAnswerDetailSerializer(serializers.Serializer):
    is_answered = serializers.BooleanField(required=False, default=False)
    metric_value = serializers.CharField(allow_blank=True, required=False, default='')

class UserAnswerSerializer(serializers.Serializer):
    company_id = serializers.PrimaryKeyRelatedField(queryset=Company.objects.all(), source='company')
    dvaAnswers = serializers.DictField(child=serializers.CharField(), required=False, default={})
    iaAnswers = serializers.DictField(child=IaAnswerDetailSerializer(), required=False, default={})

    def to_representation(self, instance):
        # instance here is a Company object
        year = self.context.get('year')
        if not year:
            raise serializers.ValidationError("Year must be provided in the serializer context.")

        dva_answers = {}
        ia_answers = {}

        # Filter answers by the provided year
        answers_for_year = instance.answers.filter(year=year)

        for answer_obj in answers_for_year:
            if answer_obj.question.question_type == 'DVA':
                dva_answers[str(answer_obj.question.id)] = 'yes' if answer_obj.boolean_answer else 'no'
            elif answer_obj.question.question_type == 'IA':
                ia_answers[str(answer_obj.question.id)] = {
                    'is_answered': answer_obj.is_answered,
                    'metric_value': answer_obj.metric_value
                }
        return {
            'company_id': instance.id,
            'dvaAnswers': dva_answers,
            'iaAnswers': ia_answers,
        }

    def update(self, instance, validated_data):
        company = instance
        dva_answers_data = validated_data.get('dvaAnswers', {})
        ia_answers_data = validated_data.get('iaAnswers', {})
        year = self.context.get('year')

        if not year:
            raise serializers.ValidationError("Year must be provided in the serializer context for updating answers.")

        with transaction.atomic():
            # Process DVA answers
            for question_id_str, answer_value in dva_answers_data.items():
                try:
                    question = Question.objects.get(id=int(question_id_str), question_type='DVA')
                    boolean_answer = True if answer_value == 'yes' else False
                    Answer.objects.update_or_create(
                        company=company,
                        question=question,
                        year=year,
                        defaults={'boolean_answer': boolean_answer, 'is_answered': False, 'metric_value': ''},
                    )
                except Question.DoesNotExist:
                    self.fail(f"DVA Question with id {question_id_str} not found.")

            # Process IA answers
            for question_id_str, ia_answer_data in ia_answers_data.items():
                try:
                    question = Question.objects.get(id=int(question_id_str)) # Get by ID only first
                    if question.question_type != 'IA':
                        raise serializers.ValidationError(f"Question with ID {question_id_str} is not an IA question.")
                    
                    is_answered_value = ia_answer_data.get('is_answered', False)
                    metric_value = ia_answer_data.get('metric_value', '')

                    Answer.objects.update_or_create(
                        company=company,
                        question=question,
                        year=year,
                        defaults={'is_answered': is_answered_value, 'metric_value': metric_value, 'boolean_answer': None},
                    )
                    print(f"DEBUG: IA Answer for Q{question.id} ({year}) updated/created. is_answered: {is_answered_value}, metric_value: '{metric_value}'")
                except Question.DoesNotExist:
                    self.fail(f"IA Question with id {question_id_str} not found.")
                except Exception as e:
                    print(f"Unhandled exception during IA answer processing for question {question_id_str}: {e}")
                    raise serializers.ValidationError(f"Error processing IA question {question_id_str}: {e}")

        # Ensure the company instance has the latest answers
        company.refresh_from_db()
        return company


class CalculationResultSerializer(serializers.Serializer):
    company_id = serializers.IntegerField()
    year = serializers.IntegerField()
    criteriaWeights = serializers.DictField(child=serializers.IntegerField())
    impactFinansielCounts = serializers.DictField(child=serializers.DictField(child=serializers.IntegerField()))
    maxScores = serializers.DictField(child=serializers.FloatField())
    finalScores = serializers.DictField(child=serializers.FloatField())
    totalScore = serializers.FloatField()
    esgLevel = serializers.CharField()
    indicatorPoints = serializers.DictField(child=serializers.IntegerField())
