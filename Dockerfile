FROM postgres:16

ENV POSTGRES_USER=
ENV POSTGRES_PASSWORD=
ENV POSTGRES_DB=

EXPOSE 5432

HEALTHCHECK --interval=10s --timeout=5s --retries=5 \
  CMD pg_isready -U "$${POSTGRES_USER}" || exit 1