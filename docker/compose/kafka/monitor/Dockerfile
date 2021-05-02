FROM debian:stable-slim

LABEL author="Selcuk SERT"
LABEL mail="selcuk.sert@gmail.com"
LABEL version="1.0"
LABEL description="Custom image for monitoring Kafka stack via Prometheus and Grafana"

ARG PRM_RELEASE=2.26.0
ENV TZ=Europe/Istanbul

RUN apt-get update && \
apt-get install -y wget adduser libfontconfig1 apt-transport-https software-properties-common wget gnupg

# Install prometheus
RUN cd /tmp && \
wget -q https://github.com/prometheus/prometheus/releases/download/v${PRM_RELEASE}/prometheus-${PRM_RELEASE}.linux-amd64.tar.gz && \
tar -xvzf prometheus-${PRM_RELEASE}.linux-amd64.tar.gz --directory /usr/share && \
groupadd --system prometheus && useradd -s /sbin/nologin -r -g prometheus prometheus && \
mkdir -p /etc/prometheus/{rules,rules.d,files_sd} /var/lib/prometheus && \
cd /usr/share/prometheus-${PRM_RELEASE}.linux-amd64 && \
cp prometheus promtool /usr/local/bin/ && cp -r consoles/ console_libraries/ /etc/prometheus/ && \
cp /usr/share/prometheus-${PRM_RELEASE}.linux-amd64/prometheus.yml /etc/prometheus/ && \
chown -R prometheus:prometheus /etc/prometheus/ /var/lib/prometheus/ && \
chmod -R 775 /etc/prometheus/ /var/lib/prometheus/

# Install Grafana 
RUN wget -q -O - https://packages.grafana.com/gpg.key | apt-key add -
RUN echo "deb https://packages.grafana.com/oss/deb stable main" | tee -a /etc/apt/sources.list.d/grafana.list
RUN apt-get update && \
apt-get install grafana
 
COPY ./scripts/start.sh /usr/local/bin/

RUN chmod a+x /usr/local/bin/start.sh

WORKDIR /usr/local/bin/

ENTRYPOINT ["start.sh"]