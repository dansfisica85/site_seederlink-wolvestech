"""Gero o PDF com integrantes, UML em paisagem e o pitch configurado para a Fase 6."""
from pathlib import Path
import argparse
import re
from xml.sax.saxutils import escape
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph, Table, TableStyle
from reportlab.lib.utils import ImageReader

parser = argparse.ArgumentParser()
parser.add_argument('--output', required=True)
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
target = Path(args.output).resolve()
target.parent.mkdir(parents=True, exist_ok=True)
config = (root / 'src/data/entrega.js').read_text(encoding='utf-8')
pitch_match = re.search(r"pitchUrl:\s*['\"](https://[^'\"]+)['\"]", config)
pitch = pitch_match.group(1) if pitch_match else None
deploy = 'https://dansfisica85.github.io/site_seederlink-wolvestech/'
repo = 'https://github.com/dansfisica85/site_seederlink-wolvestech'
members = [
    ('DAVI ANTONINO NUNES DA SILVA', '571722'),
    ('MATEUS AUGUSTO DA COSTA OLIVEIRA GONÇALVES', '570166'),
    ('MATHEUS RISSATO CRISPIM', '571038'),
    ('ISAAC NILTON ALVARENGA DA SILVA', '573766'),
]
width, height = A4
green = colors.HexColor('#173f2c')
muted = colors.HexColor('#526a5b')
light = colors.HexColor('#edf4ee')
styles = {
    'body': ParagraphStyle('body', fontName='Helvetica', fontSize=10, leading=15, textColor=green),
    'small': ParagraphStyle('small', fontName='Helvetica', fontSize=8.5, leading=12, textColor=muted),
    'heading': ParagraphStyle('heading', fontName='Helvetica-Bold', fontSize=15, leading=20, textColor=green),
}
c = canvas.Canvas(str(target), pagesize=A4)
c.setTitle('SeederLink - Fase 6 - Integrantes, UML e links')
c.setAuthor('Grupo SeederLink - FIAP')

def paragraph(text, x, y, max_width=511, style='body'):
    p = Paragraph(text, styles[style])
    _, size = p.wrap(max_width, height)
    p.drawOn(c, x, y-size)
    return y-size

def base(page, label):
    c.setFillColor(green)
    c.rect(0, height-14, width, 14, fill=1, stroke=0)
    c.setFont('Helvetica-Bold', 10)
    c.drawString(42, height-42, 'SEEDERLINK')
    c.setFillColor(muted)
    c.setFont('Helvetica', 9)
    c.drawRightString(width-42, height-42, 'FIAP | FASE 6 | SPRINT 6')
    c.setStrokeColor(colors.HexColor('#d7e4db'))
    c.line(42, 42, width-42, 42)
    c.setFont('Helvetica', 8)
    c.drawString(42, 27, label)
    c.drawRightString(width-42, 27, f'{page} / 3')

base(1, 'Integrantes e links da entrega')
c.setFillColor(green)
c.setFont('Helvetica-Bold', 29)
c.drawString(42, 736, 'Carteira de Propriedades')
y = paragraph('Evolução do projeto da Fase 5: cadastro, histórico climático e comparação em uma interface inteiramente construída com React.', 42, 710)
y = paragraph('Integrantes', 42, y-27, style='heading')
rows = [[Paragraph('<b>Nome completo</b>', styles['small']), Paragraph('<b>RM</b>', styles['small'])]]
rows += [[Paragraph(escape(name), styles['small']), Paragraph(rm, styles['small'])] for name, rm in members]
table = Table(rows, colWidths=[437,74])
table.setStyle(TableStyle([
    ('BACKGROUND',(0,0),(-1,0),light),('LINEBELOW',(0,0),(-1,-1),.4,colors.HexColor('#d7e4db')),
    ('TOPPADDING',(0,0),(-1,-1),11),('BOTTOMPADDING',(0,0),(-1,-1),11),
    ('LEFTPADDING',(0,0),(-1,-1),10),('VALIGN',(0,0),(-1,-1),'TOP'),
]))
_, table_h = table.wrap(511, height)
table.drawOn(c,42,y-13-table_h)
y -= table_h+41
y = paragraph('Links de acesso',42,y,style='heading')
y = paragraph(f'<b>Deploy:</b> <link href="{deploy}" color="#215e3a">{deploy}</link>',42,y-13)
y = paragraph(f'<b>Repositório:</b> <link href="{repo}" color="#215e3a">{repo}</link>',42,y-12)
if pitch:
    y = paragraph(f'<b>Pitch da Fase 6:</b> <link href="{escape(pitch)}" color="#215e3a">{escape(pitch)}</link>',42,y-16)
