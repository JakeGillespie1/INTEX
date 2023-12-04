#!/usr/bin/env bash
# Place in .platform/hooks/postdeploy directory
sudo certbot -n -d intexfall23-env.eba-ixb2fd32.us-west-1.elasticbeanstalk.com/ --nginx --agree-tos --email gabrieljosephlarson@gmail.com