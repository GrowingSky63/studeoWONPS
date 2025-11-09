from django.db import models
from .validators import validar_cpf, telefone_regex_validator
from datetime import datetime

class Curso(models.Model):
  nome = models.CharField(max_length=200)
  codigo = models.CharField(max_length=20, unique=True)
  descricao = models.TextField(blank=True)
  carga_horaria_total = models.IntegerField()
  data_criacao = models.DateTimeField(auto_now_add=True)
  
  class Meta:
    verbose_name = 'Curso'
    verbose_name_plural = 'Cursos'
  
  def __str__(self):
    return f"{self.codigo} - {self.nome}"

class Professor(models.Model):
  nome = models.CharField(max_length=200)
  cpf = models.CharField(max_length=14, unique=True, validators=[validar_cpf])
  email = models.EmailField(unique=True)
  telefone = models.CharField(max_length=20, blank=True, validators=[telefone_regex_validator])
  data_contratacao = models.DateField()
  
  class Meta:
    verbose_name = 'Professor'
    verbose_name_plural = 'Professores'
  
  def __str__(self):
    return self.nome

class Aluno(models.Model):
  nome = models.CharField(max_length=200)
  cpf = models.CharField(max_length=14, unique=True, validators=[validar_cpf])
  email = models.EmailField(unique=True)
  telefone = models.CharField(max_length=20, blank=True, validators=[telefone_regex_validator])
  data_nascimento = models.DateField()
  matricula = models.CharField(max_length=20, unique=True, blank=True)
  curso = models.ForeignKey(Curso, on_delete=models.PROTECT, related_name='alunos')
  data_matricula = models.DateField()
  status = models.CharField(max_length=20, choices=[
    ('ATIVO', 'Ativo'),
    ('TRANCADO', 'Trancado'),
    ('FORMADO', 'Formado'),
    ('CANCELADO', 'Cancelado'),
  ], default='ATIVO')
  
  class Meta:
    verbose_name = 'Aluno'
    verbose_name_plural = 'Alunos'
  
  def __str__(self):
    return f"{self.matricula} - {self.nome}"
  
  @staticmethod
  def gerar_matricula():
    """
    Gera uma matrícula única no formato: ANO + SEQUENCIAL (ex: 2025001)
    """
    ano_atual = datetime.now().year
    
    # Busca a última matrícula do ano atual
    ultima_matricula = Aluno.objects.filter(
      matricula__startswith=str(ano_atual)
    ).order_by('-matricula').first()
    
    if ultima_matricula:
      # Extrai o número sequencial e incrementa
      sequencial = int(ultima_matricula.matricula[4:]) + 1
    else:
      # Primeira matrícula do ano
      sequencial = 1
    
    # Formata: ANO + SEQUENCIAL com 4 dígitos (ex: 20250001)
    return f"{ano_atual}{sequencial:04d}"
  
  def save(self, *args, **kwargs):
    # Gera matrícula automaticamente se não existir
    if not self.matricula:
      self.matricula = self.gerar_matricula()
    super().save(*args, **kwargs)

class Materia(models.Model):
  nome = models.CharField(max_length=200)
  codigo = models.CharField(max_length=20, unique=True)
  carga_horaria = models.IntegerField()
  curso = models.ForeignKey(Curso, on_delete=models.CASCADE, related_name='materias')
  professor = models.ForeignKey(Professor, on_delete=models.SET_NULL, null=True, related_name='materias')
  periodo = models.IntegerField(help_text='Período/Semestre em que a matéria é oferecida')
  # alunos = models.ManyToManyField(Aluno, related_name='materias', blank=True)
  
  class Meta:
    verbose_name = 'Matéria'
    verbose_name_plural = 'Matérias'
  
  def __str__(self):
    return f"{self.codigo} - {self.nome}"
