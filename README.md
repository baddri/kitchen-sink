<h1 align="center">
  Kitchen Sink
</h1>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">This is the place where i dump all my knowledge about backend development in a single project</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Checklist
i try to create most of of the things i know into this single simple project

### Authentication
- [ ] Create Active Authentication method with cached token in redis
- [ ] Enable Anonimous authentication
- [ ] Blacklist authentication

### Security
- [ ] IP Filtering for specific route
- [ ] Trottle for specific route
- [ ] Blacklist IP

### Technique
- [ ] Task Scheduling Update data
- [ ] Queuing Process
- [ ] Create Meaningfull Telemetry
- [ ] Event driven process
- [ ] Websockets

### Miscelanious
- [ ] Enable Versioning
- [ ] Unit Testing
- [ ] e2e Testing
- [ ] API Documentation
- [ ] Code Documentation
- [ ] Error with ID

## Installation

```bash
$ pnpm install
```

## Running the app

### Development
```bash
# run compose up
$ docker compose up -d

# open log
$ docker attach backend-dev

```

### Testing
```bash
# run compose up
$ docker compose -f compose-test.yml up -d

# attach to terminal
$ docker attach backend-test

```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
