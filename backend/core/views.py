from rest_framework import viewsets, generics, status, mixins
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated # Import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.http import HttpResponse # Import HttpResponse
from django.template.loader import get_template # Import get_template
from xhtml2pdf import pisa # Import the pisa library

from .models import Company, Category, SubCategory, Question, Answer, Document, CompanyBasismodulData
from .serializers import (
    CompanySerializer,
    CategorySerializer,
    SubCategorySerializer,
    QuestionSerializer,
    AnswerSerializer,
    DocumentSerializer,
    UserAnswerSerializer,
    CalculationResultSerializer,
    CompanyBasismodulDataSerializer
)
from .services import calculate_esg_results

class CompanyBasismodulDataViewSet(viewsets.ModelViewSet):
    queryset = CompanyBasismodulData.objects.all()
    serializer_class = CompanyBasismodulDataSerializer

class PDFReportView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated] # Ensure only authenticated users can generate reports

    def get(self, request, company_id, year, *args, **kwargs):
        company = get_object_or_404(Company, id=company_id)
        
        # Fetch calculation results
        results, status_code = calculate_esg_results(company_id, year)
        if status_code != 200:
            return Response(results, status=status.HTTP_400_BAD_REQUEST) # Or appropriate error

        # Fetch DVA answers for display in PDF (simplified for now)
        dva_answers_query = Answer.objects.filter(
            company=company, 
            year=year, 
            question__question_type='DVA',
            boolean_answer__isnull=False # Only include answered DVA questions
        ).select_related('question')
        
        dva_answers_display = {
            ans.question: 'Yes' if ans.boolean_answer else 'No'
            for ans in dva_answers_query
        }

        # Context for the template
        context = {
            'company': company,
            'year': year,
            'results': results,
            'dva_answers': dva_answers_display,
            # Add other data as needed for the report
        }

        template = get_template('core/pdf_report.html')
        html = template.render(context)

        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="ESG_Report_{company.name}_{year}.pdf"'

        # create a pdf
        pisa_status = pisa.CreatePDF(
            html,                # the HTML to convert
            dest=response)       # file handle to receive result

        if pisa_status.err:
            return HttpResponse('We had some errors <pre>' + html + '</pre>')
        return response

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
    
    def get_queryset(self):
        queryset = super().get_queryset()
        question_type = self.request.query_params.get('question_type', None)
        if question_type is not None:
            queryset = queryset.filter(question_type=question_type)
        return queryset

class AnswerViewSet(viewsets.ModelViewSet):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer

class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer

class UserAnswersView(generics.GenericAPIView,
                      mixins.RetrieveModelMixin,
                      mixins.UpdateModelMixin):
    queryset = Company.objects.all()
    serializer_class = UserAnswerSerializer
    lookup_field = 'company_id' # We still use company_id for the Company lookup

    def get_object(self):
        # The frontend expects to send 'company_id' and 'year' in the URL
        company_id = self.kwargs['company_id']
        # We need to fetch the company for context, but the primary object for
        # retrieve/update is the company itself, filtered by ID.
        return get_object_or_404(Company, id=company_id)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['year'] = self.kwargs.get('year') # Pass the year from the URL to the serializer
        return context

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)


class CalculationResultsView(generics.RetrieveAPIView):
    serializer_class = CalculationResultSerializer
    lookup_field = 'company_id' # We'll use company_id from URL

    def get_object(self):
        # Override get_object to ensure company exists and pass year
        company_id = self.kwargs['company_id']
        year = self.kwargs['year'] # Get year from URL
        get_object_or_404(Company, id=company_id) # Just check existence
        return {'company_id': company_id, 'year': year} # Return a dict that can be passed to serializer

    def retrieve(self, request, *args, **kwargs):
        company_id = self.kwargs['company_id']
        year = self.kwargs['year'] # Get year from URL

        results, status_code = calculate_esg_results(company_id, year)

        if status_code == 404:
            return Response(results, status=status.HTTP_404_NOT_FOUND)
        
        serializer = self.get_serializer(results)
        return Response(serializer.data)