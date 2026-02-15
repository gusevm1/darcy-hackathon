FROM python:3.12-slim

RUN groupadd --system appuser && useradd --system --gid appuser appuser

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN mkdir -p /app/data /app/src/data && chown -R appuser:appuser /app

# Note: USER appuser is not set because host-mounted volumes
# (./backend/src/data:/app/src/data) retain host ownership.
# To run as non-root, use named volumes or fix host dir permissions.

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')"

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
