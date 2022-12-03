# # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# # # #              pia.webmail.com CONTAINER    # # # #
# # # #  Serving a webpage through NGINX          # # # #
# # # # # # # # # # # # # # # # # # # # # # # # # # # # #

FROM debian:latest

# # # #         Update and installation           # # # #
RUN apt-get update
RUN apt-get install nginx -y

# # # #    Adding frontend files to container     # # # #
ADD ./www /var/www/html/

# # # #           Copies certificates             # # # #
COPY ./piawebmail.crt /etc/nginx/certs/piawebmail.crt
COPY ./piawebmail.key /etc/nginx/certs/piawebmail.key

# # # #        Copies NGINX configuration         # # # #
COPY nginx.conf /etc/nginx/conf.d/nginx.conf

# # # #              Exposes ports                # # # #
EXPOSE 80
EXPOSE 443

CMD ["nginx","-g","daemon off;"]