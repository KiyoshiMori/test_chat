eval "$(ssh-agent -s)"
chmod 600 travis_key
mv travis_key ~/.ssh/id_rsa
ssh-add ~/.ssh/id_rsa