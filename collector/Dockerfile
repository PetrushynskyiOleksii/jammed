FROM python:3.8.2

ENV TZ=Europe/Kiev
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN apt-get update && \
    apt-get -y install vim

RUN mkdir /collector

COPY requirements.txt /collector

RUN pip install --upgrade pip && \
    pip install -r /collector/requirements.txt

WORKDIR /collector
