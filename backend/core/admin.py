from django.contrib import admin
from .models import Company, Category, SubCategory, Question, Answer, Document

@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('name', 'user')
    search_fields = ('name',)

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('code', 'name')

@admin.register(SubCategory)
class SubCategoryAdmin(admin.ModelAdmin):
    list_display = ('label', 'title', 'category')
    list_filter = ('category',)
    search_fields = ('title', 'label')

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('text', 'question_type', 'sub_category', 'is_active', 'points', 'number')
    list_filter = ('question_type', 'sub_category__category', 'sub_category', 'is_active')
    search_fields = ('text', 'number')
    list_editable = ('is_active', 'points')

@admin.register(Answer)
class AnswerAdmin(admin.ModelAdmin):
    list_display = ('question', 'company', 'year', 'boolean_answer', 'is_answered')
    list_filter = ('year', 'company', 'question__sub_category')
    search_fields = ('question__text', 'company__name')

@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ('answer', 'file', 'description', 'uploaded_at')
    search_fields = ('description', 'answer__question__text')