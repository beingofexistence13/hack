## passport-weixin
passport oauth2 strategy for weixin and weapp

### Install

```bash
npm install passport-weixin
```

### Usage

```js
var passport = require('passport')
  , WeixinStrategy = require('passport-weixin')
  ;
//扫码登录
//微信官网文档：https://open.weixin.qq.com/cgi-bin/showdocument?action=dir_list&t=resource/res_list&verify=1&id=open1419316505&token=&lang=zh_DX
passport.use('loginByWeixin',new WeixinStrategy({
  clientID: 'CLIENTID'
  , clientSecret: 'CLIENT SECRET'
  , callbackURL: 'CALLBACK URL'
  , requireState: false
  , scope: 'snsapi_login'
}, function(accessToken, refreshToken, profile, done){
  done(null, profile);
}));

//微信客户端登录
//微信官网文档：http://mp.weixin.qq.com/wiki/17/c0f37d5704f0b64713d5d2c37b468d75.html
passport.use('loginByWeixinClient',new WeixinStrategy({
  clientID: 'CLIENTID'
  , clientSecret: 'CLIENT SECRET'
  , callbackURL: 'CALLBACK URL'
  , requireState: false
  , authorizationURL: 'https://open.weixin.qq.com/connect/oauth2/authorize' //[公众平台-网页授权获取用户基本信息]的授权URL 不同于[开放平台-网站应用微信登录]的授权URL
  , scope: 'snsapi_userinfo' //[公众平台-网页授权获取用户基本信息]的应用授权作用域 不同于[开放平台-网站应用微信登录]的授权URL
}, function(accessToken, refreshToken, profile, done){
  done(null, profile);
}));

```

路由配置如下

```js
    //在PC端通过扫描登录，使用/auth/loginByWeixin
    app.get("/auth/loginByWeixin",
        passport.authenticate('loginByWeixin',{ successRedirect: '/test/hello',
            failureRedirect: '/login' })
    );

    //在微信客户端登录，使用/auth/loginByWeixinClient
    app.get("/auth/loginByWeixinClient",
        passport.authenticate('loginByWeixinClient',{ successRedirect: '/test/hello',
            failureRedirect: '/login' })
    );
```

### Weapp 微信小程序

#### 配置
test/bootstrap/providers.json
```json
...
    "clientID": "替换为自己的小程序AppID",
    "clientSecret": "替换为自己的小程序AppSecret",
...
```

#### 启动测试服务
```bash
# npm install
# npm start
```

#### HTTPS
由于小程序只支持HTTPS，需要将weapp passport server放在某HTTPS的反向代理后面才可以。类似下面2种途径
- `brew install nginx` and config ...
- `docker run -v ${PWD}/nginx/conf.d:/etc/nginx/conf.d -v ${PWD}/nginx/certs:/etc/nginx/certs -d -p 443:443 nginx`

### License
