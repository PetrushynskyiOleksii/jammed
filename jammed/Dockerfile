FROM python:3.7.1

ENV TZ=Europe/Kiev

RUN apt-get update && \
    apt-get -y install cron && \
    apt-get -y install vim

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY cronjobs /etc/cron.d/jammed_cronjobs
RUN chmod 0644 /etc/cron.d/jammed_cronjobs && \
    crontab /etc/cron.d/jammed_cronjobs

RUN mkdir -p /jammed/jammed && \
    mkdir /var/collected

WORKDIR /jammed/jammed

COPY requirements.txt /jammed/jammed
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# TODO: add bind volume for logging