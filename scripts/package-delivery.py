"""Compacto o fonte e depois junto seu ZIP com o PDF, sem vídeo nem segredos."""
import argparse
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import hashlib

parser = argparse.ArgumentParser()
parser.add_argument('--pdf', required=True)
parser.add_argument('--output-dir', required=True)
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
pdf = Path(args.pdf).resolve()
out = Path(args.output_dir).resolve()
if not pdf.is_file():
    raise SystemExit('O PDF precisa existir antes de compactar.')
if out == root or root in out.parents:
    raise SystemExit('A pasta de saída deve ficar fora do projeto para evitar ZIP recursivo.')
out.mkdir(parents=True, exist_ok=True)
inner = out / '01_Projeto_SeederLink_Fase6.zip'
outer = out / 'RM571722_DaviANS_FASE_6_SPRINT6.zip'
allowed_dirs = {'.github', '.vscode', 'src', 'public', 'docs', 'tests', 'scripts', 'css', 'js', 'img'}
allowed_files = {'.gitignore', 'index.html', 'package.json', 'package-lock.json', 'README.md', 'vite.config.js', 'ENTREGA_FIAP_FASE_5.txt', 'ENTREGA_FIAP_FASE_6.txt'}
forbidden = {'.mp4', '.webm', '.mov', '.avi', '.zip', '.pyc'}
with ZipFile(inner, 'w', ZIP_DEFLATED, compresslevel=9) as archive:
    for path in sorted(root.rglob('*')):
        if not path.is_file() or path.is_symlink():
            continue
        rel = path.relative_to(root)
        if rel.parts[0] not in allowed_dirs and str(rel) not in allowed_files:
            continue
        if path.suffix.lower() in forbidden or path.name.startswith('.env') or '__pycache__' in rel.parts:
            continue
        archive.write(path, 'site_seederlink-wolvestech/' + rel.as_posix())
with ZipFile(inner) as archive:
    assert archive.testzip() is None
    names = archive.namelist()
    assert any(name.endswith('src/domain/portfolio.js') for name in names)
    assert any(name.endswith('public/docs/diagrama-classes-fase6.png') for name in names)
with ZipFile(outer, 'w', ZIP_DEFLATED, compresslevel=9) as archive:
    archive.write(pdf, 'Seederlink_fase6.pdf')
    archive.write(inner, inner.name)
with ZipFile(outer) as archive:
    assert archive.testzip() is None
    assert sorted(archive.namelist()) == ['01_Projeto_SeederLink_Fase6.zip', 'Seederlink_fase6.pdf']
print(f'Projeto: {len(names)} arquivos')
print(f'Entrega: {outer}')
print(f'SHA256: {hashlib.sha256(outer.read_bytes()).hexdigest()}')
