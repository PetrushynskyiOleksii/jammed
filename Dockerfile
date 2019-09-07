FROM python:3.7.1

RUN mkdir jammed
ADD . /jammed
WORKDIR /jammed

RUN pip install -r requirements.txt
