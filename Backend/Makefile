.PHONY: test test-unit test-integration test-coverage install-deps setup-husky

install-deps:
	npm install
	npm install --save-dev jest @types/jest ts-jest supertest @types/supertest mongodb-memory-server husky lint-staged @types/morgan

setup-husky:
	npm run prepare
	chmod +x .husky/pre-commit
	chmod +x .husky/pre-push

test:
	npm run test

test-unit:
	npm run test:unit

test-integration:
	npm run test:integration

test-coverage:
	npm run test:coverage

test-docker:
	docker-compose -f docker-compose.test.yml up --build --abort-on-container-exit

lint:
	npm run lint

format:
	npm run format

build:
	npm run build

dev:
	npm run dev

clean:
	rm -rf dist coverage node_modules

setup: install-deps setup-husky
	@echo "Setup complete! Run 'make test' to run tests."