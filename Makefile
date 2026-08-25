# STF Gerenciador Web — desenvolvimento local
# make          → instala dependências
# make setup    → install + .env
# make start    → Vite (:5173) — requer API STF em :3000
# make start-with-api → .env + API STF + Vite (stack completa)

SHELL := /bin/bash
STF_DIR := ../senior-test-funcional
API_URL ?= http://localhost:3000
WEB_URL ?= http://localhost:5173

.DEFAULT_GOAL := install

.PHONY: help install setup env start start-with-api start-stf-backend check-api check-stf lint typecheck test build preview generate-api-types stop

help:
	@echo "STF Gerenciador Web — alvos Make"
	@echo ""
	@echo "  make                 Instala dependências (npm install)"
	@echo "  make setup           install + arquivo .env"
	@echo "  make env             Cria .env a partir de .env.example"
	@echo "  make start           Sobe Vite em $(WEB_URL) (sem npm install)"
	@echo "  make start-with-api  Sobe API STF (:3000) + gerenciador (:5173)"
	@echo "  make start-stf-backend  Apenas API STF (delega para $(STF_DIR))"
	@echo "  make check-api       Verifica health da API STF"
	@echo "  make check-stf       Verifica se o repo STF está acessível"
	@echo "  make lint            ESLint"
	@echo "  make typecheck       TypeScript (tsc --noEmit)"
	@echo "  make test            Vitest"
	@echo "  make build           Build de produção (dist/)"
	@echo "  make preview         Preview do build (Vite)"
	@echo "  make generate-api-types  Gera src/types/api.d.ts via OpenAPI (API deve estar up)"
	@echo "  make stop            Dica: use Ctrl+C no terminal do make start*"

install:
	@echo ">> Instalando dependências..."
	@npm install
	@echo ">> Dependências instaladas."

setup: install env
	@echo ">> Setup concluído."
	@echo ">> Próximo passo:"
	@echo ">>   1) No STF: cd $(STF_DIR) && make setup && make start-backend"
	@echo ">>   2) Aqui:    make start"
	@echo ">>   Ou tudo junto: make start-with-api"
	@echo ">> CORS no STF (backend/.env): CORS_ORIGINS=$(WEB_URL)"
	@echo ">> Protótipo: VITE_USE_MOCK_API=true no .env (dados fictícios, sem API)"

env:
	@if [ ! -f .env ] && [ -f .env.example ]; then \
		cp .env.example .env; \
		echo ">> Criado .env"; \
	elif [ -f .env ]; then \
		echo ">> .env já existe — mantido."; \
	else \
		echo ">> Aviso: .env.example não encontrado."; \
	fi

check-stf:
	@if [ ! -f "$(STF_DIR)/Makefile" ]; then \
		echo ">> STF não encontrado em $(STF_DIR)"; \
		echo ">> Clone senior-test-funcional como irmão deste repo."; \
		exit 1; \
	fi
	@echo ">> STF OK — $(STF_DIR)"

check-api:
	@echo ">> Verificando API em $(API_URL)/health ..."
	@if curl -sf "$(API_URL)/health" >/dev/null; then \
		echo ">> API saudável."; \
	else \
		echo ">> API indisponível. Suba com: cd $(STF_DIR) && make start-backend"; \
		echo ">> Ou use: make start-with-api"; \
		exit 1; \
	fi

start: env
	@echo ">> Iniciando gerenciador web ($(WEB_URL))..."
	@echo ">> API esperada em $(API_URL) — confira VITE_STF_API_URL no .env"
	@npm run dev

start-stf-backend: check-stf
	@echo ">> Iniciando API STF via $(STF_DIR) ..."
	@cd "$(STF_DIR)" && $(MAKE) start-backend

start-with-api: env check-stf
	@set -euo pipefail; \
	trap 'kill 0' INT TERM; \
	echo ">> Iniciando API STF (http://localhost:3000)..."; \
	(cd "$(STF_DIR)" && $(MAKE) start-backend) & \
	sleep 2; \
	echo ">> Iniciando gerenciador web ($(WEB_URL))..."; \
	npm run dev & \
	wait

lint:
	@npm run lint

typecheck:
	@npm run typecheck

test:
	@npm run test

build:
	@npm run build

preview: build
	@npm run preview

generate-api-types: check-api
	@echo ">> Gerando tipos OpenAPI em src/types/api.d.ts ..."
	@npm run generate:api-types

stop:
	@echo ">> Processos locais (Vite/API): use Ctrl+C no terminal do make start ou make start-with-api."
	@echo ">> Para parar Postgres do STF: cd $(STF_DIR) && make stop"
