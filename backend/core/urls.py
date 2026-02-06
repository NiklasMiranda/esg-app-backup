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
    CalculationResultsView # New import
)

router = DefaultRouter()
router.register(r'companies', CompanyViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'subcategories', SubCategoryViewSet)
router.register(r'questions', QuestionViewSet)
router.register(r'answers', AnswerViewSet)
router.register(r'documents', DocumentViewSet)

urlpatterns = [
    path('user-answers/<int:company_id>/', UserAnswersView.as_view(), name='user-answers'),
    path('calculation-results/<int:company_id>/', CalculationResultsView.as_view(), name='calculation-results'), # New URL pattern
] + router.urls
