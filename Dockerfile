FROM python:3.10

WORKDIR /app

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
RUN python manage.py collectstatic --noinput
COPY . .

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "sonic_vision.wsgi"]