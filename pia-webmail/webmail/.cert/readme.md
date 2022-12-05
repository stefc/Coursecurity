# Creating the certificate for development

* install `openssl`

* List curves `openssl ecparam -list_curves`

* Create key `openssl ecparam -name prime256v1 -genkey -out piawebmail.key`

* in `./cert` folder run ```openssl req -x509 -key piawebmail.key -sha256 -out piawebmail.crt -days 365 -config piawebmail.conf -new -nodes```


* install cert (Windows) 
  - open the start menu and type "certificates".
  - select "Manage Computer Certificates"
  - expand "Trusted Root Ceritification Authorities"
  - right click on "Certificates" and select "All Tasks" -> "Import".
  - click next
  - enter the path for the crt file.
  - proceed through the next few screens to import the certificate

