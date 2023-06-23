clear:
	docker ps -aq | xargs -I 'ID' docker stop 'ID' | xargs -I 'ID' docker rm 'ID'
delete:
	docker images -aq | xargs -I 'ID' docker rmi 'ID'
compose:
	docker-compose -f node-compose.yaml up -d
compose-2:
	docker-compose up -d
run:
	make compose && make compose-2