FROM python:3.8.2

ENV TZ=Europe/Kiev
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN apt-get update && \
    apt-get -y install vim

RUN mkdir /server

COPY requirements.txt /server

RUN pip install --upgrade pip && \
    pip install -r /server/requirements.txt

WORKDIR /server
