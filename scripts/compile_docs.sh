pandoc -t latex <../documentation/markdown/development_documentation.md >../documentation/generated/development_documentation/pdf/development_documentation.tex --template=../documentation/templates/pdf_template.tex
pandoc -t latex <../documentation/markdown/user_documentation.md >../documentation/generated/user_documentation/pdf/user_documentation.tex --template=../documentation/templates/pdf_template.tex
pandoc -t latex <../documentation/markdown/sources.md >../documentation/generated/user_documentation/pdf/sources.tex --template=../documentation/templates/sources_template.tex
pandoc -t latex <../documentation/markdown/sources.md >../documentation/generated/development_documentation/pdf/sources.tex --template=../documentation/templates/sources_template.tex
