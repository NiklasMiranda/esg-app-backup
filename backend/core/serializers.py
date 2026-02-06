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

class UserAnswerSerializer(serializers.Serializer):
    company_id = serializers.PrimaryKeyRelatedField(queryset=Company.objects.all(), source='company')
    dvaAnswers = serializers.DictField(child=serializers.CharField(), required=False, default={})
    iaAnswers = serializers.DictField(child=serializers.BooleanField(), required=False, default={})

    def to_representation(self, instance):
        # instance here is a Company object
        dva_answers = {}
        ia_answers = {}
        for answer_obj in instance.answers.all():
            if answer_obj.question.question_type == 'DVA':
                dva_answers[str(answer_obj.question.id)] = 'yes' if answer_obj.boolean_answer else 'no'
            elif answer_obj.question.question_type == 'IA':
                ia_answers[str(answer_obj.question.id)] = answer_obj.is_answered
                # metric_value is not handled here, will need to extend if needed

        return {
            'company_id': instance.id,
            'dvaAnswers': dva_answers,
            'iaAnswers': ia_answers,
        }

    def update(self, instance, validated_data):
        # instance here is the Company object
        company = instance
        dva_answers_data = validated_data.get('dvaAnswers', {})
        ia_answers_data = validated_data.get('iaAnswers', {})

        # Assuming a default year for now. This will need to be dynamic later.
        current_year = 2026 

        with transaction.atomic():
            # Process DVA answers
            for question_id_str, answer_value in dva_answers_data.items():
                try:
                    question = Question.objects.get(id=int(question_id_str), question_type='DVA')
                    boolean_answer = True if answer_value == 'yes' else False
                    answer_instance, created = Answer.objects.update_or_create(
                        company=company,
                        question=question,
                        year=current_year,
                        defaults={'boolean_answer': boolean_answer, 'is_answered': False, 'metric_value': ''},
                        boolean_answer=boolean_answer,
                        is_answered=False,
                        metric_value=''
                    )
                except Question.DoesNotExist:
                    self.fail(f"DVA Question with id {question_id_str} not found.")

            # Process IA answers
            for question_id_str, is_answered_value in ia_answers_data.items():
                try:
                    question = Question.objects.get(id=int(question_id_str), question_type='IA')
                    answer_instance, created = Answer.objects.update_or_create(
                        company=company,
                        question=question,
                        year=current_year,
                        defaults={'is_answered': is_answered_value, 'boolean_answer': None},
                        is_answered=is_answered_value,
                        boolean_answer=None
                    )
                except Question.DoesNotExist:
                    self.fail(f"IA Question with id {question_id_str} not found.")

        # Ensure the company instance has the latest answers
        company.refresh_from_db()
        return company # The update method should return the instance itself


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
