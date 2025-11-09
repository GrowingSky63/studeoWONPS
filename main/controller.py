from rest_framework import serializers, viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Curso, Professor, Aluno, Materia
from .validators import validar_cpf
import re

# Serializers
class CursoSerializer(serializers.ModelSerializer):
  total_alunos = serializers.SerializerMethodField()
  total_materias = serializers.SerializerMethodField()
    
  class Meta:
    model = Curso
    fields = '__all__'
  def get_total_alunos(self, obj):
    return obj.alunos.count()
  
  def get_total_materias(self, obj):
    return obj.materias.count()

class ProfessorSerializer(serializers.ModelSerializer):
  total_materias = serializers.SerializerMethodField()
    
  class Meta:
    model = Professor
    fields = '__all__'
    
  def get_total_materias(self, obj):
    return obj.materias.count()
    
  def validate_cpf(self, value):
    """Valida CPF usando a função validar_cpf"""
    validar_cpf(value)  # Levanta ValidationError se inválido
    return value
    
  def validate_email(self, value):
    """Validação adicional de email"""
    email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(email_regex, value):
      raise serializers.ValidationError("Email inválido.")
    return value

class AlunoSerializer(serializers.ModelSerializer):
  curso_nome = serializers.CharField(source='curso.nome', read_only=True)
  matricula = serializers.CharField(required=False, allow_blank=True)
    
  class Meta:
    model = Aluno
    fields = '__all__'
    
  def validate_cpf(self, value):
    """Valida CPF usando a função validar_cpf"""
    validar_cpf(value)  # Levanta ValidationError se inválido
    return value
    
  def validate_email(self, value):
    """Validação adicional de email"""
    email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(email_regex, value):
        raise serializers.ValidationError("Email inválido.")
    return value

class MateriaSerializer(serializers.ModelSerializer):
  curso_nome = serializers.CharField(source='curso.nome', read_only=True)
  professor_nome = serializers.CharField(source='professor.nome', read_only=True)
    
  class Meta:
    model = Materia
    fields = '__all__'

# ViewSets (Controllers)
class CursoViewSet(viewsets.ModelViewSet):
  queryset = Curso.objects.all()
  serializer_class = CursoSerializer
  filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
  search_fields = ['nome', 'codigo']
  ordering_fields = ['nome', 'codigo', 'data_criacao']
  ordering = ['nome']

class ProfessorViewSet(viewsets.ModelViewSet):
  queryset = Professor.objects.all()
  serializer_class = ProfessorSerializer
  filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
  search_fields = ['nome', 'cpf', 'email']
  ordering_fields = ['nome', 'data_contratacao']
  ordering = ['nome']

class AlunoViewSet(viewsets.ModelViewSet):
  queryset = Aluno.objects.all()
  serializer_class = AlunoSerializer
  filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
  filterset_fields = ['curso', 'status']
  search_fields = ['nome', 'cpf', 'email', 'matricula']
  ordering_fields = ['nome', 'matricula', 'data_matricula']
  ordering = ['nome']
    
  @action(detail=False, methods=['get'])
  def gerar_matricula(self, request):
    """
    Endpoint para gerar uma nova matrícula única
    GET /api/alunos/gerar_matricula/
    """
    nova_matricula = Aluno.gerar_matricula()
    return Response({'matricula': nova_matricula})

class MateriaViewSet(viewsets.ModelViewSet):
  queryset = Materia.objects.all()
  serializer_class = MateriaSerializer
  filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
  filterset_fields = ['curso', 'professor', 'periodo']
  search_fields = ['nome', 'codigo']
  ordering_fields = ['nome', 'codigo', 'periodo']
  ordering = ['periodo', 'nome']