else:
    y -= 15
    c.setFillColor(colors.HexColor('#fff2d8'))
    c.roundRect(42,y-84,511,84,9,fill=1,stroke=0)
    paragraph('<b>VÍDEO DA FASE 6 - PENDENTE</b><br/>O novo pitch público ainda não foi fornecido. Este PDF é uma versão de revisão. Antes de enviar à FIAP, publicar o vídeo, inserir o link aqui e na Home e gerar novamente o pacote. O vídeo da Fase 5 não substitui esta etapa.',54,y-11,487,'small')
    y -= 98
paragraph('Conteúdo do pacote: este PDF e um ZIP com o projeto. O arquivo de vídeo não deve ser incluído.',42,y-10,style='small')
c.showPage()

# A página do UML fica em paisagem. As páginas de integrantes e explicações
# continuam em retrato, para eu aproveitar melhor a largura de cada conteúdo.
width, height = landscape(A4)
c.setPageSize((width, height))
base(2, 'Diagrama UML em paisagem - atributos e métodos principais')
paragraph('Modelo de classes da Fase 6',42,height-63,max_width=width-84,style='heading')
diagram = ImageReader(str(root/'public/docs/diagrama-classes-fase6.png'))
iw, ih = diagram.getSize()
scale = min((width-84)/iw, (height-180)/ih)
dw, dh = iw*scale, ih*scale
c.drawImage(diagram,(width-dw)/2,91,dw,dh,mask='auto')
paragraph('Losango vazio: agregação. Losango preenchido: composição. Seta tracejada: dependência. +: público. Sublinhado: estático.<br/>Visão resumida: atributos principais; parâmetros e retornos abreviados. As assinaturas completas estão em src/domain/portfolio.js.',42,77,max_width=width-84,style='small')
c.showPage()

width, height = A4
c.setPageSize(A4)
base(3, 'Explicação da funcionalidade e dos relacionamentos')
y = paragraph('Como a nova função trabalha',42,775,style='heading')
y = paragraph('1. O usuário consulta uma coordenada no mapa e copia a análise concluída para a carteira.<br/>2. Preenche nome, cultura e área; a aplicação valida o registro e grava no navegador.<br/>3. Pode rever até cinco análises por propriedade, comparar duas propriedades e exportar JSON.<br/>4. A carteira comporta até dez cadastros; a exclusão exige confirmação.',42,y-16)
y = paragraph('Classes, atributos e métodos',42,y-24,style='heading')
items = [
    ('Localizacao', 'Guarda latitude e longitude. O construtor valida as coordenadas; toJSON representa o ponto para armazenamento.'),
    ('AnaliseClimatica', 'Guarda dados atuais, histórico, período, fonte, avaliação e data da captura. fromClimateResult valida o snapshot; toJSON gera uma cópia serializável.'),
    ('PropriedadeRural', 'Guarda id, nome, cultura, área, localização e análises. adicionarAnalise mantém as cinco mais recentes; resumo devolve a última consulta.'),
    ('CarteiraPropriedades', 'Reúne até dez propriedades. adicionar, remover, buscar e comparar organizam os registros; fromJSON reconstrói as classes salvas.'),
    ('RepositorioLocal', 'Recebe storage e key. carregar recupera e valida a carteira; salvar grava somente um conteúdo válido e informa falhas sem apagar o anterior.'),
]
for name, description in items:
    y = paragraph(f'<b>{name}</b> - {description}',42,y-13)
y = paragraph('Relacionamentos',42,y-23,style='heading')
y = paragraph('A carteira agrega 0..10 propriedades. Cada propriedade compõe 1 localização e 0..5 análises. O repositório depende da carteira para carregá-la e salvá-la. Não há herança artificial. As cinco classes estão implementadas em <b>src/domain/portfolio.js</b>; os componentes React continuam sendo funções.',42,y-12)
y = paragraph('Limites e conferência',42,y-22,style='heading')
y = paragraph('O armazenamento é local, sem sincronização. Cultura e área não alteram os critérios climáticos. NASA POWER sempre exige revisão. Os resultados são indicativos e não concedem crédito real. O pitch deve ser público, ter até 3 minutos e mostrar a nova função e o UML. Confira o acesso aos links sem autenticação antes de enviar.',42,y-12)
if y < 52:
    raise RuntimeError('O conteúdo ultrapassou o rodapé; ajuste o layout antes de entregar.')
c.save()
print(f'PDF criado: {target}; pitch configurado: {bool(pitch)}')
