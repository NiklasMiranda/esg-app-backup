from rest_framework.routers import DefaultRouter
from django.urls import path, include, re_path
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
    CompanyBasismodulDataViewSet,
    CompanyExtendedModuleDataViewSet,
    CompanyAvailableYearsView,
    TestView # Add TestView here
)

router = DefaultRouter()
router.register(r'companies', CompanyViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'subcategories', SubCategoryViewSet)
router.register(r'questions', QuestionViewSet)
router.register(r'answers', AnswerViewSet)
router.register(r'documents', DocumentViewSet)

urlpatterns = [
    path('test-view/', TestView.as_view(), name='test-view'), # New test path
    re_path(r'^company-basismodul-data/(?P<company_id>\d+)/(?P<year>\d+)/$', CompanyBasismodulDataViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'post': 'partial_update'}), name='company-basismodul-data-detail'),
    re_path(r'^company-extended-module-data/(?P<company_id>\d+)/(?P<year>\d+)/$', CompanyExtendedModuleDataViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'post': 'partial_update'}), name='company-extended-module-data-detail'),
    path('user-answers/<int:company_id>/<int:year>/', UserAnswersView.as_view(), name='user-answers'),
    path('calculation-results/<int:company_id>/<int:year>/', CalculationResultsView.as_view(), name='calculation-results'),
    path('pdf-report/<int:company_id>/<int:year>/', PDFReportView.as_view(), name='pdf-report'),
    path('company-data/available-years/<int:company_id>/', CompanyAvailableYearsView.as_view(), name='company-available-years'),
] + router.urls
