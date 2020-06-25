FROM python:3.8.2

ENV TZ=Europe/Kiev
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN apt-get update && \
    apt-get -y install cron && \
    apt-get -y install vim

COPY cronjobs /etc/cron.d/jammed_cronjobs
RUN chmod 0644 /etc/cron.d/jammed_cronjobs && \
    crontab /etc/cron.d/jammed_cronjobs

RUN mkdir /collector

COPY static /collector/static
COPY requirements.txt /collector

RUN pip install --upgrade pip && \
    pip install -r /collector/requirements.txt

WORKDIR /collector
