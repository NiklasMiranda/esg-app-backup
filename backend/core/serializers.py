from rest_framework import serializers
from .models import Company, Category, SubCategory, Question, Answer, Document, CompanyBasismodulData, CompanyExtendedModuleData # New Import
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
    category = CategorySerializer(read_only=True) # Nested serializer for the category

    class Meta:
        model = SubCategory
        fields = ['id', 'category', 'label', 'title', 'description']

class QuestionSerializer(serializers.ModelSerializer):
    sub_category = SubCategorySerializer(read_only=True) # Nested serializer for the sub_category

    class Meta:
        model = Question
        fields = [
            'id', 'question_type', 'sub_category', 'text', 'is_active',
            'purpose', 'dva_description', 'typical_industries',
            'topic', 'points', 'number',
            'created_at', 'updated_at'
        ]

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ['id', 'file', 'status', 'admin_comment', 'uploaded_at', 'topic', 'company', 'year']
        read_only_fields = ['status', 'admin_comment', 'uploaded_at']

class AnswerSerializer(serializers.ModelSerializer):
    documents = DocumentSerializer(many=True, read_only=True)
    document_ids = serializers.PrimaryKeyRelatedField(
        many=True, 
        queryset=Document.objects.all(), 
        source='documents', 
        write_only=True,
        required=False
    )

    class Meta:
        model = Answer
        fields = [
            'id', 'company', 'question', 'year', 
            'boolean_answer', 'is_answered', 'metric_value', 
            'documents', 'document_ids', 'updated_at'
        ]
        read_only_fields = ['id', 'updated_at']

class IaAnswerDetailSerializer(serializers.Serializer):
    is_answered = serializers.BooleanField(required=False, default=False)
    metric_value = serializers.CharField(allow_blank=True, required=False, default='')

class CompanyBasismodulDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyBasismodulData
        fields = '__all__'

class CompanyExtendedModuleDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyExtendedModuleData
        fields = '__all__'

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
                    'answer_id': answer_obj.id, # Include the ID for mapping
                    'is_answered': answer_obj.is_answered,
                    'metric_value': answer_obj.metric_value,
                    'documents': DocumentSerializer(answer_obj.documents.all(), many=True).data # Include linked docs
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

        print(f"\nDEBUG Backend: UserAnswerSerializer update method called for company {company.id}, year {year}.")
        print(f"DEBUG Backend: Incoming dvaAnswers data: {dva_answers_data}")
        print(f"DEBUG Backend: Incoming iaAnswers data: {ia_answers_data}")

        if not year:
            print("DEBUG Backend: Year not provided in serializer context. Raising validation error.")
            raise serializers.ValidationError("Year must be provided in the serializer context for updating answers.")

        with transaction.atomic():
            # Process DVA answers
            print(f"DEBUG Backend: Processing DVA answers ({len(dva_answers_data)} items).")
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
                    print(f"DEBUG Backend: DVA Answer Q{question.id} ({year}) updated/created. boolean_answer: {boolean_answer}")
                except Question.DoesNotExist:
                    print(f"DEBUG Backend: DVA Question with id {question_id_str} not found. Skipping.")
                except Exception as e:
                    print(f"DEBUG Backend: Error processing DVA question ID {question_id_str}: {e}")
                    raise # Re-raise unexpected exceptions

            # Process IA answers
            # First, update or create answers for checked questions
            print(f"DEBUG Backend: Processing incoming ia_answers_data ({len(ia_answers_data)} items).")
            for question_id_str, ia_answer_data in ia_answers_data.items():
                try:
                    print(f"DEBUG Backend: Processing IA Q{question_id_str}. Data: {ia_answer_data}")
                    question = Question.objects.get(id=int(question_id_str))
                    if question.question_type != 'IA':
                        print(f"DEBUG Backend: Q{question_id_str} is not an IA question. Skipping.")
                        continue # Skip if not an IA question
                    
                    is_answered_value = ia_answer_data.get('is_answered', False)
                    metric_value = ia_answer_data.get('metric_value', '')

                    Answer.objects.update_or_create(
                        company=company,
                        question=question,
                        year=year,
                        defaults={'is_answered': is_answered_value, 'metric_value': metric_value, 'boolean_answer': None},
                    )
                    print(f"DEBUG Backend: IA Answer for Q{question.id} ({year}) updated/created. is_answered: {is_answered_value}, metric_value: '{metric_value}'")
                except Question.DoesNotExist:
                    print(f"DEBUG Backend: IA Question with id {question_id_str} not found. Skipping.")
                except Exception as e:
                    print(f"DEBUG Backend: Unhandled exception during IA answer processing for Q{question_id_str}: {e}")
                    raise # Re-raise unexpected exceptions

            # Second, identify and update unchecked IA questions
            # Get all existing IA answers for the current company and year that are currently checked
            existing_ia_answers = Answer.objects.filter(
                company=company,
                year=year,
                question__question_type='IA',
                is_answered=True
            )
            
            incoming_ia_question_ids = {int(qid_str) for qid_str in ia_answers_data.keys()}
            print(f"DEBUG Backend: Existing IA answers ({existing_ia_answers.count()}): {[ans.question.id for ans in existing_ia_answers]}")
            print(f"DEBUG Backend: Incoming IA question IDs: {incoming_ia_question_ids}")

            for existing_answer in existing_ia_answers:
                if existing_answer.question.id not in incoming_ia_question_ids:
                    # This existing answer was previously checked but is no longer in the incoming data
                    existing_answer.is_answered = False
                    existing_answer.metric_value = '' # Clear metric value for unchecked questions
                    existing_answer.save()
                    print(f"DEBUG Backend: IA Answer for Q{existing_answer.question.id} ({year}) unchecked in backend.")
                else:
                    print(f"DEBUG Backend: IA Answer for Q{existing_answer.question.id} is still checked in incoming data.")

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
    marimekkoData = serializers.ListField(child=serializers.DictField()) # Simplified child type, more flexible
    polarBarChartData = serializers.ListField(child=serializers.DictField()) # Simplified child type, more flexible
