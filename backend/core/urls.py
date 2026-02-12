from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import (
    CompanyViewSet,
    CategoryViewSet,
    SubCategoryViewSet,
    QuestionViewSet,
    AnswerViewSet,
    DocumentViewSet,
    UserAnswersView,
    CalculationResultsView,
    PDFReportView,
    CompanyBasismodulDataViewSet # New import
)

router = DefaultRouter()
router.register(r'companies', CompanyViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'subcategories', SubCategoryViewSet)
router.register(r'questions', QuestionViewSet)
router.register(r'answers', AnswerViewSet)
router.register(r'documents', DocumentViewSet)
router.register(r'company-basismodul-data', CompanyBasismodulDataViewSet) # Register the new ViewSet

urlpatterns = [
    path('user-answers/<int:company_id>/<int:year>/', UserAnswersView.as_view(), name='user-answers'),
    path('calculation-results/<int:company_id>/<int:year>/', CalculationResultsView.as_view(), name='calculation-results'),
    path('pdf-report/<int:company_id>/<int:year>/', PDFReportView.as_view(), name='pdf-report'),
] + router.urls
