# hexo-myadmin

a hexo dashboard plugin, for live hexo server.


## Screenshots

![posts view](doc/post.jpeg?raw=true)

![editor view](doc/edit.jpeg?raw=true)

![login view](doc/login.jpeg?raw=true)


## USAGE

```bash
    # install hexo-myadmin
    hexo i hexo-myadmin --save

    # start server with global hexo-cli
    hexo server

    # or with pm2 as deamon
    pm2 start node_modules/.bin/hexo -- server

    # visit localhost:4000/admin

```

## Password Protection

you can add a few config variables to your hexo `_config.yml`:

```
admin:
  username: myfavoritename
  password_hash: be121740bf988b2225a313fa1f107ca1
  secret: a secret something
```

The `password_hash` is the bcrypt hash of your password. You can use [this
site](https://www.bcrypt-generator.com/) to come up with that, or whatever you
want. The `secret` is used to make the cookies secure, so it's a good idea to
have it be long and complicated.

## Thanks

[hexo-admin](https://www.npmjs.com/hexo-admin)

### Contribute
- let me know how it can be improved in the [github issues](https://github.com/thesadabc/hexo-myadmin/issues)
- [fork](https://github.com/thesadabc/hexo-myadmin) and pull-request
