FROM postgres:16

EXPOSE 5432

HEALTHCHECK --interval=10s --timeout=5s --retries=5 \
  CMD pg_isready -U "$${POSTGRES_USER}" || exit 1