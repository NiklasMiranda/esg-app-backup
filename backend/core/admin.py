from django.contrib import admin
from django.urls import reverse
from django.utils.html import format_html
from .models import Company, Category, SubCategory, Question, Answer, Document, CompanyBasismodulData, CompanyExtendedModuleData # Added imports

@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'years_with_answers_links')
    search_fields = ('name',)

    def years_with_answers_links(self, obj):
        all_years = set()
        for model_name in ['answers', 'basismodul_data', 'extended_module_data']:
            if hasattr(obj, model_name):
                related_manager = getattr(obj, model_name)
                all_years.update(related_manager.order_by('-year').values_list('year', flat=True).distinct())
        
        sorted_years = sorted(list(all_years), reverse=True)
        
        links = []
        for year in sorted_years:
            answer_url = reverse('admin:core_answer_changelist') + f'?company__id__exact={obj.id}&year__exact={year}'
            basismodul_url = reverse('admin:core_companybasismoduldata_changelist') + f'?company__id__exact={obj.id}&year__exact={year}'
            extended_module_url = reverse('admin:core_companyextendedmoduledata_changelist') + f'?company__id__exact={obj.id}&year__exact={year}'
            
            year_links = []
            # Check for DVA Answers
            if obj.answers.filter(year=year, question__question_type='DVA').exists():
                dva_url = reverse('admin:core_answer_changelist') + f'?company__id__exact={obj.id}&year__exact={year}&question__question_type__exact=DVA'
                year_links.append(f'<a href="{dva_url}">DVA Answers</a>')
            # Check for IA Answers
            if obj.answers.filter(year=year, question__question_type='IA').exists():
                ia_url = reverse('admin:core_answer_changelist') + f'?company__id__exact={obj.id}&year__exact={year}&question__question_type__exact=IA'
                year_links.append(f'<a href="{ia_url}">IA Answers</a>')

            if obj.basismodul_data.filter(year=year).exists():
                basismodul_url = reverse('admin:core_companybasismoduldata_changelist') + f'?company__id__exact={obj.id}&year__exact={year}'
                year_links.append(f'<a href="{basismodul_url}">Basismodul</a>')
            if obj.extended_module_data.filter(year=year).exists():
                extended_module_url = reverse('admin:core_companyextendedmoduledata_changelist') + f'?company__id__exact={obj.id}&year__exact={year}'
                year_links.append(f'<a href="{extended_module_url}">Udvidet modul</a>')

            if year_links:
                links.append(f"{year}: ({', '.join(year_links)})")

        if not links:
            return format_html("{}", "<em>No data available</em>")
        return format_html("{}", "<br>".join(links)) # Use <br> for better readability on multiple lines
    years_with_answers_links.short_description = "Data by Year"
    years_with_answers_links.admin_order_field = 'name' # Added this to help Django recognize it as a list_display method

@admin.register(CompanyBasismodulData)
class CompanyBasismodulDataAdmin(admin.ModelAdmin):
    list_display = ('company', 'year')
    list_filter = ('year', 'company')
    search_fields = ('company__name',)

@admin.register(CompanyExtendedModuleData)
class CompanyExtendedModuleDataAdmin(admin.ModelAdmin):
    list_display = ('company', 'year')
    list_filter = ('year', 'company')
    search_fields = ('company__name',)

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
    list_filter = ('company', 'year', 'question__question_type', 'question__sub_category',)
    search_fields = ('question__text', 'company__name')

@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ('answer', 'file', 'description', 'uploaded_at')
    search_fields = ('description', 'answer__question__text')