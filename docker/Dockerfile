# Version: 0.0.1

FROM node:4

MAINTAINER Paul Nebel "paul@nebel.io"
ENV REFRESHED_AT 2016_08_23
LABEL name="Base image for creating Angular Fullstack App using Yeoman or running/testing such an app using Bower and Grunt"
LABEL version="1.0"

# Get up to date, install the bare necessities
# Create "dogfish" user
# DANGEROUS: this is a dev convenience container, everyone has sudo access
RUN DEBIAN_FRONTEND=noninteractive sh -c '( \
    apt-get update -q && \
    apt-get install -y -q apt-utils curl wget vim man-db ssh bash-completion sudo xdg-utils xvfb && \
    apt-get clean && apt-get autoclean)' > /dev/null && \
    useradd -ms /bin/bash dogfish && \
    chown -R dogfish /usr/local && \
    chown -R dogfish:dogfish /home/dogfish && \
    echo "ALL ALL = (ALL) NOPASSWD: ALL" >> /etc/sudoers

# Install xvfb so that we can run chrome headless
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list
RUN apt-get update -q && \
    apt-get install -y -q google-chrome-stable
RUN mkdir /tmp/.X11-unix && \
    chmod 1777 /tmp/.X11-unix && \
    chown root /tmp/.X11-unix/

# Set up some semblance of an environment
WORKDIR /home/dogfish
ENV HOME /home/dogfish
USER dogfish

# Clone the repo locally
RUN git clone https://github.com/DogFishProductions/yieldify-code-test.git
RUN mv /home/dogfish/yieldify-code-test /home/dogfish/app
RUN chown -R dogfish:appuser /home/dogfish

EXPOSE 9000

RUN npm install -g npm \ 
    && npm install -g grunt-cli \
    && npm install -g yo \
    && npm install -g bower \
    && npm install -g generator-angular-fullstack \
    && npm cache clear

RUN mkdir /home/dogfish/app
WORKDIR /home/dogfish/app