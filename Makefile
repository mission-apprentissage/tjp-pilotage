install: install-root install-server install-ui

install-root:
	yarn install

install-server:
	yarn --cwd server install --frozen-lockfile

install-ui:
	yarn --cwd ui install --frozen-lockfile

start:
	docker-compose up --build --force-recreate

start-mongodb:
	docker-compose up -d mongodb

stop:
	docker-compose stop

test:
	yarn --cwd server test
	yarn --cwd ui test:ci

coverage:
	yarn --cwd server test:coverage
	yarn --cwd ui coverage

lint:
	yarn lint

clean:
	docker-compose kill && docker system prune --force --volumes

ci: install lint test coverage
