from rest_framework import viewsets, generics, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Company, Category, SubCategory, Question, Answer, Document
from .serializers import (
    CompanySerializer,
    CategorySerializer,
    SubCategorySerializer,
    QuestionSerializer,
    AnswerSerializer,
    DocumentSerializer,
    UserAnswerSerializer,
    CalculationResultSerializer # New import
)
from .services import calculate_esg_results # New import

class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class SubCategoryViewSet(viewsets.ModelViewSet):
    queryset = SubCategory.objects.all()
    serializer_class = SubCategorySerializer

class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer

class AnswerViewSet(viewsets.ModelViewSet):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer

class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer

class UserAnswersView(generics.RetrieveUpdateAPIView):
    queryset = Company.objects.all()
    serializer_class = UserAnswerSerializer
    lookup_field = 'company_id'

    def get_object(self):
        # The frontend expects to send 'company_id' in the URL,
        # so we fetch the Company object using that ID.
        company_id = self.kwargs['company_id']
        return get_object_or_404(Company, id=company_id)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)


class CalculationResultsView(generics.RetrieveAPIView):
    serializer_class = CalculationResultSerializer
    lookup_field = 'company_id' # We'll use company_id from URL
    # No queryset needed as we're not directly retrieving a model instance for serialization

    def get_object(self):
        # Override get_object to ensure company exists
        company_id = self.kwargs['company_id']
        get_object_or_404(Company, id=company_id) # Just check existence
        return {'company_id': company_id, 'year': 2026} # Return a dict that can be passed to serializer

    def retrieve(self, request, *args, **kwargs):
        company_id = self.kwargs['company_id']
        # Assuming fixed year for now, will be dynamic later
        year = 2026 

        results, status_code = calculate_esg_results(company_id, year)

        if status_code == 404:
            return Response(results, status=status.HTTP_404_NOT_FOUND)
        
        serializer = self.get_serializer(results)
        return Response(serializer.data)