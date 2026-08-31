# STF Gerenciador Web — desenvolvimento local
# make          → instala dependências
# make setup    → install + .env
# make start    → API STF (:3000) + gerenciador Vite (:5173)
# make start-web → apenas Vite (API já deve estar rodando)

SHELL := /bin/bash
STF_DIR := ../senior-test-funcional
API_URL ?= http://localhost:3000
WEB_URL ?= http://localhost:5173

.DEFAULT_GOAL := install

.PHONY: help install setup env start start-web start-with-api start-stf-backend check-api check-stf lint typecheck test build preview generate-api-types stop

help:
	@echo "STF Gerenciador Web — alvos Make"
	@echo ""
	@echo "  make                 Instala dependências (npm install)"
	@echo "  make setup           install + arquivo .env"
	@echo "  make env             Cria .env a partir de .env.example"
	@echo "  make start           Sobe API STF (:3000) + gerenciador ($(WEB_URL))"
	@echo "  make start-web       Apenas Vite ($(WEB_URL)) — API já deve estar up"
	@echo "  make start-with-api  Alias de make start (compatibilidade)"
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
	@echo ">>   make start          (API STF + gerenciador web)"
	@echo ">>   make start-web      (só gerenciador, se a API já estiver rodando)"
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

start-web: env
	@echo ">> Iniciando gerenciador web ($(WEB_URL))..."
	@echo ">> API esperada em $(API_URL) — confira VITE_STF_API_URL no .env"
	@npm run dev

start: env check-stf
	@set -euo pipefail; \
	trap 'kill 0' INT TERM; \
	echo ">> Iniciando API STF (http://localhost:3000)..."; \
	(cd "$(STF_DIR)" && $(MAKE) start-backend) & \
	sleep 2; \
	echo ">> Iniciando gerenciador web ($(WEB_URL))..."; \
	npm run dev & \
	wait

start-with-api: start
	@:

start-stf-backend: check-stf
	@echo ">> Iniciando API STF via $(STF_DIR) ..."
	@cd "$(STF_DIR)" && $(MAKE) start-backend

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
	@echo ">> Processos locais (Vite/API): use Ctrl+C no terminal do make start."
	@echo ">> Para parar Postgres do STF: cd $(STF_DIR) && make stop"
