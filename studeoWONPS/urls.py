from django.contrib import admin
from django.urls import path, re_path, include
from django.views.static import serve
from rest_framework.routers import DefaultRouter
from main.views import IndexView
from main.controller import CursoViewSet, ProfessorViewSet, AlunoViewSet, MateriaViewSet
from django.conf import settings

# API Router
router = DefaultRouter()
router.register(r'cursos', CursoViewSet)
router.register(r'professores', ProfessorViewSet)
router.register(r'alunos', AlunoViewSet)
router.register(r'materias', MateriaViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('favicon.ico', serve, {'document_root': settings.REACT_APP_DIR, 'path': 'favicon.ico'}),
    path('robots.txt', serve, {'document_root': settings.REACT_APP_DIR, 'path': 'robots.txt'}),
    re_path(r'^.*$', IndexView.as_view(), name='index'),
]
