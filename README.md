# Nuxt实现微信网页授权前后端分离（demo）

该项目目的在于
* 展示微信网页授权、JSSDK功能的前后端分离，提供最佳实践。
* 采用单页（SPA）的开发模式，便于与当前的开发技术接（ZHUANG）轨（BI）。而且可以通过netlify这样的静态托管服务器来托管前端页面（甚至是调试），确实带来比较多便利。
* 展示如何使用优秀的PHP wechat库（EasyWechat）来实现服务端，EasyWechat官方文档主要是采用middleware形式实现微信网页授权，无法进行前后端分离。通过官方文档的学习比较难实现从前端code到user这段子流程。话说自己从头造轮子也不是什么难事，但毕竟违背了当今DRY的软件开发理念。
项目分为server+client。
* 本人为业余软件开发爱好者，第一次分享代码，如果有用还请star，帮忙改进代码。

## server
采用更快实现服务器，采用laravel，overtrue/laralve-wechat实现后台功能，核心代码非常简单。
```php
    // Route::get('oauth/{code}')
    public function oauth($code)
    {
        try {
            $oauth = app('wechat.official_account')->oauth;
            $accessToken = $oauth->getAccessToken($code);
            $user        = $oauth->user($accessToken);
            return $user;
        } catch (\Exception $e) {
            return abort(401, $e->getMessage());
        }
    }

    // Route::post('jssdk')
    public function jssdk()
    {
        $url       = request('url');
        $jsApiList = request('jsApiList');
        $jssdk     = app('wechat.official_account')->jssdk;
        $jssdk->setUrl($url);
        return $jssdk->buildConfig($jsApiList);
    }
```



### 初始化项目
```bash
cd server
composer install
cp .env.example .env
```

### 然后编辑.env文档，配置一下配置项
```
WECHAT_OFFICIAL_ACCOUNT_APPID
WECHAT_OFFICIAL_ACCOUNT_SECRET
MOCK_WECHAT_OPENID
MOCK_WECHAT_NICKNAME
MOCK_WECHAT_HEADIMGURL
```

### 运行服务器：
```bash
php artisan serve
```

## client
采用nuxt.js的vue.js通用框架，通过插件、中间件实现微信授权。为什么使用nuxt的原因：
* Vue.js刚刚学，怕写出来的代码被笑。刚接触Nuxt不久，发现将Nuxt提供更分层，目录结构都是一种最佳实践。更容易表达前后端分离的功能逻辑。

### 初始化项目
```bash
cd client
yarn install
cp env.example.js env.js
```

### 然后编辑env.js文档，配置以下关键配置项
```
wechatAppid
appBaseUrl
apiBaseUrl
```
注意url结尾不带【/】，例如http://example.com/api

env.js读取NODE_ENV，实现production/development两种环境的自动切换。大大降低微信开发时需要采用生产服务器进行调试网页授权和jssdk的切换配置的麻烦。
* 当运行```yarn run dev```自动读取dev配置
* 当执行```yarn generate```自动读取prod配置

### 关于前端一些技术实现细节的说明
* 采用lscache包用于保存微信授权信息到localStorage中，失效时间可以在env.js中配置
* 微信授权（middleware/wechatAuth.js）共有【前端直接mock】、【服务器mock】、【真实环境】三种模式，三种模式顺序执行，通过env.js配置开关，第一种方便本地调试，第二种方面在服务器加入jwt，写数据等操作，更符合开发调试。
* wechatAuth插件目前state前端跳转前生产的随机字符串，可以保存到localStorage中回调后校验。目前没有启用，感觉没必要。

### 关于真实环境实现的细节说明
* 跳转url直接取当前的路径链接，如果当前的路劲已经是之前微信授权过的，失效后需要再次跳转授权，那么会去除其中的code和state两个查询参数（query）
* 授权回调后，会调用服务器oauth接口，将code换取一个Socialite回来，写入到vuex store，同时利用lscache库写入到localStorage。
* localStorage的失效时间由lscache实现。

### nuxt中的微信授权中间件使用
参考pages/wechat.vue，核心代码为：
```js
  computed: {
    wechatUser() {
      return this.$store.state.wechat.user
    }
  },

  middleware: ['wechatAuth']
```


# 参考
[wkl007/vue-wechat-login](https://github.com/wkl007/vue-wechat-login/blob/master/src/plugins/wechatAuth.js)

其他用到的依赖就不在此一一致谢了
